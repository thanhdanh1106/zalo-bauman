<?php

namespace App\Filament\Resources\Media;

use App\Filament\Exports\Media\MediaExporter;
use App\Filament\Imports\Media\MediaImporter;
use App\Filament\Resources\Media\Pages\ListMedia;
use Awcodes\Curator\Resources\Media\MediaResource as CuratorMediaResource;
use Filament\Actions\Exports\ExportAction;
use Waad\FilamentImportWizard\Actions\ImportAction;

class MediaResource extends CuratorMediaResource
{
    public static function getPages(): array
    {
        return [
            'index' => ListMedia::route('/'),
            'create' => \Awcodes\Curator\Resources\Media\Pages\CreateMedia::route('/create'),
            'edit' => \Awcodes\Curator\Resources\Media\Pages\EditMedia::route('/{record}/edit'),
        ];
    }
}

