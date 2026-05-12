<?php

namespace App\Filament\Resources\Shop\Comments\Pages;

use App\Filament\Resources\Shop\Comments\CommentResource;
use Filament\Resources\Pages\CreateRecord;

class CreateComment extends CreateRecord
{
    protected static string $resource = CommentResource::class;

    public function getMaxContentWidth(): string
    {
        return '8xl';
    }
}
