<?php

namespace App\Filament\Resources\ContactForms\Api;

use App\Filament\Resources\ContactForms\ContactFormResource;
use Rupadana\ApiService\ApiService;

class ContactFormApiService extends ApiService
{
    protected static string | null $resource = ContactFormResource::class;

    public static function handlers(): array
    {
        return [
            Handlers\PaginationHandler::class,
            Handlers\CreateHandler::class,
            Handlers\DetailHandler::class,
        ];
    }
}
