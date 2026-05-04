<?php

namespace App\Filament\Resources\Shop\Rewards\Api\Handlers;

use App\Filament\Resources\Shop\Rewards\RewardResource;
use Rupadana\ApiService\Http\Handlers;

class DetailHandler extends Handlers
{
    public static ?string $uri = '/{id}';
    public static ?string $resource = RewardResource::class;
    public static bool $public = true;

    public function handler($id)
    {
        $model = static::getEloquentQuery()->findOrFail($id);

        return new (static::getApiTransformer())($model);
    }
}
