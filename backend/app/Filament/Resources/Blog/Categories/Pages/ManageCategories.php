<?php

namespace App\Filament\Resources\Blog\Categories\Pages;

use App\Filament\Imports\Blog\CategoryImporter;
use App\Filament\Resources\Blog\Categories\CategoryResource;
use Filament\Actions\CreateAction;
use Filament\Actions\ImportAction;
use Filament\Resources\Pages\ManageRecords;

class ManageCategories extends ManageRecords
{
    protected static string $resource = CategoryResource::class;

    public function getHeaderActions(): array
    {
        return [
            \Filament\Actions\ImportAction::make()
                ->color('warning')
                ->importer(CategoryImporter::class),
            \Filament\Actions\ExportAction::make()
                ->exporter(\App\Filament\Exports\Blog\PostCategoryExporter::class),
            CreateAction::make(),
        ];
    }
}

