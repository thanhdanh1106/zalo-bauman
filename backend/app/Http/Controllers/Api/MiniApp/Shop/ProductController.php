<?php

namespace App\Http\Controllers\Api\MiniApp\Shop;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Shop\Product;
use App\Models\Shop\ProductCategory;
use App\Models\Shop\Brand;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['productCategories', 'image', 'images'])->where('is_visible', true);
        
        if ($request->has('category_ids')) {
            $categoryIds = explode(',', $request->query('category_ids'));
            $query->whereHas('productCategories', function($q) use ($categoryIds) {
                $q->whereIn('product_category_id', $categoryIds);
            });
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->query('search') . '%');
        }

        $products = $query->paginate($request->query('limit', 12));

        $data = collect($products->items())->map(function($prod) {
            return $this->transformProduct($prod);
        });

        return response()->json([
            'error' => false,
            'data' => $data,
            'meta' => [
                'total' => $products->total(),
                'per_page' => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
            ]
        ]);
    }

    public function show($id)
    {
        $prod = Product::with(['productCategories', 'image', 'images'])->find($id);
        
        if (!$prod) {
            return response()->json(['error' => true, 'message' => 'Sản phẩm không tồn tại'], 404);
        }

        return response()->json([
            'error' => false,
            'data' => $this->transformProduct($prod)
        ]);
    }

    public function showBySlug($slug)
    {
        $prod = Product::with(['productCategories', 'image', 'images'])
            ->where('slug', $slug)
            ->orWhere('id', $slug)
            ->first();

        if (!$prod) {
            $prod = Product::with(['productCategories', 'image'])
                ->where('is_visible', true)
                ->get()
                ->first(function ($p) use ($slug) {
                    return Str::slug($p->name) === $slug;
                });
        }

        if (!$prod) {
            return response()->json(['error' => true, 'message' => 'Sản phẩm không tồn tại'], 404);
        }

        return response()->json([
            'error' => false,
            'data' => $this->transformProduct($prod)
        ]);
    }

    public function categories(Request $request)
    {
        $categories = ProductCategory::with(['image'])->where('is_visible', true)
            ->paginate($request->query('per_page', 12));

        $data = collect($categories->items())->map(function($cat) {
            $imageUrl = $cat->image?->url ?: $cat->getFirstMediaUrl('category-images');
            
            if ($imageUrl && !filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                $imageUrl = url($imageUrl);
            }
            
            return [
                'id' => $cat->id,
                'name' => $cat->name,
                'image' => $imageUrl ?: "https://placehold.co/300x300?text=Category"
            ];
        });

        return response()->json([
            'error' => false,
            'data' => $data,
            'meta' => [
                'total' => $categories->total(),
                'per_page' => $categories->perPage(),
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
            ]
        ]);
    }

    public function brands(Request $request)
    {
        $brands = Brand::where('is_visible', true)
            ->paginate($request->query('per_page', 12));

        $data = collect($brands->items())->map(function($brand) {
            return [
                'id' => $brand->id,
                'name' => $brand->name,
                'website' => $brand->website,
            ];
        });

        return response()->json([
            'error' => false,
            'data' => $data,
            'meta' => [
                'total' => $brands->total(),
                'per_page' => $brands->perPage(),
                'current_page' => $brands->currentPage(),
                'last_page' => $brands->lastPage(),
            ]
        ]);
    }

    private function transformProduct($prod)
    {
        $imageUrl = $prod->image?->url ?: $prod->getFirstMediaUrl('product-images');
        
        if ($imageUrl && !filter_var($imageUrl, FILTER_VALIDATE_URL)) {
            $imageUrl = url($imageUrl);
        }

        $placeholder = "https://placehold.co/600x400?text=Product";
        $finalImage = $imageUrl ?: $placeholder;

        $gallery = [];
        $galleryUrls = [];

        if ($finalImage && $finalImage !== $placeholder) {
            $gallery[] = ['original_url' => $finalImage];
            $galleryUrls[] = $finalImage;
        }

        // Curator Gallery
        if ($prod->images) {
            foreach ($prod->images as $img) {
                if (!in_array($img->url, $galleryUrls)) {
                    $gallery[] = ['original_url' => $img->url];
                    $galleryUrls[] = $img->url;
                }
            }
        }

        // Spatie Gallery
        $media = $prod->getMedia('product-images');
        foreach ($media as $m) {
            $url = $m->getUrl();
            if (!in_array($url, $galleryUrls)) {
                $gallery[] = ['original_url' => $url];
                $galleryUrls[] = $url;
            }
        }

        if (empty($gallery)) {
            $gallery[] = ['original_url' => $placeholder];
        }

        return [
            'id' => $prod->id,
            'categoryId' => $prod->productCategories->first()?->id ?? 1,
            'name' => $prod->name,
            'title' => $prod->name,
            'slug' => $prod->slug ?: Str::slug($prod->name),
            'price' => (int)$prod->price,
            'originalPrice' => (int)$prod->old_price,
            'price_old' => (int)$prod->old_price,
            'image' => $finalImage,
            'thumbnail' => ["original_url" => $finalImage],
            'gallery' => $gallery,
            'detail' => $prod->description,
            'description' => $prod->description,
            'sku' => $prod->sku ?? 'SKU-'.$prod->id,
            'is_featured' => $prod->featured,
            'stock' => (int)$prod->qty,
            'status' => $prod->is_visible ? 'published' : 'draft',
        ];
    }
}
