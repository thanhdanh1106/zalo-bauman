<?php

namespace App\Filament\Ctv\Widgets;

use App\Models\User;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;
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
                    ->where('payable_type', User::class)
                    ->latest()
            )
            ->columns([
                TextColumn::make('created_at')
                    ->label('Thời gian')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('amount')
                    ->label('Số tiền')
                    ->money('VND')
                    ->color(fn ($state) => $state > 0 ? 'success' : 'danger'),
                TextColumn::make('meta.description')
                    ->label('Nội dung')
                    ->placeholder('Giao dịch hệ thống'),
                BadgeColumn::make('type')
                    ->label('Loại')
                    ->colors([
                        'success' => 'deposit',
                        'danger' => 'withdraw',
                    ]),
            ]);
    }
}
