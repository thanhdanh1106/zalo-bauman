<?php

namespace App\Filament\Resources\Shop\Promotions\Pages;

use App\Filament\Resources\Shop\Promotions\PromotionResource;
use Filament\Resources\Pages\CreateRecord;

class CreatePromotion extends CreateRecord
{
    protected static string $resource = PromotionResource::class;

    public function getMaxContentWidth(): string
    {
        return '8xl';
    }
}
