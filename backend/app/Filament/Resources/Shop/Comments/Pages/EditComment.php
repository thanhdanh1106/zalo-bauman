<?php

namespace App\Filament\Resources\Shop\Comments\Pages;

use App\Filament\Resources\Shop\Comments\CommentResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditComment extends EditRecord
{
    protected static string $resource = CommentResource::class;

    protected function getActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    public function getMaxContentWidth(): string
    {
        return '8xl';
    }
}
