<?php

declare(strict_types=1);

use Awcodes\Curator\Enums\PreviewableExtensions;
use Awcodes\Curator\Models\Media;
use App\Services\Curator\WordPressPathGenerator;
use App\Filament\Resources\Media\MediaResource;
use Awcodes\Curator\Resources\Media\Pages\CreateMedia;
use Awcodes\Curator\Resources\Media\Pages\EditMedia;
use App\Filament\Resources\Media\Pages\ListMedia;
use Awcodes\Curator\Resources\Media\Schemas\MediaForm;
use Awcodes\Curator\Resources\Media\Tables\MediaTable;
use Awcodes\Curator\Providers\GlideUrlProvider;

return [
    'curation_formats' => PreviewableExtensions::toArray(),
    'default_disk' => env('CURATOR_DEFAULT_DISK', 'public'),
    'default_directory' => 'media',
    'default_visibility' => 'public',
    'features' => [
        'curations' => true,
        'file_swap' => true,
        'directory_restriction' => true,
        'preserve_file_names' => false,
        'tenancy' => [
            'enabled' => false,
            'relationship_name' => null,
        ],
    ],
    'glide_token' => env('CURATOR_GLIDE_TOKEN'),
    'model' => Media::class,
    'path_generator' => WordPressPathGenerator::class,
    'resource' => [
        'label' => 'Media',
        'plural_label' => 'Media',
        'default_layout' => 'grid',
        'navigation' => [
            'group' => null,
            'icon' => 'heroicon-o-photo',
            'sort' => null,
            'should_register' => true,
            'should_show_badge' => false,
        ],
        'resource' => MediaResource::class,
        'pages' => [
            'create' => CreateMedia::class,
            'edit' => EditMedia::class,
            'index' => ListMedia::class,
        ],

        'schemas' => [
            'form' => MediaForm::class,
        ],
        'tables' => [
            'table' => MediaTable::class,
        ],
    ],
    'url_provider' => GlideUrlProvider::class,
];
