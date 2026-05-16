<?php

namespace App\Filament\Resources\Shop\Products\Tables;

use App\Models\Shop\Product;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\BulkAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ToggleButtons;
use Filament\Notifications\Notification;
use Filament\Support\Enums\FontWeight;
use Filament\Support\Enums\Width;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Filters\QueryBuilder;
use Filament\Tables\Filters\QueryBuilder\Constraints\BooleanConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\DateConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\NumberConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;
use Filament\Tables\Table;
use Illuminate\Support\Collection;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                \Awcodes\Curator\Components\Tables\CuratorColumn::make('image_id')
                    ->label('Hình ảnh')
                    ->size(40),

                TextColumn::make('name')
                    ->label('Tên sản phẩm')
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Medium),

                TextColumn::make('brand.name')
                    ->label('Thương hiệu')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),

                IconColumn::make('is_visible')
                    ->label('Hiển thị')
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('price')
                    ->label('Giá bán')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('sku')
                    ->label('Mã sản phẩm (SKU)')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('qty')
                    ->label('Số lượng')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('security_stock')
                    ->label('Mức tồn kho cảnh báo')
                    ->searchable()
                    ->sortable()
                    ->toggleable()
                    ->toggledHiddenByDefault(),

                TextColumn::make('published_at')
                    ->label('Ngày đăng')
                    ->date()
                    ->sortable()
                    ->toggleable()
                    ->toggledHiddenByDefault(),
            ])
            ->filters([
                QueryBuilder::make()
                    ->constraints([
                        TextConstraint::make('name'),
                        TextConstraint::make('slug'),
                        TextConstraint::make('sku')
                            ->label('SKU (Stock Keeping Unit)'),
                        TextConstraint::make('barcode')
                            ->label('Barcode (ISBN, UPC, GTIN, etc.)'),
                        TextConstraint::make('description'),
                        NumberConstraint::make('old_price')
                            ->label('Compare at price')
                            ->icon(Heroicon::CurrencyDollar),
                        NumberConstraint::make('price')
                            ->icon(Heroicon::CurrencyDollar),
                        NumberConstraint::make('cost')
                            ->label('Cost per item')
                            ->icon(Heroicon::CurrencyDollar),
                        NumberConstraint::make('qty')
                            ->label('Quantity'),
                        NumberConstraint::make('security_stock'),
                        BooleanConstraint::make('is_visible')
                            ->label('Visibility'),
                        BooleanConstraint::make('featured'),
                        BooleanConstraint::make('backorder'),
                        BooleanConstraint::make('requires_shipping')
                            ->icon(Heroicon::Truck),
                        DateConstraint::make('published_at')
                            ->label('Publishing date'),
                    ])
                    ->constraintPickerColumns(2),
            ], layout: FiltersLayout::AboveContentCollapsible)
            ->deferFilters()
            ->recordActions([
                ActionGroup::make([
                    EditAction::make(),
                    Action::make('toggle_visibility')
                        ->icon(fn (Product $record): Heroicon => $record->is_visible ? Heroicon::EyeSlash : Heroicon::Eye)
                        ->label(fn (Product $record): string => $record->is_visible ? 'Hide' : 'Show')
                        ->color('gray')
                        ->action(fn (Product $record) => $record->update(['is_visible' => ! $record->is_visible])),
                    Action::make('adjust_price')
                        ->icon(Heroicon::CurrencyDollar)
                        ->color('warning')
                        ->modalWidth(Width::Medium)
                        ->modalSubmitActionLabel('Save')
                        ->modalIcon(Heroicon::CurrencyDollar)
                        ->modalIconColor('warning')
                        ->fillForm(fn (Product $record): array => [
                            'price' => $record->price,
                            'old_price' => $record->old_price,
                        ])
                        ->schema([
                            TextInput::make('price')
                                ->numeric()
                                ->prefix('$')
                                ->minValue(0)
                                ->maxValue(99999999.99)
                                ->required(),
                            TextInput::make('old_price')
                                ->label('Compare at price')
                                ->numeric()
                                ->prefix('$')
                                ->minValue(0)
                                ->maxValue(99999999.99),
                        ])
                        ->action(fn (Product $record, array $data) => $record->update($data)),
                    Action::make('adjust_stock')
                        ->icon(Heroicon::CubeTransparent)
                        ->color('info')
                        ->modalWidth(Width::Medium)
                        ->modalSubmitActionLabel('Save')
                        ->fillForm(fn (Product $record): array => [
                            'qty' => $record->qty,
                        ])
                        ->schema([
                            TextInput::make('qty')
                                ->label('Quantity')
                                ->integer()
                                ->required(),
                        ])
                        ->action(fn (Product $record, array $data) => $record->update($data)),
                    DeleteAction::make()
                        ->action(function (): void {
                            Notification::make()
                                ->title('Now, now, don\'t be cheeky, leave some records for others to play with!')
                                ->warning()
                                ->send();
                        }),
                ]),
            ])
            ->groupedBulkActions([
                BulkAction::make('toggle_visibility')
                    ->icon(Heroicon::Eye)
                    ->color('gray')
                    ->schema([
                        ToggleButtons::make('is_visible')
                            ->label('Visibility')
                            ->options([
                                '1' => 'Visible',
                                '0' => 'Hidden',
                            ])
                            ->inline()
                            ->required(),
                    ])
                    ->action(function (Collection $records, array $data): void {
                        $records->each(fn (Product $record) => $record->update(['is_visible' => (bool) $data['is_visible']]));
                    })
                    ->deselectRecordsAfterCompletion(),
                DeleteBulkAction::make()
                    ->action(function (): void {
                        Notification::make()
                            ->title('Now, now, don\'t be cheeky, leave some records for others to play with!')
                            ->warning()
                            ->send();
                    }),
            ]);
    }
}
