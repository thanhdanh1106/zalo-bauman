<?php

namespace App\Filament\Resources\Shop\Orders\Tables;

use App\Enums\OrderStatus;
use App\Models\Shop\Order;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Support\Enums\FontWeight;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Grouping\Group;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('number')
                    ->label('Số đơn hàng')
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Medium),
                TextColumn::make('customer.name')
                    ->label('Khách hàng')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),
                TextColumn::make('status')
                    ->label('Trạng thái')
                    ->badge(),
                TextColumn::make('payment_method')
                    ->label('Thanh toán')
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'cod' => 'COD (Tiền mặt)',
                        'banking' => 'Chuyển khoản',
                        'zalopay' => 'ZaloPay',
                        default => strtoupper($state),
                    })
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'cod' => 'warning',
                        'banking' => 'success',
                        'zalopay' => 'info',
                        default => 'gray',
                    })
                    ->searchable()
                    ->sortable(),
                TextColumn::make('currency')
                    ->label('Tiền tệ')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),
                TextColumn::make('total_price')
                    ->label('Tổng tiền')
                    ->money('VND')
                    ->searchable()
                    ->sortable()
                    ->summarize([
                        Sum::make()
                            ->label('Tổng cộng')
                            ->money('VND'),
                    ]),
                TextColumn::make('shipping_price')
                    ->label('Phí vận chuyển')
                    ->money('VND')
                    ->searchable()
                    ->sortable()
                    ->toggleable()
                    ->summarize([
                        Sum::make()
                            ->label('Tổng phí vận chuyển')
                            ->money('VND'),
                    ]),
                TextColumn::make('created_at')
                    ->label('Ngày đặt hàng')
                    ->date()
                    ->toggleable(),
            ])
            ->filters([
                TrashedFilter::make()->label('Thùng rác'),

                Filter::make('created_at')
                    ->label('Ngày đặt hàng')
                    ->schema([
                        DatePicker::make('created_from')
                            ->label('Từ ngày')
                            ->placeholder(fn ($state): string => '18/12/' . now()->subYear()->format('Y')),
                        DatePicker::make('created_until')
                            ->label('Đến ngày')
                            ->placeholder(fn ($state): string => now()->format('d/m/Y')),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'] ?? null,
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'] ?? null,
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                        if ($data['created_from'] ?? null) {
                            $indicators['created_from'] = 'Đơn hàng từ ' . Carbon::parse($data['created_from'])->translatedFormat('d F, Y');
                        }
                        if ($data['created_until'] ?? null) {
                            $indicators['created_until'] = 'Đơn hàng đến ' . Carbon::parse($data['created_until'])->translatedFormat('d F, Y');
                        }

                        return $indicators;
                    }),
            ])
            ->recordActions([
                ActionGroup::make([
                    Action::make('process')
                        ->label('Xử lý')
                        ->icon(Heroicon::ArrowPath)
                        ->color('warning')
                        ->visible(fn (Order $record): bool => $record->status === OrderStatus::New)
                        ->action(function (Order $record): void {
                            $record->update(['status' => OrderStatus::Processing]);

                            Notification::make()
                                ->title('Đơn hàng đang được xử lý')
                                ->success()
                                ->send();
                        }),
                    Action::make('ship')
                        ->label('Giao hàng')
                        ->icon(Heroicon::Truck)
                        ->color('success')
                        ->visible(fn (Order $record): bool => $record->status === OrderStatus::Processing)
                        ->slideOver()
                        ->modalSubmitActionLabel('Giao hàng')
                        ->schema([
                            Textarea::make('notes')
                                ->label('Ghi chú giao hàng')
                                ->rows(3),
                        ])
                        ->extraModalFooterActions([
                            Action::make('ship_and_notify')
                                ->label('Giao & Thông báo khách hàng')
                                ->color('info')
                                ->action(function (Order $record, array $data): void {
                                    $record->update([
                                        'status' => OrderStatus::Shipped,
                                        'notes' => $data['notes'] ?? null,
                                    ]);

                                    Notification::make()
                                        ->title('Đã giao hàng & thông báo khách hàng thành công')
                                        ->success()
                                        ->send();
                                }),
                        ])
                        ->action(function (Order $record, array $data): void {
                            $record->update([
                                'status' => OrderStatus::Shipped,
                                'notes' => $data['notes'] ?? null,
                            ]);

                            Notification::make()
                                ->title('Đã xác nhận giao hàng')
                                ->success()
                                ->send();
                        }),
                    Action::make('confirm_payment')
                        ->label('Đã thanh toán')
                        ->icon(Heroicon::CheckCircle)
                        ->color('success')
                        ->visible(fn (Order $record): bool => $record->payment_status !== 'paid')
                        ->requiresConfirmation()
                        ->action(function (Order $record): void {
                            $record->update(['payment_status' => 'paid']);
                            try {
                                app(\App\Http\Controllers\Api\MiniApp\Shop\OrderController::class)->awardOrderPoints($record);
                            } catch (\Throwable $e) {
                                // Ignore
                            }

                            Notification::make()
                                ->title('Đã xác nhận thanh toán & cộng điểm hoa hồng')
                                ->success()
                                ->send();
                        }),
                    Action::make('deliver')
                        ->label('Hoàn thành')
                        ->icon(Heroicon::CheckBadge)
                        ->color('success')
                        ->visible(fn (Order $record): bool => $record->status === OrderStatus::Shipped)
                        ->requiresConfirmation()
                        ->action(function (Order $record): void {
                            $record->update(['status' => OrderStatus::Delivered]);
                            try {
                                app(\App\Http\Controllers\Api\MiniApp\Shop\OrderController::class)->awardOrderPoints($record);
                            } catch (\Throwable $e) {
                                // Ignore
                            }

                            Notification::make()
                                ->title('Đơn hàng đã được đánh dấu hoàn thành & cộng điểm')
                                ->success()
                                ->send();
                        }),
                    EditAction::make()->label('Chỉnh sửa'),
                    Action::make('cancel')
                        ->label('Hủy đơn')
                        ->icon(Heroicon::XCircle)
                        ->color('danger')
                        ->visible(fn (Order $record): bool => ! in_array($record->status, [OrderStatus::Delivered, OrderStatus::Cancelled]))
                        ->disabled(fn (Order $record): bool => $record->status === OrderStatus::Shipped)
                        ->requiresConfirmation()
                        ->action(function (Order $record): void {
                            $record->update(['status' => OrderStatus::Cancelled]);

                            Notification::make()
                                ->title('Đã hủy đơn hàng')
                                ->danger()
                                ->send();
                        }),
                    DeleteAction::make()
                        ->label('Xóa')
                        ->action(function (): void {
                            Notification::make()
                                ->title('Dữ liệu này không thể xóa trực tiếp!')
                                ->warning()
                                ->send();
                        }),
                ]),
            ])
            ->groupedBulkActions([
                DeleteBulkAction::make()
                    ->label('Xóa đã chọn')
                    ->action(function (): void {
                        Notification::make()
                            ->title('Thao tác hàng loạt bị hạn chế!')
                            ->warning()
                            ->send();
                    }),
            ])
            ->groups([
                Group::make('created_at')
                    ->label('Ngày đặt hàng')
                    ->date()
                    ->collapsible(),
            ]);
    }
}
