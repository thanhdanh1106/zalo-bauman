<?php

namespace App\Filament\Imports\Blog;

use App\Models\Blog\PostCategory;
use Filament\Actions\Imports\ImportColumn;
use Filament\Actions\Imports\Importer;
use Filament\Actions\Imports\Models\Import;
use Illuminate\Support\Number;

class PostCategoryImporter extends Importer
{
    protected static ?string $model = PostCategory::class;

    public static function getColumns(): array
    {
        return [
            ImportColumn::make('name')
                ->requiredMapping()
                ->rules(['required', 'max:255']),
            ImportColumn::make('slug')
                ->requiredMapping()
                ->rules(['required', 'max:255']),
            ImportColumn::make('description'),
            ImportColumn::make('is_visible')
                ->requiredMapping()
                ->boolean()
                ->rules(['required', 'boolean']),
            ImportColumn::make('seo_title')
                ->rules(['max:60']),
            ImportColumn::make('seo_description')
                ->rules(['max:160']),
        ];
    }

    public function resolveRecord(): PostCategory
    {
        return PostCategory::firstOrNew([
            'slug' => $this->data['slug'],
        ]);
    }

    public static function getCompletedNotificationBody(Import $import): string
    {
        $body = 'Your post category import has completed and ' . Number::format($import->successful_rows) . ' ' . str('row')->plural($import->successful_rows) . ' imported.';

        if ($failedRowsCount = $import->getFailedRowsCount()) {
            $body .= ' ' . Number::format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to import.';
        }

        return $body;
    }
}
