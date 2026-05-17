<?php

namespace App\Filament\Resources\Media;

use Filament\Tables\Table;
use Awcodes\Curator\Resources\Media\Pages\CreateMedia;
use Awcodes\Curator\Resources\Media\Pages\EditMedia;
use App\Filament\Exports\Media\MediaExporter;
use App\Filament\Imports\Media\MediaImporter;
use App\Filament\Resources\Media\Pages\ListMedia;
use Awcodes\Curator\Resources\Media\MediaResource as CuratorMediaResource;
use Filament\Actions\Exports\ExportAction;
use Waad\FilamentImportWizard\Actions\ImportAction;

class MediaResource extends CuratorMediaResource
{
    public static function table(Table $table): Table
    {
        return parent::table($table)
            ->contentGrid(fn ($livewire) => $livewire->layoutView === 'grid' ? [
                'md' => 2,
                'lg' => 3,
                'xl' => 5,
            ] : null);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListMedia::route('/'),
            'create' => CreateMedia::route('/create'),
            'edit' => EditMedia::route('/{record}/edit'),
        ];
    }
}

