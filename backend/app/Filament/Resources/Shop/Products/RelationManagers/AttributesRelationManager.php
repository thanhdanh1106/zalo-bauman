<?php

namespace App\Filament\Resources\Shop\Products\RelationManagers;

use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Actions\CreateAction;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;

class AttributesRelationManager extends RelationManager
{
    protected static string $relationship = 'attributes';

    protected static ?string $title = 'Thuộc tính (Attributes)';
    
    protected static ?string $modelLabel = 'Thuộc tính';

    public static function canViewForRecord($ownerRecord, $pageClass): bool
    {
        return in_array($ownerRecord->woo_type, ['variable', 'simple']);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Tên thuộc tính')
                    ->required()
                    ->maxLength(255),
                TextInput::make('slug')
                    ->label('Slug')
                    ->maxLength(255),
                Toggle::make('is_visible')
                    ->label('Hiển thị')
                    ->default(true),
                Toggle::make('for_variations')
                    ->label('Dùng cho biến thể')
                    ->default(false),
                Repeater::make('values')
                    ->relationship('values')
                    ->schema([
                        TextInput::make('value')
                            ->label('Giá trị')
                            ->required(),
                        TextInput::make('position')
                            ->label('Vị trí')
                            ->numeric()
                            ->default(0),
                    ])
                    ->label('Danh sách giá trị')
                    ->columnSpanFull()
                    ->columns(2),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Tên'),
                Tables\Columns\TextColumn::make('values.value')
                    ->label('Giá trị')
                    ->badge()
                    ->separator(', '),
                Tables\Columns\IconColumn::make('is_visible')
                    ->label('Hiển thị')
                    ->boolean(),
                Tables\Columns\IconColumn::make('for_variations')
                    ->label('Biến thể')
                    ->boolean(),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                CreateAction::make(),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
