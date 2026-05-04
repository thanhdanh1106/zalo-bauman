<?php

namespace App\Filament\Resources\Shop\Promotions\Api;

use App\Filament\Resources\Shop\Promotions\PromotionResource;
use Rupadana\ApiService\ApiService;

class PromotionApiService extends ApiService
{
    protected static string | null $resource = PromotionResource::class;

    public static function handlers(): array
    {
        return [
            Handlers\PaginationHandler::class,
            Handlers\CreateHandler::class,
            Handlers\DetailHandler::class,
            Handlers\UpdateHandler::class,
            Handlers\DeleteHandler::class,
        ];
    }
}
