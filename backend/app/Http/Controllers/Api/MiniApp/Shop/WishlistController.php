<?php

namespace App\Http\Controllers\Api\MiniApp\Shop;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WishlistItem;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $items = WishlistItem::with(['product.image'])
            ->where('user_id', $user->id)
            ->get();

        $data = $items->map(function ($item) {
            $prod = $item->product;
            if (!$prod) return null;
            
            $imageUrl = $prod->image?->url ?: $prod->getFirstMediaUrl('product-images');
            if ($imageUrl && !filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                $imageUrl = url($imageUrl);
            }
            $finalImage = $imageUrl ?: url("/images/product-placeholder.png");

            return [
                'id' => $prod->id,
                'name' => $prod->name,
                'price' => (int)$prod->price,
                'image' => $finalImage,
                'thumbnail' => ["original_url" => $finalImage],
                'sku' => $prod->sku,
            ];
        })->filter()->values();

        return response()->json(['error' => false, 'data' => $data]);
    }

    public function toggle(Request $request)
    {
        $user = $request->user();
        $productId = $request->product_id;

        $item = WishlistItem::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($item) {
            $item->delete();
            return response()->json(['error' => false, 'message' => 'Đã xóa khỏi yêu thích', 'in_wishlist' => false]);
        } else {
            WishlistItem::create([
                'user_id' => $user->id,
                'product_id' => $productId,
            ]);
            return response()->json(['error' => false, 'message' => 'Đã thêm vào yêu thích', 'in_wishlist' => true]);
        }
    }
}
