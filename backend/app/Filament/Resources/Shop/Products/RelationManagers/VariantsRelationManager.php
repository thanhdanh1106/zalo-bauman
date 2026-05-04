<?php

namespace App\Filament\Resources\Shop\Products\RelationManagers;

use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Awcodes\Curator\Components\Forms\CuratorPicker;
use Filament\Actions\CreateAction;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;

class VariantsRelationManager extends RelationManager
{
    protected static string $relationship = 'variants';

    protected static ?string $title = 'Các biến thể (Variants)';

    protected static ?string $modelLabel = 'Biến thể';

    public static function canViewForRecord($ownerRecord, $pageClass): bool
    {
        return $ownerRecord->woo_type === 'variable';
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('sku')
                    ->label('SKU')
                    ->maxLength(255),
                TextInput::make('price')
                    ->label('Giá bán')
                    ->numeric()
                    ->prefix('đ'),
                TextInput::make('old_price')
                    ->label('Giá cũ')
                    ->numeric()
                    ->prefix('đ'),
                TextInput::make('qty')
                    ->label('Số lượng')
                    ->numeric()
                    ->default(0),
                CuratorPicker::make('image_id')
                    ->label('Hình ảnh biến thể')
                    ->relationship('image', 'id'),
                KeyValue::make('attributes')
                    ->label('Thuộc tính (JSON)')
                    ->helperText('Ví dụ: Màu => Đỏ, Size => L')
                    ->keyLabel('Tên thuộc tính')
                    ->valueLabel('Giá trị'),
                Toggle::make('is_visible')
                    ->label('Hiển thị')
                    ->default(true),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('sku')
            ->columns([
                Tables\Columns\TextColumn::make('sku')->label('SKU')->searchable(),
                Tables\Columns\TextColumn::make('attributes')
                    ->label('Thuộc tính')
                    ->formatStateUsing(function ($state) {
                        if (!$state) return '-';
                        return collect($state)->map(fn ($v, $k) => "{$k}: {$v}")->implode(', ');
                    }),
                Tables\Columns\TextColumn::make('price')
                    ->label('Giá')
                    ->money('VND'),
                Tables\Columns\TextColumn::make('qty')
                    ->label('Kho'),
                Tables\Columns\IconColumn::make('is_visible')
                    ->label('Hiện')
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
