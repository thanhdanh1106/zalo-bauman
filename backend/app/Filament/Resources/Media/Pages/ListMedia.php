<?php

namespace App\Filament\Resources\Media\Pages;

use App\Filament\Exports\Media\MediaExporter;
use App\Filament\Imports\Media\MediaImporter;
use Awcodes\Curator\Resources\Media\Pages\ListMedia as CuratorListMedia;
use Filament\Actions\ExportAction;
use Filament\Actions\ImportAction;

class ListMedia extends CuratorListMedia
{
    public function getHeaderActions(): array
    {
        return array_merge([
            ImportAction::make()
                ->color('warning')
                ->importer(MediaImporter::class),
            ExportAction::make()
                ->exporter(MediaExporter::class),
        ], parent::getHeaderActions());
    }
}
