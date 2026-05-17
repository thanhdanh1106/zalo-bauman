<?php

namespace App\Filament\Resources\Shop\Categories\Pages;

use Filament\Actions\ExportAction;
use App\Filament\Exports\Shop\ProductCategoryExporter;
use App\Filament\Imports\Shop\CategoryImporter;
use App\Filament\Resources\Shop\Categories\CategoryResource;
use Filament\Actions\CreateAction;
use Filament\Actions\ImportAction;
use Filament\Resources\Pages\ListRecords;

class ListCategories extends ListRecords
{
    protected static string $resource = CategoryResource::class;

    public function getHeaderActions(): array
    {
        return [
            ImportAction::make()
                ->color('warning')
                ->importer(CategoryImporter::class),
            ExportAction::make()
                ->exporter(ProductCategoryExporter::class),
            CreateAction::make(),
        ];
    }
}

