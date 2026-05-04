<?php

namespace App\Filament\Resources\Shop\Promotions\Pages;

use App\Filament\Resources\Shop\Promotions\PromotionResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Contracts\Support\Htmlable;

class EditPromotion extends EditRecord
{
    protected static string $resource = PromotionResource::class;

    public function getTitle(): string | Htmlable
    {
        return $this->getRecord()->title;
    }

    protected function getActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
