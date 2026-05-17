<?php

namespace App\Filament\Resources\ContactForms\Api;

use App\Filament\Resources\ContactForms\Api\Handlers\PaginationHandler;
use App\Filament\Resources\ContactForms\Api\Handlers\CreateHandler;
use App\Filament\Resources\ContactForms\Api\Handlers\DetailHandler;
use App\Filament\Resources\ContactForms\ContactFormResource;
use Rupadana\ApiService\ApiService;

class ContactFormApiService extends ApiService
{
    protected static string | null $resource = ContactFormResource::class;

    public static function handlers(): array
    {
        return [
            PaginationHandler::class,
            CreateHandler::class,
            DetailHandler::class,
        ];
    }
}
