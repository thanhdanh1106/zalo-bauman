<?php

namespace App\Filament\Ctv\Widgets;

use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class CtvStats extends BaseWidget
{
    protected function getStats(): array
    {
        /** @var User $user */
        $user = auth()->user();

        return [
            Stat::make('Số dư hiện tại', number_format($user->balance, 0, ',', '.') . ' đ')
                ->description('Tiền có sẵn trong ví')
                ->descriptionIcon('heroicon-m-wallet')
                ->color('success'),
            Stat::make('Đã giới thiệu', User::where('referred_by', $user->id)->count() . ' thành viên')
                ->description('Tổng số người đăng ký qua link')
                ->descriptionIcon('heroicon-m-users')
                ->color('info'),
            Stat::make('Đơn hàng thành công', '0 đơn')
                ->description('Đơn hàng đã hoàn thành')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('warning'),
        ];
    }
}
