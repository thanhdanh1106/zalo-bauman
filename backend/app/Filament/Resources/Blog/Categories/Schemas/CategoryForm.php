<?php

namespace App\Filament\Resources\Blog\Categories\Schemas;

use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use App\Models\Blog\PostCategory;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;
use Awcodes\Curator\Components\Forms\CuratorPicker;

class CategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Group::make()
                    ->schema([
                        Section::make('Thông tin danh mục')
                            ->schema([
                                TextInput::make('name')
                                    ->label('Tên danh mục')
                                    ->required()
                                    ->maxLength(255)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $operation, $state, Set $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null)
                                    ->columnSpanFull(),

                                TextInput::make('slug')
                                    ->label('Đường dẫn (Slug)')
                                    ->disabled()
                                    ->dehydrated()
                                    ->required()
                                    ->maxLength(255)
                                    ->unique(PostCategory::class, 'slug', ignoreRecord: true)
                                    ->columnSpanFull(),

                                RichEditor::make('description')
                                    ->label('Mô tả')
                                    ->columnSpan('full')
                                    ->extraInputAttributes(['style' => 'min-height: 400px;']),
                            ])
                            ->columns(2),
                    ])
                    ->columnSpan(['lg' => 3]),

                Group::make()
                    ->schema([
                        Section::make('Trạng thái & Hình ảnh')
                            ->schema([
                                Toggle::make('is_visible')
                                    ->label('Hiển thị')
                                    ->default(true),

                                CuratorPicker::make('image_id')
                                    ->label('Ảnh đại diện')
                                    ->relationship('image', 'id'),
                            ]),
                    ])
                    ->columnSpan(['lg' => 1]),
            ])
            ->columns(4);
    }
}
