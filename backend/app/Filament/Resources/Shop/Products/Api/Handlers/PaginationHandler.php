<?php

namespace App\Filament\Resources\Shop\Products\Api\Handlers;

use App\Filament\Resources\Shop\Products\ProductResource;
use Rupadana\ApiService\Http\Handlers;
use Spatie\QueryBuilder\QueryBuilder;

class PaginationHandler extends Handlers
{
    public static ?string $uri = '/';
    public static ?string $resource = ProductResource::class;
    public static bool $public = true;

    public function handler()
    {
        $query = static::getEloquentQuery();
        $model = static::getModel();

        $query = QueryBuilder::for($query)
            ->paginate(request()->query('per_page') ?? 10);

        return static::getApiTransformer()::collection($query);
    }
}
