<?php

namespace App\Filament\Exports\Media;

use App\Models\Media\Media;
use Filament\Actions\Exports\ExportColumn;
use Filament\Actions\Exports\Exporter;
use Filament\Actions\Exports\Models\Export;
use Illuminate\Support\Number;

class MediaExporter extends Exporter
{
    protected static ?string $model = Media::class;

    public static function getColumns(): array
    {
        return [
            //
        ];
    }

    public static function getCompletedNotificationBody(Export $export): string
    {
        $body = 'Your media export has completed and ' . Number::format($export->successful_rows) . ' ' . str('row')->plural($export->successful_rows) . ' exported.';

        if ($failedRowsCount = $export->getFailedRowsCount()) {
            $body .= ' ' . Number::format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to export.';
        }

        return $body;
    }
}
