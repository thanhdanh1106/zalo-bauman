<?php

namespace App\Filament\Resources\Shop\Rewards\Pages;

use App\Filament\Resources\Shop\Rewards\RewardResource;
use Filament\Resources\Pages\CreateRecord;

class CreateReward extends CreateRecord
{
    protected static string $resource = RewardResource::class;

    public function getMaxContentWidth(): string
    {
        return '8xl';
    }
}
