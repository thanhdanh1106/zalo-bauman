<?php

namespace App\Filament\Resources\Shop\Rewards\Api;

use App\Filament\Resources\Shop\Rewards\RewardResource;
use Rupadana\ApiService\ApiService;

class RewardApiService extends ApiService
{
    protected static string | null $resource = RewardResource::class;

    public static function handlers(): array
    {
        return [
            Handlers\PaginationHandler::class,
            Handlers\DetailHandler::class,
        ];
    }
}
