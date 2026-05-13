<?php

namespace App\Filament\Widgets;

use App\Enums\OrderStatus;
use App\Models\Shop\Order;
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Database\Eloquent\Builder;

class FlaggedOrders extends BaseWidget
{
    protected int | string | array $columnSpan = 'full';

    protected static ?int $sort = 3;

    protected static ?string $heading = 'Đơn hàng cần chú ý / Tồn đọng';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Order::query()
                    ->where(function (Builder $query): void {
                        $query->where(function (Builder $q): void {
                            $q->where('status', OrderStatus::New)
                                ->where('created_at', '<=', now()->subDays(3));
                        })->orWhere(function (Builder $q): void {
                            $q->where('status', OrderStatus::Processing)
                                ->where('created_at', '<=', now()->subDays(7));
                        });
                    })
                    ->with('customer')
            )
            ->defaultPaginationPageOption(5)
            ->defaultSort('created_at', 'asc')
            ->columns([
                TextColumn::make('number')
                    ->label('Số đơn hàng')
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Medium),
                TextColumn::make('customer.name')
                    ->label('Khách hàng')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('status')
                    ->label('Trạng thái')
                    ->badge(),
                TextColumn::make('total_price')
                    ->label('Tổng tiền')
                    ->money('VND')
                    ->sortable(),
                TextColumn::make('days_old')
                    ->label('Số ngày tồn')
                    ->state(fn (Order $record): int => (int) $record->created_at?->diffInDays(now()))
                    ->sortable(query: fn (Builder $query, string $direction): Builder => $query->orderBy('created_at', $direction === 'asc' ? 'desc' : 'asc'))
                    ->weight(FontWeight::Bold),
                TextColumn::make('issue')
                    ->label('Vấn đề')
                    ->state(fn (Order $record): string => $record->status === OrderStatus::New ? 'Chờ xử lý quá hạn' : 'Kẹt ở khâu xử lý')
                    ->badge()
                    ->color(fn (Order $record): string => $record->status === OrderStatus::New ? 'warning' : 'danger'),
            ]);
    }
}
