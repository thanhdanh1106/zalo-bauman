<?php

namespace App\Filament\Resources\Blog\Posts\Api;

use App\Filament\Resources\Blog\Posts\Api\Handlers\CreateHandler;
use App\Filament\Resources\Blog\Posts\Api\Handlers\DetailHandler;
use App\Filament\Resources\Blog\Posts\Api\Handlers\UpdateHandler;
use App\Filament\Resources\Blog\Posts\Api\Handlers\DeleteHandler;
use App\Filament\Resources\Blog\Posts\PostResource;
use Rupadana\ApiService\ApiService;
use App\Filament\Resources\Blog\Posts\Api\Handlers\PaginationHandler;

class PostApiService extends ApiService
{
    protected static string | null $resource = PostResource::class;

    public static function handlers(): array
    {
        return [
            PaginationHandler::class,
            CreateHandler::class,
            DetailHandler::class,
            UpdateHandler::class,
            DeleteHandler::class,
        ];
    }
}
