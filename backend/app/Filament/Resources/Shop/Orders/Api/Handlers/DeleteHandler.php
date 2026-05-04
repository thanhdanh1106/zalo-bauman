<?php

namespace App\Filament\Resources\Shop\Orders\Api\Handlers;

use App\Filament\Resources\Shop\Orders\OrderResource;
use Rupadana\ApiService\Http\Handlers;

class DeleteHandler extends Handlers
{
    public static ?string $uri = '/{id}';
    public static ?string $resource = OrderResource::class;
    public static string $method = 'delete';
    public static bool $public = true;

    public function handler($id)
    {
        $model = static::getEloquentQuery()->findOrFail($id);
        $model->delete();

        return response()->json([
            'message' => 'Xoá đơn hàng thành công',
            'id' => $id
        ]);
    }
}
