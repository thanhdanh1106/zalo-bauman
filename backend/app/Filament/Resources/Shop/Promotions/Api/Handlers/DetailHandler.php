<?php

namespace App\Filament\Resources\Shop\Promotions\Api\Handlers;

use App\Filament\Resources\Shop\Promotions\PromotionResource;
use Rupadana\ApiService\Http\Handlers;

class DetailHandler extends Handlers
{
    public static ?string $uri = '/{id}';
    public static ?string $resource = PromotionResource::class;
    public static bool $public = true;

    public function handler($id)
    {
        $model = static::getEloquentQuery()->findOrFail($id);

        // Increment views
        $model->increment('views');

        return new (static::getApiTransformer())($model);
    }
}
