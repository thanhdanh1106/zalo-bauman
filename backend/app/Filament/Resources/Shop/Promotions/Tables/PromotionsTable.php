<?php

namespace App\Filament\Resources\Shop\Promotions\Tables;

use Awcodes\Curator\Components\Tables\CuratorColumn;
use App\Models\Promotion;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class PromotionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                CuratorColumn::make('image_id')
                    ->label('Hình ảnh')
                    ->size(40),

                TextColumn::make('title')
                    ->label('Tiêu đề')
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Medium),

                TextColumn::make('promotion_code')
                    ->label('Mã KM')
                    ->searchable()
                    ->badge()
                    ->color('warning'),

                TextColumn::make('discount')
                    ->label('Giảm giá')
                    ->suffix('%')
                    ->sortable(),

                TextColumn::make('start_date')
                    ->label('Bắt đầu')
                    ->date()
                    ->sortable(),

                TextColumn::make('end_date')
                    ->label('Kết thúc')
                    ->date()
                    ->sortable(),

                IconColumn::make('is_featured')
                    ->label('Nổi bật')
                    ->boolean(),

                IconColumn::make('is_visible')
                    ->label('Hiển thị')
                    ->boolean(),

                TextColumn::make('views')
                    ->label('Lượt xem')
                    ->sortable(),

                TextColumn::make('status')
                    ->label('Trạng thái')
                    ->badge()
                    ->colors([
                        'success' => 'active',
                        'warning' => 'inactive',
                        'danger' => 'expired',
                    ]),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Trạng thái')
                    ->options([
                        'active' => 'Hoạt động',
                        'inactive' => 'Tạm dừng',
                        'expired' => 'Hết hạn',
                    ]),
            ])
            ->recordActions([
                ActionGroup::make([
                    EditAction::make(),
                    DeleteAction::make(),
                ]),
            ])
            ->groupedBulkActions([
                DeleteBulkAction::make(),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
