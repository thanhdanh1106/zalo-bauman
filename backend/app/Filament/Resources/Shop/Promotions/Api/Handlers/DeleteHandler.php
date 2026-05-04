<?php

namespace App\Filament\Resources\Shop\Promotions\Api\Handlers;

use App\Filament\Resources\Shop\Promotions\PromotionResource;
use Rupadana\ApiService\Http\Handlers;

class DeleteHandler extends Handlers
{
    public static ?string $uri = '/{id}';
    public static ?string $resource = PromotionResource::class;
    public static string $method = 'delete';
    public static bool $public = true;

    public function handler($id)
    {
        $model = static::getEloquentQuery()->findOrFail($id);
        $model->delete();

        return response()->json(['message' => 'Đã xóa thành công']);
    }
}
