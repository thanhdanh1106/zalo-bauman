<?php

namespace App\Filament\Resources\Shop\Comments\Pages;

use App\Filament\Resources\Shop\Comments\CommentResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListComments extends ListRecords
{
    protected static string $resource = CommentResource::class;

    protected function getActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }

    public function getMaxContentWidth(): string
    {
        return '8xl';
    }
}
