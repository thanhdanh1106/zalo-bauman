<?php

namespace App\Http\Controllers\Api\MiniApp\Shop;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Promotion;
use App\Filament\Resources\Shop\Promotions\Api\Transformers\PromotionTransformer;

class PromotionController extends Controller
{
    public function index(Request $request)
    {
        $promotions = Promotion::with('image')
            ->whereNull('user_id')
            ->where('is_visible', true)
            ->where(function ($query): void {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', now());
            })
            ->latest()
            ->get();

        return response()->json([
            'error' => false,
            'data' => PromotionTransformer::collection($promotions),
        ]);
    }

    public function showBySlug($slug)
    {
        $promotion = Promotion::with('image')
            ->where('slug', $slug)
            ->where('is_visible', true)
            ->first();

        if (!$promotion) {
            return response()->json(['error' => true, 'message' => 'Khuyến mãi không tồn tại'], 404);
        }

        $promotion->increment('views');

        return response()->json([
            'error' => false,
            'data' => new PromotionTransformer($promotion),
        ]);
    }

    public function apply(Request $request, $code)
    {
        $promotion = Promotion::where('promotion_code', $code)
            ->where('is_visible', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->first();

        if (!$promotion) {
            return response()->json([
                'error' => true,
                'message' => 'Mã khuyến mãi không hợp lệ hoặc đã hết hạn',
            ], 404);
        }

        return response()->json([
            'error' => false,
            'data' => [
                'id' => $promotion->id,
                'promotion_code' => $promotion->promotion_code,
                'discount' => $promotion->discount,
                'title' => $promotion->title,
            ],
            'message' => 'Áp dụng mã khuyến mãi thành công',
        ]);
    }
}
