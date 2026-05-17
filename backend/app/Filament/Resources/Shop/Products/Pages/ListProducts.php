<?php

namespace App\Filament\Resources\Shop\Products\Pages;

use App\Filament\Actions\WooCommerceImportAction;
use Filament\Actions\ImportAction;
use App\Filament\Imports\Shop\ProductImporter;
use Filament\Actions\ExportAction;
use App\Filament\Exports\Shop\ProductExporter;
use App\Filament\Resources\Shop\Products\ProductResource;
use Filament\Actions\CreateAction;
use Filament\Pages\Concerns\ExposesTableToWidgets;
use Filament\Resources\Pages\ListRecords;

class ListProducts extends ListRecords
{
    use ExposesTableToWidgets;

    protected static string $resource = ProductResource::class;

    public function getHeaderActions(): array
    {
        return [
            WooCommerceImportAction::make(),
            ImportAction::make()
                ->label('Nhập CSV thường')
                ->color('warning')
                ->importer(ProductImporter::class),
            ExportAction::make()
                ->exporter(ProductExporter::class),
            CreateAction::make(),
        ];
    }

   public function getMaxContentWidth(): string
        {
            return '8xl'; // Hoặc '7xl', '6xl' tùy ý
        }
    protected function getHeaderWidgets(): array
    {
        return ProductResource::getWidgets();
    }
}
