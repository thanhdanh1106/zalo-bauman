<?php

namespace App\Filament\Resources\Blog\Authors\Schemas;

use App\Models\Blog\Author;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class AuthorForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Schemas\Components\Group::make()
                    ->schema([
                        \Filament\Schemas\Components\Section::make('Thông tin tác giả')
                            ->schema([
                                TextInput::make('name')
                                    ->required()
                                    ->maxLength(255),

                                TextInput::make('email')
                                    ->label('Email address')
                                    ->required()
                                    ->maxLength(255)
                                    ->email()
                                    ->unique(Author::class, 'email', ignoreRecord: true),

                                RichEditor::make('bio')
                                    ->columnSpan('full'),
                            ])
                            ->columns(2),
                    ])
                    ->columnSpan(['lg' => 3]),

                \Filament\Schemas\Components\Group::make()
                    ->schema([
                        \Filament\Schemas\Components\Section::make('Mạng xã hội')
                            ->schema([
                                TextInput::make('github_handle')
                                    ->label('GitHub handle')
                                    ->maxLength(255),

                                TextInput::make('twitter_handle')
                                    ->maxLength(255),
                            ]),
                    ])
                    ->columnSpan(['lg' => 1]),
            ])
            ->columns(4);
    }
}
