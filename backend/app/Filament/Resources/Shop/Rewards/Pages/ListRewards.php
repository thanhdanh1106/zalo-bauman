<?php

namespace App\Filament\Resources\Shop\Rewards\Pages;

use App\Filament\Resources\Shop\Rewards\RewardResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListRewards extends ListRecords
{
    protected static string $resource = RewardResource::class;

    public function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
