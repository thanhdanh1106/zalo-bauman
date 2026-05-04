<?php

namespace App\Filament\Imports\Media;

use Awcodes\Curator\Models\Media;
use Filament\Actions\Imports\ImportColumn;
use Filament\Actions\Imports\Importer;
use Filament\Actions\Imports\Models\Import;
use Illuminate\Support\Number;

class MediaImporter extends Importer
{
    protected static ?string $model = Media::class;

    public static function getColumns(): array
    {
        return [
            ImportColumn::make('public_id')
                ->label('Public ID'),
            ImportColumn::make('filename')
                ->rules(['max:255']),
            ImportColumn::make('alt')
                ->rules(['max:255']),
            ImportColumn::make('title')
                ->rules(['max:255']),
            ImportColumn::make('description'),
            ImportColumn::make('caption'),
            ImportColumn::make('image_url')
                ->label('Source URL')
                ->requiredMapping(),
        ];
    }

    public function resolveRecord(): Media
    {
        return new Media();
    }

    protected function beforeSave(): void
    {
        $imageUrl = $this->data['image_url'] ?? null;

        if ($imageUrl && filter_var($imageUrl, FILTER_VALIDATE_URL)) {
            try {
                $response = \Illuminate\Support\Facades\Http::get($imageUrl);
                if ($response->successful()) {
                    $contents = $response->body();
                    $filename = basename(parse_url($imageUrl, PHP_URL_PATH));
                    if (empty($filename)) {
                        $filename = \Illuminate\Support\Str::random(10) . '.jpg';
                    }
                    
                    $path = 'curator/' . \Illuminate\Support\Str::random(40) . '_' . $filename;
                    \Illuminate\Support\Facades\Storage::disk('public')->put($path, $contents);

                    $this->record->fill([
                        'disk' => 'public',
                        'directory' => 'curator',
                        'filename' => pathinfo($filename, PATHINFO_FILENAME),
                        'extension' => pathinfo($filename, PATHINFO_EXTENSION) ?: 'jpg',
                        'path' => $path,
                        'mime_type' => $response->header('Content-Type') ?: 'image/jpeg',
                        'size' => strlen($contents),
                        'width' => 0,
                        'height' => 0,
                        'public_id' => $this->data['public_id'] ?? \Illuminate\Support\Str::random(10),
                    ]);
                }
            } catch (\Exception $e) {
                // Ignore
            }
        }
    }


    public static function getCompletedNotificationBody(Import $import): string
    {
        $body = 'Your media import has completed and ' . Number::format($import->successful_rows) . ' ' . str('row')->plural($import->successful_rows) . ' imported.';

        if ($failedRowsCount = $import->getFailedRowsCount()) {
            $body .= ' ' . Number::format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to import.';
        }

        return $body;
    }
}
