<?php

namespace App\Filament\Resources\Shop\Orders\Schemas;

use App\Enums\CurrencyCode;
use App\Enums\OrderStatus;
use App\Filament\Resources\Shop\Products\ProductResource;
use App\Forms\Components\AddressForm;
use App\Models\Shop\Order;
use App\Models\Shop\Product;
use Filament\Actions\Action;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Repeater\TableColumn;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ToggleButtons;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Support\Enums\Width;
use Filament\Support\Icons\Heroicon;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Group::make()
                    ->schema([
                        Section::make('Chi tiết đơn hàng')
                            ->schema(static::getDetailsComponents())
                            ->columns(2),

                        Section::make('Sản phẩm trong đơn')
                            ->afterHeader([
                                Action::make('reset')
                                    ->label('Đặt lại')
                                    ->modalHeading('Bạn có chắc chắn?')
                                    ->modalDescription('Tất cả các sản phẩm hiện tại sẽ bị xóa khỏi đơn hàng.')
                                    ->requiresConfirmation()
                                    ->color('danger')
                                    ->action(fn (Set $set) => $set('items', [])),
                            ])
                            ->schema([
                                static::getItemsRepeater(),
                            ]),
                    ])
                    ->columnSpan(['lg' => 3]),

                Section::make()
                    ->schema([
                        TextEntry::make('created_at')
                            ->label('Ngày đặt hàng')
                            ->state(fn (Order $record): ?string => $record->created_at?->diffForHumans()),

                        TextEntry::make('updated_at')
                            ->label('Cập nhật lần cuối')
                            ->state(fn (Order $record): ?string => $record->updated_at?->diffForHumans()),
                    ])
                    ->columnSpan(['lg' => 1])
                    ->hidden(fn (?Order $record) => $record === null),
            ])
            ->columns(4);
    }

    /**
     * @return array<Component>
     */
    public static function getDetailsComponents(): array
    {
        return [
            TextInput::make('number')
                ->label('Số đơn hàng')
                ->default('OR-' . random_int(100000, 999999))
                ->disabled()
                ->dehydrated()
                ->required()
                ->maxLength(32)
                ->unique(Order::class, 'number', ignoreRecord: true),

            Select::make('customer_id')
                ->label('Khách hàng')
                ->relationship('customer', 'name')
                ->searchable()
                ->required()
                ->createOptionForm([
                    TextInput::make('name')
                        ->label('Tên khách hàng')
                        ->required()
                        ->maxLength(255),

                    TextInput::make('email')
                        ->label('Địa chỉ Email')
                        ->required()
                        ->email()
                        ->maxLength(255)
                        ->unique(),

                    TextInput::make('phone')
                        ->label('Số điện thoại')
                        ->maxLength(255),
                ])
                ->createOptionAction(function (Action $action) {
                    return $action
                        ->label('Thêm khách hàng')
                        ->modalHeading('Tạo khách hàng mới')
                        ->modalSubmitActionLabel('Tạo khách hàng')
                        ->modalWidth(Width::Large);
                }),

            ToggleButtons::make('status')
                ->label('Trạng thái')
                ->inline()
                ->options(OrderStatus::class)
                ->required(),

            Select::make('currency')
                ->label('Tiền tệ')
                ->options(CurrencyCode::class)
                ->searchable()
                ->required(),

            Select::make('payment_method')
                ->label('Phương thức thanh toán')
                ->options([
                    'cod' => 'Thanh toán tiền mặt (COD)',
                    'banking' => 'Chuyển khoản ngân hàng',
                    'zalopay' => 'Ví ZaloPay / Cổng thanh toán',
                ])
                ->default('cod')
                ->required(),

            AddressForm::make('address')
                ->label('Địa chỉ giao hàng')
                ->columnSpan('full'),

            RichEditor::make('notes')
                ->label('Ghi chú')
                ->columnSpan('full'),
        ];
    }

    public static function getItemsRepeater(): Repeater
    {
        return Repeater::make('items')
            ->label('Sản phẩm')
            ->relationship('orderItems')
            ->table([
                TableColumn::make('Sản phẩm'),
                TableColumn::make('Số lượng')
                    ->width(100),
                TableColumn::make('Đơn giá')
                    ->width(110),
            ])
            ->schema([
                Select::make('product_id')
                    ->label('Sản phẩm')
                    ->options(Product::query()->pluck('name', 'id'))
                    ->required()
                    ->reactive()
                    ->afterStateUpdated(fn ($state, Set $set) => $set('unit_price', Product::find($state)->price ?? 0))
                    ->distinct()
                    ->disableOptionsWhenSelectedInSiblingRepeaterItems()
                    ->searchable(),

                TextInput::make('qty')
                    ->label('Số lượng')
                    ->integer()
                    ->minValue(1)
                    ->maxValue(2147483647)
                    ->default(1)
                    ->required(),

                TextInput::make('unit_price')
                    ->label('Đơn giá')
                    ->disabled()
                    ->dehydrated()
                    ->numeric()
                    ->minValue(0)
                    ->maxValue(99999999.99)
                    ->required(),
            ])
            ->extraItemActions([
                Action::make('openProduct')
                    ->tooltip('Mở sản phẩm')
                    ->icon(Heroicon::ArrowTopRightOnSquare)
                    ->url(function (array $arguments, Repeater $component): ?string {
                        $itemData = $component->getRawItemState($arguments['item']);

                        $product = Product::find($itemData['product_id']);

                        if (! $product) {
                            return null;
                        }

                        return ProductResource::getUrl('edit', ['record' => $product]);
                    }, shouldOpenInNewTab: true)
                    ->hidden(fn (array $arguments, Repeater $component): bool => blank($component->getRawItemState($arguments['item'])['product_id'])),
            ])
            ->orderColumn('sort')
            ->defaultItems(1)
            ->hiddenLabel()
            ->required();
    }
}
