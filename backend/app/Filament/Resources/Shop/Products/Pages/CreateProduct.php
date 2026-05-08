<?php

namespace App\Filament\Resources\Shop\Products\Pages;

use App\Filament\Resources\Shop\Products\ProductResource;
use Filament\Resources\Pages\CreateRecord;

class CreateProduct extends CreateRecord
{
    protected static string $resource = ProductResource::class;
       public function getMaxContentWidth(): string
        {
            return '8xl'; // Hoặc '7xl', '6xl' tùy ý
        }
}
