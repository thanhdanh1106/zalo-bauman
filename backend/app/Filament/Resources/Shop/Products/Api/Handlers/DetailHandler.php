<?php

namespace App\Filament\Resources\Shop\Products\Api\Handlers;

use App\Filament\Resources\Shop\Products\ProductResource;
use Rupadana\ApiService\Http\Handlers;

class DetailHandler extends Handlers
{
    public static ?string $uri = '/{id}';
    public static ?string $resource = ProductResource::class;
    public static bool $public = true;

    public function handler($id)
    {
        $model = static::getEloquentQuery()->findOrFail($id);

        return new (static::getApiTransformer())($model);
    }
}
