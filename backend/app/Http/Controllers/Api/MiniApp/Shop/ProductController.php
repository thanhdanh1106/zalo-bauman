<?php

namespace App\Http\Controllers\Api\MiniApp\Shop;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Shop\Product;
use App\Models\Shop\ProductCategory;
use App\Models\Shop\Brand;
use App\Models\Comment;
use App\Models\Shop\Customer;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['productCategories', 'image', 'images', 'variants.image'])->where('is_visible', true);
        
        if ($request->has('category_ids')) {
            $categoryIds = explode(',', $request->query('category_ids'));
            $query->whereHas('productCategories', function($q) use ($categoryIds) {
                $q->whereIn('product_category_id', $categoryIds);
            });
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->query('search') . '%');
        }

        if ($request->has('sort')) {
            $sort = $request->query('sort');
            $order = $request->query('order', 'desc');
            if (in_array($sort, ['views', 'sold_count', 'price', 'created_at'])) {
                $query->orderBy($sort, $order);
                if ($sort === 'sold_count') {
                    $query->orderBy('views', 'desc');
                }
            }
        } else {
            $query->orderBy('id', 'desc');
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
        $prod = Product::with(['productCategories', 'image', 'images', 'variants.image', 'comments.customer'])->find($id);
        
        if (!$prod) {
            return response()->json(['error' => true, 'message' => 'Sản phẩm không tồn tại'], 404);
        }

        $prod->increment('views');

        return response()->json([
            'error' => false,
            'data' => $this->transformProduct($prod)
        ]);
    }

    public function showBySlug($slug)
    {
        $prod = Product::with(['productCategories', 'image', 'images', 'variants.image', 'comments.customer'])
            ->where('slug', $slug)
            ->orWhere('id', $slug)
            ->first();

        if (!$prod) {
            $prod = Product::with(['productCategories', 'image', 'variants.image', 'comments.customer'])
                ->where('is_visible', true)
                ->get()
                ->first(function ($p) use ($slug) {
                    return Str::slug($p->name) === $slug;
                });
        }

        if (!$prod) {
            return response()->json(['error' => true, 'message' => 'Sản phẩm không tồn tại'], 404);
        }

        $prod->increment('views');

        return response()->json([
            'error' => false,
            'data' => $this->transformProduct($prod)
        ]);
    }

    public function storeComment(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $prod = Product::find($id);
        if (!$prod) {
            return response()->json(['error' => true, 'message' => 'Sản phẩm không tồn tại'], 404);
        }

        $user = $request->user('sanctum');
        $email = optional($user)->email ?? ('customer_' . md5(request()->ip() . time()) . '@example.com');
        $name = optional($user)->name ?? 'Khách hàng';

        $customer = Customer::where('email', $email)->first();
        if (!$customer) {
            $customer = Customer::create([
                'name' => $name,
                'email' => $email,
            ]);
        }

        $comment = new Comment([
            'customer_id' => $customer->id,
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'rating' => $request->input('rating'),
            'is_visible' => true,
        ]);

        $prod->comments()->save($comment);

        $avgRating = $prod->comments()->where('is_visible', true)->avg('rating');
        if ($avgRating) {
            $prod->update(['rating' => round($avgRating, 1)]);
        }

        // Return updated product or comment details
        return response()->json([
            'error' => false,
            'message' => 'Đánh giá sản phẩm thành công',
            'data' => [
                'id' => $comment->id,
                'title' => $comment->title,
                'content' => $comment->content,
                'rating' => $comment->rating,
                'created_at' => $comment->created_at->format('d/m/Y H:i'),
                'customer' => [
                    'name' => $customer->name,
                    'avatar' => optional(optional($user)->avatar)->url ?: "https://placehold.co/100x100?text=" . urlencode(mb_substr($customer->name ?: 'U', 0, 1)),
                ]
            ]
        ]);
    }

    public function categories(Request $request)
    {
        $categories = ProductCategory::with(['image'])->where('is_visible', true)
            ->paginate($request->query('per_page', 12));

        $data = collect($categories->items())->map(function($cat) {
            $imageUrl = $cat->image?->medium_url ?: ($cat->image?->url ?: $cat->getFirstMediaUrl('category-images'));
            
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
        $imageUrl = $prod->image?->medium_url ?: ($prod->image?->url ?: $prod->getFirstMediaUrl('product-images'));
        
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
                $imgUrl = $img->medium_url ?: $img->url;
                if ($imgUrl && !filter_var($imgUrl, FILTER_VALIDATE_URL)) {
                    $imgUrl = url($imgUrl);
                }
                if (!in_array($imgUrl, $galleryUrls)) {
                    $gallery[] = ['original_url' => $imgUrl];
                    $galleryUrls[] = $imgUrl;
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

        $mappedVariants = collect();
        if ($prod->variants && $prod->variants->isNotEmpty()) {
            $mappedVariants = $prod->variants->map(function($v) {
                $vImg = $v->image?->medium_url ?: ($v->image?->url ?: $v->image_url);
                if ($vImg && !filter_var($vImg, FILTER_VALIDATE_URL)) {
                    $vImg = url($vImg);
                }
                return [
                    'id' => $v->id,
                    'sku' => $v->sku ?: 'VAR-'.$v->id,
                    'price' => (float)$v->price,
                    'old_price' => $v->old_price ? (float)$v->old_price : null,
                    'sale_price' => $v->sale_price ? (float)$v->sale_price : null,
                    'effective_price' => (float)($v->sale_price ?? $v->price),
                    'qty' => (int)$v->qty,
                    'display_label' => $v->display_label ?? ($v->weight_value ? $v->weight_value . ' ' . ($v->weight_unit ?? 'g') : ($v->sku ?? 'Biến thể')),
                    'image' => $vImg,
                    'weight_value' => $v->weight_value ? (float)$v->weight_value : null,
                    'weight_unit' => $v->weight_unit,
                ];
            });
        } elseif ($prod->variations && $prod->variations->isNotEmpty()) {
            $mappedVariants = $prod->variations->map(function($child) use ($prod) {
                $vImg = $child->image?->medium_url ?: ($child->image?->url ?: null);
                if ($vImg && !filter_var($vImg, FILTER_VALIDATE_URL)) {
                    $vImg = url($vImg);
                }
                $label = trim(str_replace($prod->name . ' - ', '', $child->name));
                return [
                    'id' => $child->id,
                    'sku' => $child->sku ?: 'VAR-'.$child->id,
                    'price' => (float)$child->price,
                    'old_price' => $child->old_price ? (float)$child->old_price : null,
                    'sale_price' => null,
                    'effective_price' => (float)$child->price,
                    'qty' => (int)$child->qty,
                    'display_label' => $label ?: ($child->weight_value ? $child->weight_value . ' ' . ($child->weight_unit ?? 'g') : 'Biến thể'),
                    'image' => $vImg,
                    'weight_value' => $child->weight_value ? (float)$child->weight_value : null,
                    'weight_unit' => $child->weight_unit,
                ];
            });
        } elseif ($prod->groupedChildren && $prod->groupedChildren->isNotEmpty()) {
            $mappedVariants = $prod->groupedChildren->map(function($child) {
                $vImg = $child->image?->medium_url ?: ($child->image?->url ?: null);
                if ($vImg && !filter_var($vImg, FILTER_VALIDATE_URL)) {
                    $vImg = url($vImg);
                }
                return [
                    'id' => $child->id,
                    'sku' => $child->sku ?: 'GRP-'.$child->id,
                    'price' => (float)$child->price,
                    'old_price' => $child->old_price ? (float)$child->old_price : null,
                    'sale_price' => null,
                    'effective_price' => (float)$child->price,
                    'qty' => (int)$child->qty,
                    'display_label' => $child->name,
                    'image' => $vImg,
                    'weight_value' => $child->weight_value ? (float)$child->weight_value : null,
                    'weight_unit' => $child->weight_unit,
                ];
            });
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
            'views' => (int)($prod->views ?? 0),
            'soldCount' => (int)($prod->sold_count ?? 0),
            'rating' => (float)($prod->rating ?? 5.0),
            'affiliate_commission_rate' => (float)($prod->affiliate_commission_rate ?? 10.0),
            'affiliate_reward_points' => (int)($prod->affiliate_reward_points ?? 100),
            'is_sold_by_gram' => (bool)$prod->is_sold_by_gram,
            'sales_unit' => $prod->sales_unit,
            'min_gram' => $prod->min_gram ? (float)$prod->min_gram : null,
            'gram_step' => $prod->gram_step ? (float)$prod->gram_step : null,
            'gram_options' => $prod->gram_options,
            'weight' => $prod->weight_value ? (float)$prod->weight_value : null,
            'dimensions' => null,
            'volume' => null,
            'variants' => $mappedVariants->values()->toArray(),
            'comments' => $prod->relationLoaded('comments') ? $prod->comments->where('is_visible', true)->map(function($c) {
                return [
                    'id' => $c->id,
                    'title' => $c->title,
                    'content' => $c->content,
                    'rating' => (int)($c->rating ?? 5),
                    'created_at' => $c->created_at?->format('d/m/Y H:i') ?? '',
                    'customer' => [
                        'name' => optional($c->customer)->name ?? 'Khách hàng',
                        'avatar' => optional($c->customer)->avatar ?? 'https://placehold.co/100x100?text=U',
                    ]
                ];
            })->values()->toArray() : [],
        ];
    }
}
