<?php

namespace App\Filament\Imports\Shop;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Awcodes\Curator\Models\Media;
use Exception;
use App\Models\Shop\Product;
use Filament\Actions\Imports\ImportColumn;
use Filament\Actions\Imports\Importer;
use Filament\Actions\Imports\Models\Import;
use Illuminate\Support\Number;

class ProductImporter extends Importer
{
    protected static ?string $model = Product::class;

    public static function getColumns(): array
    {
        return [
            ImportColumn::make('brand')
                ->relationship(),
            ImportColumn::make('image')
                ->relationship(),
            ImportColumn::make('name')
                ->requiredMapping()
                ->rules(['required', 'max:255']),
            ImportColumn::make('slug')
                ->rules(['max:255']),
            ImportColumn::make('sku')
                ->label('SKU')
                ->rules(['max:255']),
            ImportColumn::make('barcode')
                ->rules(['max:255']),
            ImportColumn::make('description'),
            ImportColumn::make('qty')
                ->requiredMapping()
                ->numeric()
                ->rules(['required', 'integer']),
            ImportColumn::make('security_stock')
                ->requiredMapping()
                ->numeric()
                ->rules(['required', 'integer']),
            ImportColumn::make('featured')
                ->requiredMapping()
                ->boolean()
                ->rules(['required', 'boolean']),
            ImportColumn::make('is_visible')
                ->requiredMapping()
                ->boolean()
                ->rules(['required', 'boolean']),
            ImportColumn::make('old_price')
                ->numeric()
                ->rules(['integer']),
            ImportColumn::make('price')
                ->numeric()
                ->rules(['integer']),
            ImportColumn::make('cost')
                ->numeric()
                ->rules(['integer']),
            ImportColumn::make('type'),
            ImportColumn::make('backorder')
                ->requiredMapping()
                ->boolean()
                ->rules(['required', 'boolean']),
            ImportColumn::make('requires_shipping')
                ->requiredMapping()
                ->boolean()
                ->rules(['required', 'boolean']),
            ImportColumn::make('published_at')
                ->rules(['date']),
            ImportColumn::make('seo_title')
                ->rules(['max:60']),
            ImportColumn::make('seo_description')
                ->rules(['max:160']),
            ImportColumn::make('weight_value')
                ->numeric()
                ->rules(['integer']),
            ImportColumn::make('weight_unit')
                ->requiredMapping()
                ->rules(['required', 'max:255']),
            ImportColumn::make('height_value')
                ->numeric()
                ->rules(['integer']),
            ImportColumn::make('height_unit')
                ->requiredMapping()
                ->rules(['required', 'max:255']),
            ImportColumn::make('width_value')
                ->numeric()
                ->rules(['integer']),
            ImportColumn::make('width_unit')
                ->requiredMapping()
                ->rules(['required', 'max:255']),
            ImportColumn::make('depth_value')
                ->numeric()
                ->rules(['integer']),
            ImportColumn::make('depth_unit')
                ->requiredMapping()
                ->rules(['required', 'max:255']),
            ImportColumn::make('volume_value')
                ->numeric()
                ->rules(['integer']),
            ImportColumn::make('volume_unit')
                ->requiredMapping()
                ->rules(['required', 'max:255']),
            ImportColumn::make('image_url')
                ->label('Image URL'),
        ];
    }

    public function resolveRecord(): Product
    {
        return Product::firstOrNew([
            'sku' => $this->data['sku'],
        ]);
    }

    protected function beforeSave(): void
    {
        $imageUrl = $this->data['image_url'] ?? null;

        if ($imageUrl && filter_var($imageUrl, FILTER_VALIDATE_URL)) {
            try {
                $response = Http::get($imageUrl);
                if ($response->successful()) {
                    $contents = $response->body();
                    $filename = basename(parse_url($imageUrl, PHP_URL_PATH));
                    if (empty($filename)) {
                        $filename = Str::random(10) . '.jpg';
                    }
                    
                    $path = 'curator/' . Str::random(40) . '_' . $filename;
                    Storage::disk('public')->put($path, $contents);

                    $media = Media::create([
                        'disk' => 'public',
                        'directory' => 'curator',
                        'filename' => pathinfo($filename, PATHINFO_FILENAME),
                        'extension' => pathinfo($filename, PATHINFO_EXTENSION) ?: 'jpg',
                        'path' => $path,
                        'mime_type' => $response->header('Content-Type') ?: 'image/jpeg',
                        'size' => strlen($contents),
                        'width' => 0,
                        'height' => 0,
                    ]);

                    $this->record->image_id = $media->id;
                }
            } catch (Exception $e) {
                // Silent fail
            }
        }
    }


    public static function getCompletedNotificationBody(Import $import): string
    {
        $body = 'Your product import has completed and ' . Number::format($import->successful_rows) . ' ' . str('row')->plural($import->successful_rows) . ' imported.';

        if ($failedRowsCount = $import->getFailedRowsCount()) {
            $body .= ' ' . Number::format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to import.';
        }

        return $body;
    }
}
