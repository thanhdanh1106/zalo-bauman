<?php

namespace App\Filament\Resources\Shop\Rewards\Pages;

use App\Filament\Resources\Shop\Rewards\RewardResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditReward extends EditRecord
{
    protected static string $resource = RewardResource::class;

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
