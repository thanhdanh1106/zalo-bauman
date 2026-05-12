<?php

namespace App\Filament\Resources\Shop\Comments\Tables;

use App\Models\Comment;
use Filament\Actions\Action;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;
use Filament\Support\Enums\FontWeight;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CommentsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->label('Tiêu đề')
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Medium),

                TextColumn::make('customer.name')
                    ->label('Khách hàng')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('commentable.name')
                    ->label('Sản phẩm / Bài viết')
                    ->searchable()
                    ->sortable()
                    ->state(function (Comment $record) {
                        return optional($record->commentable)->name ?? optional($record->commentable)->title ?? 'N/A';
                    }),

                TextColumn::make('rating')
                    ->label('Đánh giá')
                    ->formatStateUsing(fn ($state) => str_repeat('⭐', (int) $state))
                    ->sortable(),

                IconColumn::make('is_visible')
                    ->label('Hiển thị')
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Ngày tạo')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                Action::make('toggle_visibility')
                    ->icon(fn (Comment $record): Heroicon => $record->is_visible ? Heroicon::EyeSlash : Heroicon::Eye)
                    ->color('gray')
                    ->tooltip(fn (Comment $record): string => $record->is_visible ? 'Ẩn bình luận' : 'Hiện bình luận')
                    ->action(fn (Comment $record) => $record->update(['is_visible' => ! $record->is_visible])),
                EditAction::make(),
            ])
            ->groupedBulkActions([
                DeleteBulkAction::make()
                    ->action(function (): void {
                        Notification::make()
                            ->title('Không được phép xóa hàng loạt để bảo đảm dữ liệu demo.')
                            ->warning()
                            ->send();
                    }),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
