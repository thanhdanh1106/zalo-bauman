<?php

namespace App\Filament\Resources\Blog\Posts\Api\Handlers;

use App\Filament\Resources\Blog\Posts\PostResource;
use Rupadana\ApiService\Http\Handlers;
use Illuminate\Http\Request;

class UpdateHandler extends Handlers
{
    public static ?string $uri = '/{id}';
    public static ?string $resource = PostResource::class;
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
