<?php

namespace App\Filament\Resources\Shop\Rewards\Api\Handlers;

use App\Filament\Resources\Shop\Rewards\RewardResource;
use Rupadana\ApiService\Http\Handlers;
use Spatie\QueryBuilder\QueryBuilder;

class PaginationHandler extends Handlers
{
    public static string | null $uri = '/';
    public static string | null $resource = RewardResource::class;
    public static bool $public = true;

    public function handler()
    {
        $query = static::getEloquentQuery()
            ->where('is_visible', true);

        $query = QueryBuilder::for($query)
            ->allowedFilters(['category', 'name'])
            ->allowedSorts(['points_required', 'name', 'created_at'])
            ->paginate(request()->query('per_page') ?? 20);

        return static::getApiTransformer()::collection($query);
    }
}
