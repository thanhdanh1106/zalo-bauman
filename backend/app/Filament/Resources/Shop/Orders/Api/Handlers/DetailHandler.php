<?php

namespace App\Filament\Resources\Shop\Orders\Api\Handlers;

use App\Filament\Resources\Shop\Orders\OrderResource;
use Rupadana\ApiService\Http\Handlers;

class DetailHandler extends Handlers
{
    public static ?string $uri = '/{id}';
    public static ?string $resource = OrderResource::class;
    public static bool $public = true;

    public function handler($id)
    {
        $model = static::getEloquentQuery()->findOrFail($id);

        return new (static::getApiTransformer())($model);
    }
}
