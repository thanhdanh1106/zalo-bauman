<?php

namespace App\Filament\Resources\ContactForms\Pages;

use App\Filament\Resources\ContactForms\ContactFormResource;
use Filament\Resources\Pages\ViewRecord;

class ViewContactForm extends ViewRecord
{
    protected static string $resource = ContactFormResource::class;

    public function getMaxContentWidth(): string
    {
        return '8xl';
    }
}
