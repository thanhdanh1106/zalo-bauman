<?php

namespace App\Filament\Resources\Shop\Comments\Schemas;

use App\Models\Shop\Product;
use App\Models\Blog\Post;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CommentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Group::make()
                    ->schema([
                        Section::make('Nội dung đánh giá')
                            ->schema([
                                TextInput::make('title')
                                    ->label('Tiêu đề')
                                    ->required()
                                    ->maxLength(255)
                                    ->columnSpanFull(),

                                RichEditor::make('content')
                                    ->label('Nội dung chi tiết')
                                    ->required()
                                    ->columnSpanFull(),
                            ]),
                    ])
                    ->columnSpan(['lg' => 3]),

                Group::make()
                    ->schema([
                        Section::make('Thông tin chung')
                            ->schema([
                                Select::make('customer_id')
                                    ->label('Khách hàng')
                                    ->relationship('customer', 'name')
                                    ->searchable()
                                    ->required(),

                                Select::make('rating')
                                    ->label('Đánh giá (Sao)')
                                    ->options([
                                        5 => '5 Sao ⭐⭐⭐⭐⭐',
                                        4 => '4 Sao ⭐⭐⭐⭐',
                                        3 => '3 Sao ⭐⭐⭐',
                                        2 => '2 Sao ⭐⭐',
                                        1 => '1 Sao ⭐',
                                    ])
                                    ->default(5)
                                    ->required(),

                                Toggle::make('is_visible')
                                    ->label('Hiển thị công khai')
                                    ->default(true),
                            ]),

                        Section::make('Đối tượng đánh giá')
                            ->schema([
                                TextInput::make('commentable_type')
                                    ->label('Loại đối tượng')
                                    ->disabled()
                                    ->dehydrated(false),

                                TextInput::make('commentable_id')
                                    ->label('ID đối tượng')
                                    ->disabled()
                                    ->dehydrated(false),
                            ])
                            ->hidden(fn ($record) => $record === null),
                    ])
                    ->columnSpan(['lg' => 1]),
            ])
            ->columns(4);
    }
}
