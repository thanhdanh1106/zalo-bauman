<?php

namespace App\Http\Controllers\Api\MiniApp\Shop;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CartItem;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $items = CartItem::with(['product.image'])
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
                'title' => $prod->name,
                'price' => (int)$prod->price,
                'image' => $finalImage,
                'thumbnail' => ["original_url" => $finalImage],
                'quantity' => $item->quantity,
                'sku' => $prod->sku,
            ];
        })->filter()->values();

        return response()->json(['error' => false, 'data' => $data]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $productId = $request->product_id;
        $quantity = $request->quantity ?? 1;

        $item = CartItem::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($item) {
            $item->increment('quantity', $quantity);
        } else {
            CartItem::create([
                'user_id' => $user->id,
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
        }

        return $this->index($request);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $productId = $request->product_id;
        $quantity = $request->quantity;

        $item = CartItem::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($item) {
            if ($quantity <= 0) {
                $item->delete();
            } else {
                $item->update(['quantity' => $quantity]);
            }
        }

        return $this->index($request);
    }

    public function destroy(Request $request)
    {
        $user = $request->user();
        $productId = $request->product_id;

        CartItem::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->delete();

        return $this->index($request);
    }

    public function sync(Request $request)
    {
        $user = $request->user();
        $items = $request->items ?? [];

        foreach ($items as $item) {
            CartItem::updateOrCreate(
                ['user_id' => $user->id, 'product_id' => $item['id']],
                ['quantity' => $item['quantity']]
            );
        }

        return $this->index($request);
    }
}
