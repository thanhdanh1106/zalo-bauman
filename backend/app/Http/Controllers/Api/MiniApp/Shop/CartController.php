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

            $imageUrl = $prod->image?->medium_url ?: ($prod->image?->url ?: $prod->getFirstMediaUrl('product-images'));
            if ($imageUrl && !filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                $imageUrl = url($imageUrl);
            }
            $finalImage = $imageUrl ?: url("/images/product-placeholder.png");

            $options = $item->options ?? [];
            $selectedOption = $options['selected_option'] ?? null;
            $customTitle = $options['title'] ?? null;
            $customPrice = $options['price'] ?? null;
            $customImage = $options['image'] ?? null;
            $customSku = $options['sku'] ?? null;

            $displayTitle = $customTitle ?: $prod->name;
            $displayPrice = $customPrice !== null ? (int)$customPrice : (int)$prod->price;
            $displayImage = $customImage ?: $finalImage;

            return [
                'id' => $prod->id,
                'name' => $displayTitle,
                'title' => $displayTitle,
                'price' => $displayPrice,
                'image' => $displayImage,
                'thumbnail' => ["original_url" => $displayImage],
                'quantity' => $item->quantity,
                'sku' => $customSku ?: $prod->sku,
                'selected_option' => $selectedOption,
                'cartItemId' => $selectedOption ? "{$prod->id}|{$selectedOption}" : (string)$prod->id,
            ];
        })->filter()->values();

        return response()->json(['error' => false, 'data' => $data]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $productId = $request->product_id;
        $quantity = $request->quantity ?? 1;
        $selectedOption = $request->selected_option;
        $options = $request->options ?? [];
        if ($selectedOption) {
            $options['selected_option'] = $selectedOption;
        }

        $query = CartItem::where('user_id', $user->id)->where('product_id', $productId);
        if ($selectedOption) {
            $query->where('options->selected_option', $selectedOption);
        } else {
            $query->whereNull('options->selected_option');
        }
        $item = $query->first();

        if ($item) {
            $item->increment('quantity', $quantity);
            if (!empty($options)) {
                $item->update(['options' => array_merge($item->options ?? [], $options)]);
            }
        } else {
            CartItem::create([
                'user_id' => $user->id,
                'product_id' => $productId,
                'quantity' => $quantity,
                'options' => !empty($options) ? $options : null,
            ]);
        }

        return $this->index($request);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $productId = $request->product_id;
        $quantity = $request->quantity;
        $selectedOption = $request->selected_option;

        $query = CartItem::where('user_id', $user->id)->where('product_id', $productId);
        if ($selectedOption) {
            $query->where('options->selected_option', $selectedOption);
        } else {
            $query->whereNull('options->selected_option');
        }
        $item = $query->first();

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
        $selectedOption = $request->selected_option;

        $query = CartItem::where('user_id', $user->id)->where('product_id', $productId);
        if ($selectedOption) {
            $query->where('options->selected_option', $selectedOption);
        } else {
            $query->whereNull('options->selected_option');
        }
        $query->delete();

        return $this->index($request);
    }

    public function sync(Request $request)
    {
        $user = $request->user();
        $items = $request->items ?? [];

        foreach ($items as $item) {
            $selectedOption = $item['selected_option'] ?? null;
            $options = $item['options'] ?? null;
            
            $query = CartItem::where('user_id', $user->id)->where('product_id', $item['id']);
            if ($selectedOption) {
                $query->where('options->selected_option', $selectedOption);
            } else {
                $query->whereNull('options->selected_option');
            }
            $existing = $query->first();

            if ($existing) {
                $existing->update([
                    'quantity' => $item['quantity'],
                    'options' => $options ?: $existing->options,
                ]);
            } else {
                CartItem::create([
                    'user_id' => $user->id,
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'options' => $options,
                ]);
            }
        }

        return $this->index($request);
    }
}
