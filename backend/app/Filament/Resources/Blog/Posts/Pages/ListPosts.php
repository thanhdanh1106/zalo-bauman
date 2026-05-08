<?php

namespace App\Filament\Resources\Blog\Posts\Pages;

use App\Filament\Resources\Blog\Posts\PostResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPosts extends ListRecords
{
    protected static string $resource = PostResource::class;

    public function getHeaderActions(): array
    {
        return [
            \Filament\Actions\ImportAction::make()
                ->color('warning')
                ->importer(\App\Filament\Imports\Blog\PostImporter::class),
            \Filament\Actions\ExportAction::make()
                ->exporter(\App\Filament\Exports\Blog\PostExporter::class),
            CreateAction::make(),
        ];
    }
    
    public function getMaxContentWidth(): string
    {
        return '8xl';
    }

}

