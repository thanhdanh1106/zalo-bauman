<?php

namespace App\Filament\Imports\Blog;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Awcodes\Curator\Models\Media;
use Exception;
use App\Models\Blog\Post;
use Filament\Actions\Imports\ImportColumn;
use Filament\Actions\Imports\Importer;
use Filament\Actions\Imports\Models\Import;
use Illuminate\Support\Number;

class PostImporter extends Importer
{
    protected static ?string $model = Post::class;

    public static function getColumns(): array
    {
        return [
            ImportColumn::make('author')
                ->relationship(),
            ImportColumn::make('postCategory')
                ->relationship(),
            ImportColumn::make('title')
                ->requiredMapping()
                ->rules(['required', 'max:255']),
            ImportColumn::make('slug')
                ->requiredMapping()
                ->rules(['required', 'max:255']),
            ImportColumn::make('content')
                ->requiredMapping()
                ->rules(['required']),
            ImportColumn::make('published_at')
                ->rules(['date']),
            ImportColumn::make('image_url')
                ->label('Featured Image URL'),
        ];
    }

    public function resolveRecord(): Post
    {
        return Post::firstOrNew([
            'slug' => $this->data['slug'],
        ]);
    }

    protected function beforeSave(): void
    {
        $imageUrl = $this->data['image_url'] ?? null;

        if ($imageUrl && filter_var($imageUrl, FILTER_VALIDATE_URL)) {
            try {
                $response = Http::get($imageUrl);
                if ($response->successful()) {
                    $contents = $response->body();
                    $filename = basename(parse_url($imageUrl, PHP_URL_PATH));
                    if (empty($filename)) {
                        $filename = Str::random(10) . '.jpg';
                    }
                    
                    $path = 'curator/' . Str::random(40) . '_' . $filename;
                    Storage::disk('public')->put($path, $contents);

                    $media = Media::create([
                        'disk' => 'public',
                        'directory' => 'curator',
                        'filename' => pathinfo($filename, PATHINFO_FILENAME),
                        'extension' => pathinfo($filename, PATHINFO_EXTENSION) ?: 'jpg',
                        'path' => $path,
                        'mime_type' => $response->header('Content-Type') ?: 'image/jpeg',
                        'size' => strlen($contents),
                        'width' => 0, // Could be improved with getimagesize
                        'height' => 0,
                    ]);

                    $this->record->image_id = $media->id;
                }
            } catch (Exception $e) {
                // Silent fail or log
            }
        }
    }

    public static function getCompletedNotificationBody(Import $import): string
    {
        $body = 'Your post import has completed and ' . Number::format($import->successful_rows) . ' ' . str('row')->plural($import->successful_rows) . ' imported.';

        if ($failedRowsCount = $import->getFailedRowsCount()) {
            $body .= ' ' . Number::format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to import.';
        }

        return $body;
    }
}
