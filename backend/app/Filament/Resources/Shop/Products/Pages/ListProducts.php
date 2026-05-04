<?php

namespace App\Filament\Resources\Shop\Products\Pages;

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
            \App\Filament\Actions\WooCommerceImportAction::make(),
            \Filament\Actions\ImportAction::make()
                ->label('Nhập CSV thường')
                ->color('warning')
                ->importer(\App\Filament\Imports\Shop\ProductImporter::class),
            \Filament\Actions\ExportAction::make()
                ->exporter(\App\Filament\Exports\Shop\ProductExporter::class),
            CreateAction::make(),
        ];
    }


    protected function getHeaderWidgets(): array
    {
        return ProductResource::getWidgets();
    }
}
