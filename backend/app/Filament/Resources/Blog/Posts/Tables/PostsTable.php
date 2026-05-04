<?php

namespace App\Filament\Resources\Blog\Posts\Tables;

use App\Models\Blog\Post;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Notifications\Notification;
use Filament\Support\Enums\FontWeight;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class PostsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                \Awcodes\Curator\Components\Tables\CuratorColumn::make('image_id')
                    ->label('Hình ảnh')
                    ->size(40),

                TextColumn::make('title')
                    ->label('Tiêu đề')
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Medium),

                TextColumn::make('slug')
                    ->label('Slug')
                    ->searchable()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('author.name')
                    ->label('Tác giả')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('status')
                    ->label('Trạng thái')
                    ->badge()
                    ->getStateUsing(fn (Post $record): string => $record->published_at?->isPast() ? 'Đã đăng' : 'Bản nháp')
                    ->colors([
                        'success' => 'Đã đăng',
                        'warning' => 'Bản nháp',
                    ]),

                TextColumn::make('postCategory.name')
                    ->label('Danh mục')
                    ->searchable()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('published_at')
                    ->label('Ngày đăng')
                    ->date(),
            ])
            ->filters([
                Filter::make('published_at')
                    ->schema([
                        DatePicker::make('published_from')
                            ->placeholder(fn ($state): string => 'Dec 18, ' . now()->subYear()->format('Y')),
                        DatePicker::make('published_until')
                            ->placeholder(fn ($state): string => now()->format('M d, Y')),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['published_from'] ?? null,
                                fn (Builder $query, $date): Builder => $query->whereDate('published_at', '>=', $date),
                            )
                            ->when(
                                $data['published_until'] ?? null,
                                fn (Builder $query, $date): Builder => $query->whereDate('published_at', '<=', $date),
                            );
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                        if ($data['published_from'] ?? null) {
                            $indicators['published_from'] = 'Published from ' . Carbon::parse($data['published_from'])->toFormattedDateString();
                        }
                        if ($data['published_until'] ?? null) {
                            $indicators['published_until'] = 'Published until ' . Carbon::parse($data['published_until'])->toFormattedDateString();
                        }

                        return $indicators;
                    }),
            ])
            ->recordActions([
                ActionGroup::make([
                    Action::make('toggle_publish')
                        ->icon(fn (Post $record): Heroicon => $record->published_at?->isPast() ? Heroicon::XCircle : Heroicon::RocketLaunch)
                        ->label(fn (Post $record): string => $record->published_at?->isPast() ? 'Unpublish' : 'Publish')
                        ->color(fn (Post $record): string => $record->published_at?->isPast() ? 'warning' : 'success')
                        ->action(function (Post $record): void {
                            $record->update([
                                'published_at' => $record->published_at?->isPast() ? null : now(),
                            ]);

                            Notification::make()
                                ->title($record->published_at ? 'Post published' : 'Post unpublished')
                                ->success()
                                ->send();
                        }),
                    ViewAction::make(),
                    EditAction::make(),
                    DeleteAction::make()
                        ->action(function (): void {
                            Notification::make()
                                ->title('Now, now, don\'t be cheeky, leave some records for others to play with!')
                                ->warning()
                                ->send();
                        }),
                ]),
            ])
            ->groupedBulkActions([
                DeleteBulkAction::make()
                    ->action(function (): void {
                        Notification::make()
                            ->title('Now, now, don\'t be cheeky, leave some records for others to play with!')
                            ->warning()
                            ->send();
                    }),
            ]);
    }
}
