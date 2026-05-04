<?php

namespace App\Filament\Resources\Shop\Products\Api\Handlers;

use App\Filament\Resources\Shop\Products\ProductResource;
use Rupadana\ApiService\Http\Handlers;

class DeleteHandler extends Handlers
{
    public static ?string $uri = '/{id}';
    public static ?string $resource = ProductResource::class;
    public static string $method = 'delete';
    public static bool $public = true;

    public function handler($id)
    {
        $model = static::getEloquentQuery()->findOrFail($id);
        $model->delete();

        return response()->json([
            'message' => 'Xoá sản phẩm thành công',
            'id' => $id
        ]);
    }
}
