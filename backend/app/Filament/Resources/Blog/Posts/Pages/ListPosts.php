<?php

namespace App\Filament\Resources\Blog\Posts\Pages;

use Filament\Actions\ImportAction;
use App\Filament\Imports\Blog\PostImporter;
use Filament\Actions\ExportAction;
use App\Filament\Exports\Blog\PostExporter;
use App\Filament\Resources\Blog\Posts\PostResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPosts extends ListRecords
{
    protected static string $resource = PostResource::class;

    public function getHeaderActions(): array
    {
        return [
            ImportAction::make()
                ->color('warning')
                ->importer(PostImporter::class),
            ExportAction::make()
                ->exporter(PostExporter::class),
            CreateAction::make(),
        ];
    }
    
    public function getMaxContentWidth(): string
    {
        return '8xl';
    }

}

