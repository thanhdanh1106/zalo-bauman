<?php

namespace App\Filament\Ctv\Widgets;

use Bavix\Wallet\Models\Transaction;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class CtvRecentTransactions extends BaseWidget
{
    protected static ?string $heading = 'Lịch sử giao dịch gần đây';

    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Transaction::query()
                    ->where('payable_id', auth()->id())
                    ->where('payable_type', \App\Models\User::class)
                    ->latest()
            )
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Thời gian')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('amount')
                    ->label('Số tiền')
                    ->money('VND')
                    ->color(fn ($state) => $state > 0 ? 'success' : 'danger'),
                Tables\Columns\TextColumn::make('meta.description')
                    ->label('Nội dung')
                    ->placeholder('Giao dịch hệ thống'),
                Tables\Columns\BadgeColumn::make('type')
                    ->label('Loại')
                    ->colors([
                        'success' => 'deposit',
                        'danger' => 'withdraw',
                    ]),
            ]);
    }
}
