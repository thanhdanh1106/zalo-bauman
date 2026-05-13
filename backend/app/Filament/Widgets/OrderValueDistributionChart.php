<?php

namespace App\Filament\Widgets;

use App\Models\Shop\Order;
use Filament\Widgets\ChartWidget;
use Filament\Widgets\Concerns\InteractsWithPageFilters;
use Illuminate\Support\Carbon;

class OrderValueDistributionChart extends ChartWidget
{
    use InteractsWithPageFilters;

    protected ?string $heading = 'Phân bổ Giá trị Đơn hàng';

    protected static ?int $sort = 6;

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getData(): array
    {
        $startDate = filled($this->pageFilters['startDate'] ?? null)
            ? Carbon::parse($this->pageFilters['startDate'])
            : null;
        $endDate = filled($this->pageFilters['endDate'] ?? null)
            ? Carbon::parse($this->pageFilters['endDate'])
            : null;
        $orderStatuses = $this->pageFilters['orderStatuses'] ?? null;

        $orders = Order::query()
            ->whereNotNull('total_price')
            ->when($startDate, fn ($q) => $q->where('created_at', '>=', $startDate))
            ->when($endDate, fn ($q) => $q->where('created_at', '<=', $endDate))
            ->when(filled($orderStatuses), fn ($q) => $q->whereIn('status', $orderStatuses))
            ->pluck('total_price');

        $ranges = [
            'Dưới 100k' => 0,
            '100k - 300k' => 0,
            '300k - 500k' => 0,
            '500k - 1tr' => 0,
            '1tr - 2tr' => 0,
            'Trên 2tr' => 0,
        ];

        foreach ($orders as $price) {
            $price = (float) $price;

            if ($price < 100000) {
                $ranges['Dưới 100k']++;
            } elseif ($price < 300000) {
                $ranges['100k - 300k']++;
            } elseif ($price < 500000) {
                $ranges['300k - 500k']++;
            } elseif ($price < 1000000) {
                $ranges['500k - 1tr']++;
            } elseif ($price < 2000000) {
                $ranges['1tr - 2tr']++;
            } else {
                $ranges['Trên 2tr']++;
            }
        }

        return [
            'datasets' => [
                [
                    'label' => 'Đơn hàng',
                    'data' => array_values($ranges),
                    'backgroundColor' => [
                        '#22c55e',
                        '#3b82f6',
                        '#8b5cf6',
                        '#f59e0b',
                        '#ef4444',
                        '#ec4899',
                    ],
                    'borderColor' => [
                        '#22c55e',
                        '#3b82f6',
                        '#8b5cf6',
                        '#f59e0b',
                        '#ef4444',
                        '#ec4899',
                    ],
                ],
            ],
            'labels' => array_keys($ranges),
        ];
    }
}
