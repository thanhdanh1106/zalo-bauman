<?php

namespace App\Filament\Resources\Shop\Orders\Api;

use App\Filament\Resources\Shop\Orders\Api\Handlers\CreateHandler;
use App\Filament\Resources\Shop\Orders\Api\Handlers\DetailHandler;
use App\Filament\Resources\Shop\Orders\Api\Handlers\UpdateHandler;
use App\Filament\Resources\Shop\Orders\Api\Handlers\DeleteHandler;
use App\Filament\Resources\Shop\Orders\OrderResource;
use Rupadana\ApiService\ApiService;
use App\Filament\Resources\Shop\Orders\Api\Handlers\PaginationHandler;

class OrderApiService extends ApiService
{
    protected static string | null $resource = OrderResource::class;

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
