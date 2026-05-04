<?php

namespace App\Filament\Exports\Shop;

use App\Models\Shop\ProductCategory;
use Filament\Actions\Exports\ExportColumn;
use Filament\Actions\Exports\Exporter;
use Filament\Actions\Exports\Models\Export;
use Illuminate\Support\Number;

class ProductCategoryExporter extends Exporter
{
    protected static ?string $model = ProductCategory::class;

    public static function getColumns(): array
    {
        return [
            ExportColumn::make('id')
                ->label('ID'),
            ExportColumn::make('parent.name'),
            ExportColumn::make('name'),
            ExportColumn::make('slug'),
            ExportColumn::make('description'),
            ExportColumn::make('position'),
            ExportColumn::make('is_visible'),
            ExportColumn::make('seo_title'),
            ExportColumn::make('seo_description'),
            ExportColumn::make('created_at'),
            ExportColumn::make('updated_at'),
        ];
    }

    public static function getCompletedNotificationBody(Export $export): string
    {
        $body = 'Your product category export has completed and ' . Number::format($export->successful_rows) . ' ' . str('row')->plural($export->successful_rows) . ' exported.';

        if ($failedRowsCount = $export->getFailedRowsCount()) {
            $body .= ' ' . Number::format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to export.';
        }

        return $body;
    }
}
