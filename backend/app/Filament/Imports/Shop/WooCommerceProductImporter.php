<?php

namespace App\Filament\Imports\Shop;

use App\Models\Shop\Product;
use App\Models\Shop\ProductAttribute;
use App\Models\Shop\ProductAttributeValue;
use App\Models\Shop\ProductVariant;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Parser và importer CSV từ WooCommerce.
 *
 * Cách dùng:
 *   WooCommerceProductImporter::importFromCsv($pathToCsvFile);
 *
 * Hoặc qua Filament Action (xem WooCommerceImportAction).
 *
 * Cấu trúc CSV WooCommerce hỗ trợ:
 *   - simple    : sản phẩm đơn thông thường
 *   - variable  : sản phẩm cha có nhiều biến thể
 *   - variation : biến thể của sản phẩm variable (gắn vào cha qua parent_id hoặc tên cha)
 *   - grouped   : sản phẩm nhóm chứa nhiều sản phẩm con
 */
class WooCommerceProductImporter
{
    /** Hàng đã xử lý, keyed by woo_id hoặc SKU */
    protected array $processedProducts = [];

    /** Map woo_id => Product::id sau khi tạo */
    protected array $wooIdMap = [];

    /** Các grouped items cần gán sau khi tất cả sản phẩm đã được tạo */
    protected array $pendingGroupedItems = [];

    /** Các variation cần gắn parent sau khi parent tạo xong */
    protected array $pendingVariations = [];

    /** Đếm kết quả */
    protected int $created  = 0;
    protected int $updated  = 0;
    protected int $failed   = 0;
    protected array $errors = [];

    // ─── Public API ──────────────────────────────────────────────────────────

    /**
     * @param  string  $filePath  Đường dẫn tuyệt đối đến file CSV
     * @return array{created:int, updated:int, failed:int, errors:array}
     */
    public function importFromCsv(string $filePath): array
    {
        $rows = $this->parseCsv($filePath);

        if (empty($rows)) {
            return ['created' => 0, 'updated' => 0, 'failed' => 0, 'errors' => ['File CSV rỗng hoặc không đọc được.']];
        }

        // Pass 1: tạo tất cả sản phẩm simple, variable, grouped (chưa gán grouped items / variation parents)
        foreach ($rows as $row) {
            $type = strtolower(trim($row['Type'] ?? 'simple'));

            try {
                match ($type) {
                    'simple'    => $this->processSimple($row),
                    'variable'  => $this->processVariable($row),
                    'variation' => $this->processVariation($row),
                    'grouped'   => $this->processGrouped($row),
                    default     => $this->processSimple($row), // fallback
                };
            } catch (\Throwable $e) {
                $this->failed++;
                $this->errors[] = 'Hàng [' . ($row['Name'] ?? '?') . ']: ' . $e->getMessage();
                Log::error('WooCommerce import error', ['row' => $row, 'error' => $e->getMessage()]);
            }
        }

        // Pass 2: gán grouped items
        $this->resolveGroupedItems();

        return [
            'created' => $this->created,
            'updated' => $this->updated,
            'failed'  => $this->failed,
            'errors'  => $this->errors,
        ];
    }

    // ─── CSV Parsing ──────────────────────────────────────────────────────────

    protected function parseCsv(string $filePath): array
    {
        if (! file_exists($filePath)) {
            return [];
        }

        $rows    = [];
        $headers = [];

        // Đọc file, tự detect BOM UTF-8
        $handle = fopen($filePath, 'r');
        if (! $handle) {
            return [];
        }

        // Xử lý BOM UTF-8
        $bom = fread($handle, 3);
        if ($bom !== "\xEF\xBB\xBF") {
            rewind($handle);
        }

        $lineNum = 0;
        while (($line = fgetcsv($handle, 0, ',', '"', '\\')) !== false) {
            if ($lineNum === 0) {
                // Chuẩn hoá header — bỏ khoảng trắng và BOM
                $headers = array_map(fn ($h) => trim($h), $line);
            } else {
                if (count($line) === count($headers)) {
                    $rows[] = array_combine($headers, $line);
                }
            }
            $lineNum++;
        }

        fclose($handle);

        return $rows;
    }

    // ─── Process each type ────────────────────────────────────────────────────

    protected function processSimple(array $row): void
    {
        $product = $this->upsertProduct($row, 'simple');
        $this->downloadAndAttachImage($product, $row['Images'] ?? '');
    }

    protected function processVariable(array $row): void
    {
        $product = $this->upsertProduct($row, 'variable');
        $this->downloadAndAttachImage($product, $row['Images'] ?? '');
        $this->syncAttributes($product, $row, forVariations: true);
    }

    protected function processVariation(array $row): void
    {
        // Tìm product cha qua Parent (có thể là ID hoặc SKU cha)
        $parentSlug = trim($row['Parent'] ?? '');
        $parent     = null;

        if ($parentSlug) {
            // WooCommerce thường export "id:123" hoặc slug cha
            if (preg_match('/^id:(\d+)$/', $parentSlug, $m)) {
                $parent = Product::where('woo_id', $m[1])->first();
            } else {
                $parent = Product::where('slug', $parentSlug)
                    ->orWhere('name', $parentSlug)
                    ->first();
            }
        }

        if (! $parent) {
            // Lưu pending để gán sau pass 1
            $this->pendingVariations[] = $row;
            return;
        }

        $this->createVariantForParent($parent, $row);
    }

    protected function processGrouped(array $row): void
    {
        $product = $this->upsertProduct($row, 'grouped');
        $this->downloadAndAttachImage($product, $row['Images'] ?? '');

        // Ghi nhận các sản phẩm con để gán sau
        $childSlugs = array_filter(array_map('trim', explode(',', $row['Grouped products'] ?? '')));
        if (! empty($childSlugs)) {
            $this->pendingGroupedItems[$product->id] = $childSlugs;
        }
    }

    // ─── Core upsert ─────────────────────────────────────────────────────────

    protected function upsertProduct(array $row, string $wooType): Product
    {
        $sku   = trim($row['SKU'] ?? '');
        $wooId = trim($row['ID'] ?? '');
        $name  = trim($row['Name'] ?? '');

        // Tìm sản phẩm đã tồn tại theo SKU hoặc woo_id
        $product = null;
        if ($sku) {
            $product = Product::where('sku', $sku)->first();
        }
        if (! $product && $wooId) {
            $product = Product::where('woo_id', $wooId)->first();
        }

        $isNew   = ! $product;
        $product = $product ?? new Product();

        // Map các trường cơ bản
        $product->fill([
            'name'              => $name ?: $product->name,
            'slug'              => $this->buildSlug($row, $product),
            'sku'               => $sku ?: null,
            'description'       => strip_tags($row['Description'] ?? '') ?: null,
            'price'             => $this->parsePrice($row['Regular price'] ?? ''),
            'old_price'         => $this->parsePrice($row['Sale price'] ?? ''),
            'is_visible'        => $this->parseBool($row['Published'] ?? '1'),
            'featured'          => $this->parseBool($row['Featured'] ?? '0'),
            'qty'               => (int) ($row['Stock'] ?? 0),
            'backorder'         => in_array(strtolower($row['Backorders allowed'] ?? ''), ['yes', '1', 'true', 'notify']),
            'requires_shipping' => ! in_array(strtolower($row['Shipping class'] ?? ''), ['virtual', 'downloadable']),
            'weight_value'      => $this->parseDecimal($row['Weight (kg)'] ?? ''),
            'woo_type'          => $wooType,
            'woo_id'            => $wooId ?: null,
            'published_at'      => $this->parseDate($row['Date published'] ?? ''),
            'seo_title'         => mb_substr(trim($row['Meta: _yoast_wpseo_title'] ?? $row['Meta title'] ?? ''), 0, 60) ?: null,
            'seo_description'   => mb_substr(trim($row['Meta: _yoast_wpseo_metadesc'] ?? $row['Meta description'] ?? ''), 0, 160) ?: null,
        ]);

        // Không override các trường bắt buộc default
        if ($isNew) {
            $product->security_stock = $product->security_stock ?? 0;
            $product->weight_unit    = 'kg';
            $product->height_unit    = 'cm';
            $product->width_unit     = 'cm';
            $product->depth_unit     = 'cm';
            $product->volume_unit    = 'l';
        }

        $product->save();

        // Map woo_id để dùng sau
        if ($wooId) {
            $this->wooIdMap[$wooId] = $product->id;
        }

        $isNew ? $this->created++ : $this->updated++;

        return $product;
    }

    // ─── Attributes ──────────────────────────────────────────────────────────

    /**
     * Đồng bộ thuộc tính từ các cột WooCommerce CSV:
     *   Attribute 1 name | Attribute 1 value(s) | Attribute 1 visible | Attribute 1 global
     *   Attribute 2 name | Attribute 2 value(s) ...
     */
    protected function syncAttributes(Product $product, array $row, bool $forVariations = false): void
    {
        $position = 0;

        for ($i = 1; $i <= 10; $i++) {
            $attrName   = trim($row["Attribute {$i} name"] ?? '');
            $attrValues = trim($row["Attribute {$i} value(s)"] ?? '');

            if (! $attrName) {
                break;
            }

            $isVisible = $this->parseBool($row["Attribute {$i} visible"] ?? '1');
            $isGlobal  = $this->parseBool($row["Attribute {$i} global"] ?? '0');

            // Upsert attribute
            /** @var ProductAttribute $attr */
            $attr = $product->attributes()->updateOrCreate(
                ['name' => $attrName],
                [
                    'slug'          => Str::slug($attrName),
                    'is_visible'    => $isVisible,
                    'for_variations'=> $forVariations,
                    'position'      => $position++,
                ]
            );

            // Upsert các giá trị (phân cách bởi | trong WooCommerce)
            $values   = array_filter(array_map('trim', explode('|', $attrValues)));
            $valPos   = 0;
            foreach ($values as $val) {
                ProductAttributeValue::updateOrCreate(
                    ['product_attribute_id' => $attr->id, 'value' => $val],
                    ['position' => $valPos++]
                );
            }
        }
    }

    // ─── Variants ────────────────────────────────────────────────────────────

    protected function createVariantForParent(Product $parent, array $row): void
    {
        // Thu thập attributes của variation này
        $attributes = [];
        for ($i = 1; $i <= 10; $i++) {
            $attrName  = trim($row["Attribute {$i} name"] ?? '');
            $attrValue = trim($row["Attribute {$i} value(s)"] ?? '');
            if ($attrName && $attrValue) {
                $attributes[$attrName] = $attrValue;
            }
        }

        $sku = trim($row['SKU'] ?? '');

        /** @var ProductVariant $variant */
        $variant = ProductVariant::updateOrCreate(
            [
                'product_id' => $parent->id,
                'sku'        => $sku ?: null,
            ],
            [
                'price'       => $this->parsePrice($row['Regular price'] ?? ''),
                'old_price'   => $this->parsePrice($row['Sale price'] ?? ''),
                'qty'         => (int) ($row['Stock'] ?? 0),
                'is_visible'  => $this->parseBool($row['Published'] ?? '1'),
                'weight_value'=> $this->parseDecimal($row['Weight (kg)'] ?? ''),
                'weight_unit' => 'kg',
                'attributes'  => $attributes,
                'image_url'   => $this->firstImageUrl($row['Images'] ?? ''),
            ]
        );

        // Tải hình biến thể
        $imageUrl = $this->firstImageUrl($row['Images'] ?? '');
        if ($imageUrl && ! $variant->image_id) {
            $mediaId = $this->downloadImageToMedia($imageUrl);
            if ($mediaId) {
                $variant->update(['image_id' => $mediaId]);
            }
        }

        // Cũng tạo Product con (variation) nếu muốn tìm kiếm riêng theo SKU
        if ($sku) {
            $childProduct = Product::firstOrNew(['sku' => $sku]);
            $childProduct->fill([
                'name'             => $parent->name . ' - ' . implode(' / ', $attributes),
                'parent_product_id'=> $parent->id,
                'woo_type'         => 'variation',
                'is_visible'       => false, // Ẩn, chỉ hiện qua parent
                'price'            => $variant->price,
                'old_price'        => $variant->old_price,
                'qty'              => $variant->qty,
                'security_stock'   => 0,
                'weight_unit'      => 'kg',
                'height_unit'      => 'cm',
                'width_unit'       => 'cm',
                'depth_unit'       => 'cm',
                'volume_unit'      => 'l',
            ]);
            $childProduct->save();
        }
    }

    // ─── Grouped ────────────────────────────────────────────────────────────

    /**
     * Pass 2: sau khi tất cả sản phẩm đã tạo, gán grouped items
     */
    protected function resolveGroupedItems(): void
    {
        foreach ($this->pendingGroupedItems as $parentId => $childSlugs) {
            $parent = Product::find($parentId);
            if (! $parent) {
                continue;
            }

            $position = 0;
            foreach ($childSlugs as $childSlug) {
                // slug có thể là "id:123" hoặc slug thực
                $child = null;
                if (preg_match('/^id:(\d+)$/', $childSlug, $m)) {
                    $child = Product::where('woo_id', $m[1])->first();
                }
                if (! $child) {
                    $child = Product::where('slug', $childSlug)
                        ->orWhere('sku', $childSlug)
                        ->first();
                }

                if ($child) {
                    $parent->groupedChildren()->syncWithoutDetaching([
                        $child->id => ['position' => $position++],
                    ]);
                }
            }
        }

        // Gán các pending variations
        foreach ($this->pendingVariations as $row) {
            $parentSlug = trim($row['Parent'] ?? '');
            $parent     = null;

            if (preg_match('/^id:(\d+)$/', $parentSlug, $m)) {
                $parent = Product::where('woo_id', $m[1])->first();
            }
            if (! $parent) {
                $parent = Product::where('slug', $parentSlug)
                    ->orWhere('name', $parentSlug)
                    ->first();
            }

            if ($parent) {
                try {
                    $this->createVariantForParent($parent, $row);
                } catch (\Throwable $e) {
                    $this->failed++;
                    $this->errors[] = 'Variation [' . ($row['Name'] ?? '?') . ']: ' . $e->getMessage();
                }
            } else {
                $this->failed++;
                $this->errors[] = 'Không tìm thấy sản phẩm cha cho variation: ' . ($row['Name'] ?? '?');
            }
        }
    }

    // ─── Image helpers ────────────────────────────────────────────────────────

    protected function downloadAndAttachImage(Product $product, string $imagesField): void
    {
        if ($product->image_id) {
            return; // Đã có ảnh, không ghi đè
        }

        $url = $this->firstImageUrl($imagesField);
        if (! $url) {
            return;
        }

        $mediaId = $this->downloadImageToMedia($url);
        if ($mediaId) {
            $product->update(['image_id' => $mediaId]);
        }
    }

    protected function firstImageUrl(string $imagesField): ?string
    {
        if (! $imagesField) {
            return null;
        }
        // WooCommerce ngăn cách nhiều ảnh bằng dấu phẩy
        $urls = array_filter(array_map('trim', explode(',', $imagesField)));

        return $urls[0] ?? null;
    }

    protected function downloadImageToMedia(string $url): ?int
    {
        if (! filter_var($url, FILTER_VALIDATE_URL)) {
            return null;
        }

        try {
            $response = Http::timeout(15)->get($url);
            if (! $response->successful()) {
                return null;
            }

            $contents       = $response->body();
            $filename       = basename(parse_url($url, PHP_URL_PATH));
            $filename       = $filename ?: Str::random(10) . '.jpg';
            $extension      = pathinfo($filename, PATHINFO_EXTENSION) ?: 'jpg';
            $filenameClean  = pathinfo($filename, PATHINFO_FILENAME);

            $storagePath = 'curator/' . Str::random(40) . '_' . $filename;
            Storage::disk('public')->put($storagePath, $contents);

            $media = \Awcodes\Curator\Models\Media::create([
                'disk'      => 'public',
                'directory' => 'curator',
                'filename'  => $filenameClean,
                'extension' => $extension,
                'path'      => $storagePath,
                'mime_type' => $response->header('Content-Type') ?: 'image/jpeg',
                'size'      => strlen($contents),
                'width'     => 0,
                'height'    => 0,
            ]);

            return $media->id;
        } catch (\Throwable $e) {
            Log::warning('WooCommerce import: không tải được ảnh', ['url' => $url, 'error' => $e->getMessage()]);
            return null;
        }
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    protected function buildSlug(array $row, Product $existing): string
    {
        $slug = trim($row['Slug'] ?? '');
        if ($slug) {
            return $slug;
        }

        $name = trim($row['Name'] ?? '');
        if ($name) {
            $base = Str::slug($name);
            // Tránh trùng slug
            $candidate = $base;
            $counter   = 1;
            while (
                Product::where('slug', $candidate)
                    ->where('id', '!=', $existing->id ?? 0)
                    ->exists()
            ) {
                $candidate = $base . '-' . $counter++;
            }

            return $candidate;
        }

        return $existing->slug ?? Str::random(8);
    }

    protected function parsePrice(string $value): ?float
    {
        $value = preg_replace('/[^\d.]/', '', $value);

        return $value !== '' ? (float) $value : null;
    }

    protected function parseDecimal(string $value): ?float
    {
        $value = preg_replace('/[^\d.]/', '', $value);

        return $value !== '' ? (float) $value : null;
    }

    protected function parseBool(string|int $value): bool
    {
        return in_array(strtolower((string) $value), ['1', 'yes', 'true', 'publish', 'published']);
    }

    protected function parseDate(string $value): ?string
    {
        if (! $value) {
            return null;
        }

        try {
            return \Carbon\Carbon::parse($value)->toDateString();
        } catch (\Throwable) {
            return null;
        }
    }
}
