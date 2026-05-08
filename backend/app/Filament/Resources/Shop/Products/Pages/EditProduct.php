<?php

namespace App\Filament\Resources\Shop\Products\Pages;

use App\Filament\Resources\Shop\Products\ProductResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditProduct extends EditRecord
{
    protected static string $resource = ProductResource::class;

    protected function getActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
            public function getMaxContentWidth(): string
        {
            return '8xl'; // Hoặc '7xl', '6xl' tùy ý
        }
}
