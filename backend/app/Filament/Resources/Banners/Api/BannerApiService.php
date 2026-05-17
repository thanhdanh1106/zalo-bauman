<?php

namespace App\Filament\Resources\Banners\Api;

use App\Filament\Resources\Banners\Api\Handlers\PaginationHandler;
use App\Filament\Resources\Banners\BannerResource;
use Rupadana\ApiService\ApiService;

class BannerApiService extends ApiService
{
    protected static string | null $resource = BannerResource::class;

    public static function handlers(): array
    {
        return [
            PaginationHandler::class,
        ];
    }
}
