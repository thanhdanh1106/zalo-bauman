<?php

namespace App\Filament\Resources\Shop\Orders\Pages;

use App\Filament\Resources\Shop\Orders\OrderResource;
use App\Filament\Resources\Shop\Orders\Schemas\OrderForm;
use App\Models\Shop\Order;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;
use Filament\Resources\Pages\CreateRecord\Concerns\HasWizard;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Wizard\Step;
use Filament\Support\Icons\Heroicon;

class CreateOrder extends CreateRecord
{
    use HasWizard;

    protected static string $resource = OrderResource::class;

    public function getMaxContentWidth(): string
    {
        return '8xl';
    }

    /**
     * @return array<Step>
     */
    protected function getSteps(): array
    {
        return [
            Step::make('Chi tiết đơn hàng')
                ->schema([
                    Section::make()
                        ->schema(OrderForm::getDetailsComponents())
                        ->columns(),
                ]),

            Step::make('Sản phẩm trong đơn')
                ->schema([
                    Section::make()
                        ->schema([OrderForm::getItemsRepeater()]),
                ]),
        ];
    }

    protected function afterCreate(): void
    {
        /** @var Order $order */
        $order = $this->record;

        /** @var User $user */
        $user = auth()->user();

        Notification::make()
            ->title('Đơn hàng mới tạo')
            ->icon(Heroicon::ShoppingBag)
            ->body("**{$order->customer?->name} vừa đặt {$order->orderItems->count()} sản phẩm.**")
            ->actions([
                Action::make('Xem chi tiết')
                    ->url(OrderResource::getUrl('edit', ['record' => $order])),
            ])
            ->sendToDatabase($user);
    }
}
