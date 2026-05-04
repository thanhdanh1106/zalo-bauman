<?php

namespace App\Filament\Resources\Blog\Posts\Api\Handlers;

use App\Filament\Resources\Blog\Posts\PostResource;
use Rupadana\ApiService\Http\Handlers;

class DetailHandler extends Handlers
{
    public static ?string $uri = '/{id}';
    public static ?string $resource = PostResource::class;
    public static bool $public = true;

    public function handler($id)
    {
        $model = static::getEloquentQuery()->findOrFail($id);

        return new (static::getApiTransformer())($model);
    }
}
