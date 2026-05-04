<?php

namespace App\Filament\Resources\Shop\Orders\Api\Handlers;

use App\Filament\Resources\Shop\Orders\OrderResource;
use Rupadana\ApiService\Http\Handlers;
use Spatie\QueryBuilder\QueryBuilder;

class PaginationHandler extends Handlers
{
    public static string | null $uri = '/';
    public static string | null $resource = OrderResource::class;
    public static bool $public = true;

    public function handler()
    {
        $query = static::getEloquentQuery();
        
        $query = QueryBuilder::for($query)
            ->allowedFilters(['number', 'status'])
            ->allowedSorts(['created_at', 'total_price'])
            ->paginate(request()->query('per_page') ?? 10);

        return static::getApiTransformer()::collection($query);
    }
}
