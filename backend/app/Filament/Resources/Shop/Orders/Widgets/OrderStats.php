<?php

namespace App\Filament\Resources\Shop\Orders\Widgets;

use App\Filament\Resources\Shop\Orders\Pages\ListOrders;
use App\Models\Shop\Order;
use Filament\Widgets\Concerns\InteractsWithPageTable;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;

class OrderStats extends BaseWidget
{
    use InteractsWithPageTable;

    protected ?string $pollingInterval = null;

    protected function getTablePage(): string
    {
        return ListOrders::class;
    }

    protected function getStats(): array
    {
        $orderData = Trend::model(Order::class)
            ->between(
                start: now()->subYear(),
                end: now(),
            )
            ->perMonth()
            ->count();

        return [
            Stat::make('Tổng đơn hàng', $this->getPageTableQuery()->count())
                ->chart(
                    $orderData
                        ->map(fn (TrendValue $value) => $value->aggregate)
                        ->toArray()
                ),
            Stat::make('Đơn đang xử lý', $this->getPageTableQuery()->whereIn('status', ['new', 'processing'])->count()),
            Stat::make('Giá trị trung bình', number_format((float) $this->getPageTableQuery()->avg('total_price'), 0, ',', '.') . ' ₫'),
        ];
    }
}
