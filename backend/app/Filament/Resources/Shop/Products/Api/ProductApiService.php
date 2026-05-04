<?php

namespace App\Filament\Resources\Shop\Products\Api;

use App\Filament\Resources\Shop\Products\ProductResource;
use Rupadana\ApiService\ApiService;
use App\Filament\Resources\Shop\Products\Api\Handlers\PaginationHandler;

class ProductApiService extends ApiService
{
    protected static string | null $resource = ProductResource::class;

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
