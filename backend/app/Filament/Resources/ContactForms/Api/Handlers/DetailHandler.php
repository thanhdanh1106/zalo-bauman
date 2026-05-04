<?php

namespace App\Filament\Resources\ContactForms\Api\Handlers;

use App\Filament\Resources\ContactForms\ContactFormResource;
use Rupadana\ApiService\Http\Handlers;

class DetailHandler extends Handlers
{
    public static ?string $uri = '/{id}';
    public static ?string $resource = ContactFormResource::class;
    public static bool $public = true;

    public function handler($id)
    {
        $model = static::getEloquentQuery()->findOrFail($id);

        return new (static::getApiTransformer())($model);
    }
}
