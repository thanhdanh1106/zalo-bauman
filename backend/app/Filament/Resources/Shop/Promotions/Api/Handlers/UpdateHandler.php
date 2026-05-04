<?php

namespace App\Filament\Resources\Shop\Promotions\Api\Handlers;

use App\Filament\Resources\Shop\Promotions\PromotionResource;
use Rupadana\ApiService\Http\Handlers;
use Illuminate\Http\Request;

class UpdateHandler extends Handlers
{
    public static ?string $uri = '/{id}';
    public static ?string $resource = PromotionResource::class;
    public static string $method = 'patch';
    public static bool $public = true;

    public function handler(Request $request, $id)
    {
        $model = static::getEloquentQuery()->findOrFail($id);
        $model->update($request->all());

        return static::getApiTransformer()::make($model);
    }
}
