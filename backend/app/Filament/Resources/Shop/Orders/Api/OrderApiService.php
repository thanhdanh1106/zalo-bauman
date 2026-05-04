<?php

namespace App\Filament\Resources\Shop\Orders\Api;

use App\Filament\Resources\Shop\Orders\OrderResource;
use Rupadana\ApiService\ApiService;
use App\Filament\Resources\Shop\Orders\Api\Handlers\PaginationHandler;

class OrderApiService extends ApiService
{
    protected static string | null $resource = OrderResource::class;

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
