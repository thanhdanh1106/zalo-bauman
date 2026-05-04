<?php

namespace App\Http\Controllers\Api\MiniApp\Content;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Filament\Resources\Banners\Api\Transformers\BannerTransformer;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::with('image')
            ->where('is_visible', true)
            ->orderBy('sort_order', 'asc')
            ->get();

        if ($banners->isNotEmpty()) {
            return response()->json([
                'error' => false,
                'data' => BannerTransformer::collection($banners)->resolve()
            ]);
        }

        return response()->json([
            'error' => false,
            'data' => [
                ['image' => "https://placehold.co/1200x400?text=Banner+1", 'title' => 'Banner 1', 'subtitle' => '', 'link' => null],
                ['image' => "https://placehold.co/1200x400?text=Banner+2", 'title' => 'Banner 2', 'subtitle' => '', 'link' => null],
                ['image' => "https://placehold.co/1200x400?text=Banner+3", 'title' => 'Banner 3', 'subtitle' => '', 'link' => null]
            ]
        ]);
    }
}
