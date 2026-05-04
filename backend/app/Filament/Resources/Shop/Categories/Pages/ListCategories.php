<?php

namespace App\Filament\Resources\Shop\Categories\Pages;

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
            \Filament\Actions\ImportAction::make()
                ->color('warning')
                ->importer(CategoryImporter::class),
            \Filament\Actions\ExportAction::make()
                ->exporter(\App\Filament\Exports\Shop\ProductCategoryExporter::class),
            CreateAction::make(),
        ];
    }
}

