<?php

namespace App\Filament\Resources\ContactForms\Api\Handlers;

use App\Filament\Resources\ContactForms\ContactFormResource;
use Rupadana\ApiService\Http\Handlers;
use Spatie\QueryBuilder\QueryBuilder;

class PaginationHandler extends Handlers
{
    public static string | null $uri = '/';
    public static string | null $resource = ContactFormResource::class;
    public static bool $public = true;

    public function handler()
    {
        $query = static::getEloquentQuery();

        $query = QueryBuilder::for($query)
            ->allowedFilters(['status', 'email'])
            ->allowedSorts(['created_at'])
            ->paginate(request()->query('per_page') ?? 10);

        return static::getApiTransformer()::collection($query);
    }
}
