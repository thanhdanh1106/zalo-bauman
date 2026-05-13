<?php

namespace App\Filament\Resources\Shop\Orders\RelationManagers;

use App\Enums\CurrencyCode;
use App\Enums\PaymentMethod;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ToggleButtons;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\ColumnGroup;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class PaymentsRelationManager extends RelationManager
{
    protected static string $relationship = 'payments';

    protected static ?string $title = 'Lịch sử thanh toán';

    protected static ?string $modelLabel = 'Giao dịch';

    protected static ?string $recordTitleAttribute = 'reference';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('reference')
                    ->label('Mã tham chiếu')
                    ->columnSpan('full')
                    ->required(),

                TextInput::make('amount')
                    ->label('Số tiền')
                    ->numeric()
                    ->minValue(0)
                    ->maxValue(99999999.99)
                    ->required(),

                Select::make('currency')
                    ->label('Tiền tệ')
                    ->options(CurrencyCode::class)
                    ->searchable()
                    ->required(),

                ToggleButtons::make('provider')
                    ->label('Cổng thanh toán')
                    ->inline()
                    ->grouped()
                    ->options([
                        'zalopay' => 'ZaloPay',
                        'banking' => 'Chuyển khoản',
                        'cod' => 'Tiền mặt (COD)',
                    ])
                    ->required(),

                ToggleButtons::make('method')
                    ->label('Hình thức')
                    ->inline()
                    ->options(PaymentMethod::class)
                    ->required(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                ColumnGroup::make('Chi tiết giao dịch')
                    ->columns([
                        TextColumn::make('reference')
                            ->label('Mã tham chiếu')
                            ->searchable()
                            ->weight(FontWeight::Medium),

                        TextColumn::make('amount')
                            ->label('Số tiền')
                            ->sortable()
                            ->money('VND'),
                    ]),

                ColumnGroup::make('Thông tin cổng')
                    ->columns([
                        TextColumn::make('provider')
                            ->label('Cổng thanh toán')
                            ->formatStateUsing(fn ($state) => match ($state) {
                                'zalopay' => 'ZaloPay',
                                'banking' => 'Chuyển khoản',
                                'cod' => 'COD',
                                default => Str::headline($state),
                            })
                            ->sortable(),

                        TextColumn::make('method')
                            ->label('Hình thức')
                            ->formatStateUsing(fn ($state) => Str::headline($state))
                            ->sortable(),
                    ]),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                CreateAction::make()->label('Thêm giao dịch'),
            ])
            ->recordActions([
                EditAction::make()->label('Sửa'),
                DeleteAction::make()->label('Xóa'),
            ])
            ->groupedBulkActions([
                DeleteBulkAction::make()->label('Xóa đã chọn'),
            ]);
    }
}
