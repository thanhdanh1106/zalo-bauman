<?php

namespace App\Filament\Resources\Shop\Promotions\Pages;

use App\Filament\Resources\Shop\Promotions\PromotionResource;
use Filament\Resources\Pages\ListRecords;
use Filament\Actions\CreateAction;

class ListPromotions extends ListRecords
{
    protected static string $resource = PromotionResource::class;

    public function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
