<?php

namespace App\Filament\Resources\Banners\Api\Handlers;

use App\Filament\Resources\Banners\BannerResource;
use Rupadana\ApiService\Http\Handlers;

class PaginationHandler extends Handlers
{
    public static string | null $uri = '/';
    public static string | null $resource = BannerResource::class;
    public static bool $public = true;

    public function handler()
    {
        $banners = static::getEloquentQuery()
            ->where('is_visible', true)
            ->orderBy('sort_order', 'asc')
            ->get();

        return static::getApiTransformer()::collection($banners);
    }
}
