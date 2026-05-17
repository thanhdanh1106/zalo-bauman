<?php

namespace App\Filament\Resources\Shop\Promotions\Api;

use App\Filament\Resources\Shop\Promotions\Api\Handlers\PaginationHandler;
use App\Filament\Resources\Shop\Promotions\Api\Handlers\CreateHandler;
use App\Filament\Resources\Shop\Promotions\Api\Handlers\DetailHandler;
use App\Filament\Resources\Shop\Promotions\Api\Handlers\UpdateHandler;
use App\Filament\Resources\Shop\Promotions\Api\Handlers\DeleteHandler;
use App\Filament\Resources\Shop\Promotions\PromotionResource;
use Rupadana\ApiService\ApiService;

class PromotionApiService extends ApiService
{
    protected static string | null $resource = PromotionResource::class;

    public static function handlers(): array
    {
        return [
            PaginationHandler::class,
            CreateHandler::class,
            DetailHandler::class,
            UpdateHandler::class,
            DeleteHandler::class,
        ];
    }
}
