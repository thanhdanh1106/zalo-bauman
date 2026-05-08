<?php

namespace App\Filament\Resources\ContactForms;

use App\Filament\Resources\ContactForms\Pages\ListContactForms;
use App\Filament\Resources\ContactForms\Pages\ViewContactForm;
use App\Models\ContactForm;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class ContactFormResource extends Resource
{
    protected static ?string $model = ContactForm::class;

    protected static ?string $modelLabel = 'Liên hệ';

    protected static ?string $pluralModelLabel = 'Liên hệ';

    protected static ?string $slug = 'contact-forms';

    protected static ?string $recordTitleAttribute = 'title';

    protected static string | UnitEnum | null $navigationGroup = 'Hệ thống';

    protected static string | BackedEnum | null $navigationIcon = Heroicon::OutlinedEnvelope;

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Schemas\Components\Group::make()
                    ->schema([
                        \Filament\Schemas\Components\Section::make('Thông tin liên hệ')
                            ->schema([
                                \Filament\Forms\Components\TextInput::make('first_name')
                                    ->label('Họ'),
                                \Filament\Forms\Components\TextInput::make('last_name')
                                    ->label('Tên'),
                                \Filament\Forms\Components\TextInput::make('email')
                                    ->label('Email')
                                    ->email(),
                                \Filament\Forms\Components\TextInput::make('phone')
                                    ->label('Số điện thoại')
                                    ->tel(),
                                \Filament\Forms\Components\TextInput::make('title')
                                    ->label('Tiêu đề')
                                    ->columnSpanFull(),
                                \Filament\Forms\Components\Textarea::make('content')
                                    ->label('Nội dung')
                                    ->rows(5)
                                    ->columnSpanFull(),
                            ])
                            ->columns(2),
                    ])
                    ->columnSpan(['lg' => 3]),

                \Filament\Schemas\Components\Group::make()
                    ->schema([
                        \Filament\Schemas\Components\Section::make('Trạng thái')
                            ->schema([
                                \Filament\Forms\Components\Select::make('status')
                                    ->label('Trạng thái')
                                    ->options([
                                        'new' => 'Mới',
                                        'read' => 'Đã đọc',
                                        'replied' => 'Đã trả lời',
                                        'closed' => 'Đã đóng',
                                    ])
                                    ->default('new'),
                            ]),
                    ])
                    ->columnSpan(['lg' => 1]),
            ])
            ->columns(4);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                \Filament\Tables\Columns\TextColumn::make('first_name')
                    ->label('Họ tên')
                    ->getStateUsing(fn ($record) => trim($record->first_name . ' ' . $record->last_name))
                    ->searchable(['first_name', 'last_name']),

                \Filament\Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable(),

                \Filament\Tables\Columns\TextColumn::make('phone')
                    ->label('Số điện thoại')
                    ->searchable(),

                \Filament\Tables\Columns\TextColumn::make('title')
                    ->label('Tiêu đề')
                    ->limit(40),

                \Filament\Tables\Columns\TextColumn::make('status')
                    ->label('Trạng thái')
                    ->badge()
                    ->colors([
                        'info' => 'new',
                        'warning' => 'read',
                        'success' => 'replied',
                        'gray' => 'closed',
                    ]),

                \Filament\Tables\Columns\TextColumn::make('created_at')
                    ->label('Ngày gửi')
                    ->dateTime()
                    ->sortable(),
            ])
            ->recordActions([
                \Filament\Actions\ActionGroup::make([
                    \Filament\Actions\ViewAction::make(),
                    \Filament\Actions\DeleteAction::make(),
                ]),
            ])
            ->groupedBulkActions([
                \Filament\Actions\DeleteBulkAction::make(),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getApiTransformer()
    {
        return \App\Filament\Resources\ContactForms\Api\Transformers\ContactFormTransformer::class;
    }

    public static function getNavigationBadge(): ?string
    {
        return (string) static::getModel()::where('status', 'new')->count();
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListContactForms::route('/'),
            'view' => ViewContactForm::route('/{record}'),
        ];
    }
}
