<?php

namespace App\Filament\Resources\Shop\Products\RelationManagers;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Actions\AttachAction;
use Filament\Actions\DetachAction;
use Filament\Actions\DetachBulkAction;
use Filament\Actions\BulkActionGroup;

class GroupedChildrenRelationManager extends RelationManager
{
    protected static string $relationship = 'groupedChildren';

    protected static ?string $title = 'Sản phẩm trong nhóm (Grouped Items)';

    protected static ?string $modelLabel = 'Sản phẩm con';

    public static function canViewForRecord($ownerRecord, $pageClass): bool
    {
        return $ownerRecord->woo_type === 'grouped';
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('child_product_id')
                    ->label('Sản phẩm')
                    ->relationship('groupedChildren', 'name')
                    ->searchable()
                    ->required(),
                TextInput::make('position')
                    ->label('Thứ tự hiển thị')
                    ->numeric()
                    ->default(0),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Tên sản phẩm')
                    ->searchable(),
                Tables\Columns\TextColumn::make('sku')
                    ->label('SKU'),
                Tables\Columns\TextColumn::make('price')
                    ->label('Giá')
                    ->money('VND'),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                AttachAction::make()
                    ->preloadRecordSelect(),
            ])
            ->actions([
                DetachAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DetachBulkAction::make(),
                ]),
            ]);
    }
}
