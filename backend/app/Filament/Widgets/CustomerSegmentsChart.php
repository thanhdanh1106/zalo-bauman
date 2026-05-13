<?php

namespace App\Filament\Widgets;

use App\Models\Shop\Customer;
use Filament\Widgets\ChartWidget;
use Filament\Widgets\Concerns\InteractsWithPageFilters;
use Illuminate\Support\Carbon;

class CustomerSegmentsChart extends ChartWidget
{
    use InteractsWithPageFilters;

    protected ?string $heading = 'Phân khúc Khách hàng';

    protected static ?int $sort = 5;

    protected function getType(): string
    {
        return 'doughnut';
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

        $customers = Customer::withCount(['orders' => function ($query) use ($startDate, $endDate, $orderStatuses): void {
            $query->when($startDate, fn ($q) => $q->where('created_at', '>=', $startDate))
                ->when($endDate, fn ($q) => $q->where('created_at', '<=', $endDate))
                ->when(filled($orderStatuses), fn ($q) => $q->whereIn('status', $orderStatuses));
        }])->get();

        $segments = [
            'Mua 1 lần (1)' => 0,
            'Thỉnh thoảng (2-3)' => 0,
            'Thường xuyên (4-9)' => 0,
            'Khách VIP (10+)' => 0,
        ];

        foreach ($customers as $customer) {
            $count = $customer->orders_count;

            if ($count <= 0) {
                continue;
            }

            if ($count === 1) {
                $segments['Mua 1 lần (1)']++;
            } elseif ($count <= 3) {
                $segments['Thỉnh thoảng (2-3)']++;
            } elseif ($count <= 9) {
                $segments['Thường xuyên (4-9)']++;
            } else {
                $segments['Khách VIP (10+)']++;
            }
        }

        return [
            'datasets' => [
                [
                    'label' => 'Khách hàng',
                    'data' => array_values($segments),
                    'backgroundColor' => [
                        '#9ca3af',
                        '#3b82f6',
                        '#22c55e',
                        '#f59e0b',
                    ],
                ],
            ],
            'labels' => array_keys($segments),
        ];
    }
}
