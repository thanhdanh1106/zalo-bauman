<?php

namespace App\Filament\Resources\Shop\Promotions\Api\Handlers;

use App\Filament\Resources\Shop\Promotions\PromotionResource;
use Rupadana\ApiService\Http\Handlers;
use Spatie\QueryBuilder\QueryBuilder;

class PaginationHandler extends Handlers
{
    public static string | null $uri = '/';
    public static string | null $resource = PromotionResource::class;
    public static bool $public = true;

    public function handler()
    {
        $query = static::getEloquentQuery()
            ->where('is_visible', true);

        $query = QueryBuilder::for($query)
            ->allowedFilters(['title', 'slug', 'status', 'is_featured', 'promotion_code'])
            ->allowedSorts(['start_date', 'end_date', 'discount', 'title', 'created_at'])
            ->paginate(request()->query('per_page') ?? 12);

        return static::getApiTransformer()::collection($query);
    }
}
