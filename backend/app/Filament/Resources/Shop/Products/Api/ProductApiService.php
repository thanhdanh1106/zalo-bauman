<?php

namespace App\Filament\Resources\Shop\Products\Api;

use App\Filament\Resources\Shop\Products\Api\Handlers\CreateHandler;
use App\Filament\Resources\Shop\Products\Api\Handlers\DetailHandler;
use App\Filament\Resources\Shop\Products\Api\Handlers\UpdateHandler;
use App\Filament\Resources\Shop\Products\Api\Handlers\DeleteHandler;
use App\Filament\Resources\Shop\Products\ProductResource;
use Rupadana\ApiService\ApiService;
use App\Filament\Resources\Shop\Products\Api\Handlers\PaginationHandler;

class ProductApiService extends ApiService
{
    protected static string | null $resource = ProductResource::class;

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
