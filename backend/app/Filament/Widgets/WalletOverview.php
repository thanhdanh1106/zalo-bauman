<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class WalletOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $totalBalance = \DB::table('wallets')->sum('balance');
        $totalCts = User::role('ctv')->count();

        return [
            Stat::make('Tổng số dư ví hệ thống', number_format($totalBalance, 0, ',', '.') . ' đ')
                ->description('Tổng tiền trong ví của tất cả người dùng')
                ->descriptionIcon('heroicon-m-wallet')
                ->color('success'),
            Stat::make('Tổng số Cộng tác viên', $totalCts)
                ->description('Số lượng CTV đang hoạt động')
                ->descriptionIcon('heroicon-m-users')
                ->color('info'),
        ];
    }
}
