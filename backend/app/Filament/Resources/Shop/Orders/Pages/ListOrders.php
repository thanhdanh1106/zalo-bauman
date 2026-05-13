<?php

namespace App\Filament\Resources\Shop\Orders\Pages;

use App\Filament\Resources\Shop\Orders\OrderResource;
use Filament\Actions\CreateAction;
use Filament\Pages\Concerns\ExposesTableToWidgets;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;

class ListOrders extends ListRecords
{
    use ExposesTableToWidgets;

    protected static string $resource = OrderResource::class;

    protected function getActions(): array
    {
        return [
            CreateAction::make()->label('Tạo đơn hàng mới'),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return OrderResource::getWidgets();
    }

    public function getTabs(): array
    {
        return [
            null => Tab::make('Tất cả'),
            'new' => Tab::make('Mới')->query(fn ($query) => $query->where('status', 'new')),
            'processing' => Tab::make('Đang xử lý')->query(fn ($query) => $query->where('status', 'processing')),
            'shipped' => Tab::make('Đang giao')->query(fn ($query) => $query->where('status', 'shipped')),
            'delivered' => Tab::make('Đã giao')->query(fn ($query) => $query->where('status', 'delivered')),
            'cancelled' => Tab::make('Đã hủy')->query(fn ($query) => $query->where('status', 'cancelled')),
        ];
    }

    public function getMaxContentWidth(): string
    {
        return '8xl';
    }
}
