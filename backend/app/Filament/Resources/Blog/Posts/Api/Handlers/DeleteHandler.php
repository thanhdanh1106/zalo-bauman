<?php

namespace App\Filament\Resources\Blog\Posts\Api\Handlers;

use App\Filament\Resources\Blog\Posts\PostResource;
use Rupadana\ApiService\Http\Handlers;

class DeleteHandler extends Handlers
{
    public static ?string $uri = '/{id}';
    public static ?string $resource = PostResource::class;
    public static string $method = 'delete';
    public static bool $public = true;

    public function handler($id)
    {
        $model = static::getEloquentQuery()->findOrFail($id);
        $model->delete();

        return response()->json([
            'message' => 'Xoá bài viết thành công',
            'id' => $id
        ]);
    }
}
