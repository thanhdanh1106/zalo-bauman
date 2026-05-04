<?php

namespace App\Filament\Resources\Blog\Posts\Api;

use App\Filament\Resources\Blog\Posts\PostResource;
use Rupadana\ApiService\ApiService;
use App\Filament\Resources\Blog\Posts\Api\Handlers\PaginationHandler;

class PostApiService extends ApiService
{
    protected static string | null $resource = PostResource::class;

    public static function handlers(): array
    {
        return [
            Handlers\PaginationHandler::class,
            Handlers\CreateHandler::class,
            Handlers\DetailHandler::class,
            Handlers\UpdateHandler::class,
            Handlers\DeleteHandler::class,
        ];
    }
}
