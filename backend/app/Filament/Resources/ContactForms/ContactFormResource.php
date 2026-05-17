<?php

namespace App\Filament\Resources\ContactForms;

use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Tables\Columns\TextColumn;
use Filament\Actions\ActionGroup;
use Filament\Actions\ViewAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use App\Filament\Resources\ContactForms\Api\Transformers\ContactFormTransformer;
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
                Group::make()
                    ->schema([
                        Section::make('Thông tin liên hệ')
                            ->schema([
                                TextInput::make('first_name')
                                    ->label('Họ'),
                                TextInput::make('last_name')
                                    ->label('Tên'),
                                TextInput::make('email')
                                    ->label('Email')
                                    ->email(),
                                TextInput::make('phone')
                                    ->label('Số điện thoại')
                                    ->tel(),
                                TextInput::make('title')
                                    ->label('Tiêu đề')
                                    ->columnSpanFull(),
                                Textarea::make('content')
                                    ->label('Nội dung')
                                    ->rows(5)
                                    ->columnSpanFull(),
                            ])
                            ->columns(2),
                    ])
                    ->columnSpan(['lg' => 3]),

                Group::make()
                    ->schema([
                        Section::make('Trạng thái')
                            ->schema([
                                Select::make('status')
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
                TextColumn::make('first_name')
                    ->label('Họ tên')
                    ->getStateUsing(fn ($record) => trim($record->first_name . ' ' . $record->last_name))
                    ->searchable(['first_name', 'last_name']),

                TextColumn::make('email')
                    ->label('Email')
                    ->searchable(),

                TextColumn::make('phone')
                    ->label('Số điện thoại')
                    ->searchable(),

                TextColumn::make('title')
                    ->label('Tiêu đề')
                    ->limit(40),

                TextColumn::make('status')
                    ->label('Trạng thái')
                    ->badge()
                    ->colors([
                        'info' => 'new',
                        'warning' => 'read',
                        'success' => 'replied',
                        'gray' => 'closed',
                    ]),

                TextColumn::make('created_at')
                    ->label('Ngày gửi')
                    ->dateTime()
                    ->sortable(),
            ])
            ->recordActions([
                ActionGroup::make([
                    ViewAction::make(),
                    DeleteAction::make(),
                ]),
            ])
            ->groupedBulkActions([
                DeleteBulkAction::make(),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getApiTransformer()
    {
        return ContactFormTransformer::class;
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
