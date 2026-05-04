<?php

namespace App\Filament\Exports\Shop;

use App\Models\Shop\Product;
use Filament\Actions\Exports\ExportColumn;
use Filament\Actions\Exports\Exporter;
use Filament\Actions\Exports\Models\Export;
use Illuminate\Support\Number;

class ProductExporter extends Exporter
{
    protected static ?string $model = Product::class;

    public static function getColumns(): array
    {
        return [
            ExportColumn::make('id')
                ->label('ID'),
            ExportColumn::make('brand.name'),
            ExportColumn::make('image.name'),
            ExportColumn::make('name'),
            ExportColumn::make('slug'),
            ExportColumn::make('sku')
                ->label('SKU'),
            ExportColumn::make('barcode'),
            ExportColumn::make('description'),
            ExportColumn::make('qty'),
            ExportColumn::make('security_stock'),
            ExportColumn::make('featured'),
            ExportColumn::make('is_visible'),
            ExportColumn::make('old_price'),
            ExportColumn::make('price'),
            ExportColumn::make('cost'),
            ExportColumn::make('type'),
            ExportColumn::make('backorder'),
            ExportColumn::make('requires_shipping'),
            ExportColumn::make('published_at'),
            ExportColumn::make('seo_title'),
            ExportColumn::make('seo_description'),
            ExportColumn::make('weight_value'),
            ExportColumn::make('weight_unit'),
            ExportColumn::make('height_value'),
            ExportColumn::make('height_unit'),
            ExportColumn::make('width_value'),
            ExportColumn::make('width_unit'),
            ExportColumn::make('depth_value'),
            ExportColumn::make('depth_unit'),
            ExportColumn::make('volume_value'),
            ExportColumn::make('volume_unit'),
            ExportColumn::make('created_at'),
            ExportColumn::make('updated_at'),
        ];
    }

    public static function getCompletedNotificationBody(Export $export): string
    {
        $body = 'Your product export has completed and ' . Number::format($export->successful_rows) . ' ' . str('row')->plural($export->successful_rows) . ' exported.';

        if ($failedRowsCount = $export->getFailedRowsCount()) {
            $body .= ' ' . Number::format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to export.';
        }

        return $body;
    }
}
