<?php

namespace App\Filament\Pages;

use App\Enums\OrderStatus;
use App\Filament\Widgets\CustomerGrowthChart;
use App\Filament\Widgets\CustomerSegmentsChart;
use App\Filament\Widgets\FlaggedOrders;
use App\Filament\Widgets\OrdersYearOverYearChart;
use App\Filament\Widgets\OrderValueDistributionChart;
use App\Filament\Widgets\ProductMarginAnalysisChart;
use App\Filament\Widgets\ShopKpisStats;
use App\Filament\Widgets\TopProductsByRevenueChart;
use App\Models\Shop\ProductCategory;
use BackedEnum;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

class ShopDashboard extends BaseDashboard
{
    use BaseDashboard\Concerns\HasFiltersForm;

    protected static ?string $title = 'Bảng điều khiển';

    protected static string | BackedEnum | null $navigationIcon = Heroicon::OutlinedShoppingCart;

    protected static ?int $navigationSort = 2;

    public function filtersForm(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                    ->schema([
                        DatePicker::make('startDate')
                            ->label('Ngày bắt đầu')
                            ->maxDate(fn (Get $get) => $get('endDate') ?: now()),
                        DatePicker::make('endDate')
                            ->label('Ngày kết thúc')
                            ->minDate(fn (Get $get) => $get('startDate') ?: now())
                            ->maxDate(now()),
                        Select::make('orderStatuses')
                            ->label('Trạng thái đơn hàng')
                            ->options(OrderStatus::class)
                            ->multiple()
                            ->searchable(),
                        Select::make('productCategory')
                            ->label('Danh mục sản phẩm')
                            ->options(fn (): array => ProductCategory::pluck('name', 'id')->all())
                            ->searchable(),
                    ])
                    ->columns(4)
                    ->columnSpanFull(),
            ]);
    }

    public function getWidgets(): array
    {
        return [
            ShopKpisStats::class,
            OrdersYearOverYearChart::class,
            CustomerGrowthChart::class,
            FlaggedOrders::class,
            TopProductsByRevenueChart::class,
            CustomerSegmentsChart::class,
            OrderValueDistributionChart::class,
            ProductMarginAnalysisChart::class,
        ];
    }
}
