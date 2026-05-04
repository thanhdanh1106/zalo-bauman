<?php

namespace App\Filament\Resources\Blog\Posts\Api\Handlers;

use App\Filament\Resources\Blog\Posts\PostResource;
use Rupadana\ApiService\Http\Handlers;
use Spatie\QueryBuilder\QueryBuilder;

class PaginationHandler extends Handlers
{
    public static string | null $uri = '/';
    public static string | null $resource = PostResource::class;
    public static bool $public = true;

    public function handler()
    {
        $query = static::getEloquentQuery()
            ->where('is_visible', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->where(function($query) {
                $query->whereDoesntHave('postCategory')
                      ->orWhereHas('postCategory', function ($q) {
                          $q->where('is_visible', true);
                      });
            });
        
        $query = QueryBuilder::for($query)
            ->allowedFilters(['title', 'slug', 'post_category_id', 'is_visible'])
            ->allowedSorts(['published_at', 'title'])
            ->paginate(request()->query('per_page') ?? 10);

        return static::getApiTransformer()::collection($query);
    }
}
