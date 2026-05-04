<?php

namespace App\Filament\Resources\Shop\Orders\Api\Handlers;

use App\Filament\Resources\Shop\Orders\OrderResource;
use Rupadana\ApiService\Http\Handlers;
use Illuminate\Http\Request;

class UpdateHandler extends Handlers
{
    public static ?string $uri = '/{id}';
    public static ?string $resource = OrderResource::class;
    public static string $method = 'put';
    public static bool $public = true;

    public function handler(Request $request, $id)
    {
        $model = static::getEloquentQuery()->findOrFail($id);
        $data = $request->all();
        $model->update($data);

        return static::getApiTransformer()::make($model);
    }
}
