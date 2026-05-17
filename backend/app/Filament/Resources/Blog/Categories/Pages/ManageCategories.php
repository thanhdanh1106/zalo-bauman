<?php

namespace App\Filament\Resources\Blog\Categories\Pages;

use Filament\Actions\ExportAction;
use App\Filament\Exports\Blog\PostCategoryExporter;
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
            ImportAction::make()
                ->color('warning')
                ->importer(CategoryImporter::class),
            ExportAction::make()
                ->exporter(PostCategoryExporter::class),
            CreateAction::make(),
        ];
    }

    public function getMaxContentWidth(): string
    {
        return '8xl';
    }
}
