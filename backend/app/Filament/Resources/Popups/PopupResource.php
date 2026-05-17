<?php

namespace App\Filament\Resources\Popups;

use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Awcodes\Curator\Components\Forms\CuratorPicker;
use Awcodes\Curator\Components\Tables\CuratorColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\ActionGroup;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use App\Filament\Resources\Popups\Pages\ListPopups;
use App\Filament\Resources\Popups\Pages\CreatePopup;
use App\Filament\Resources\Popups\Pages\EditPopup;
use App\Models\Popup;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class PopupResource extends Resource
{
    protected static ?string $model = Popup::class;

    protected static ?string $modelLabel = 'Popup Khuyến mãi';

    protected static ?string $pluralModelLabel = 'Popup Khuyến mãi';

    protected static ?string $slug = 'popups';

    protected static ?string $recordTitleAttribute = 'title';

    protected static string | UnitEnum | null $navigationGroup = 'Hệ thống';

    protected static string | BackedEnum | null $navigationIcon = Heroicon::OutlinedBell;

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Thông tin Popup')
                    ->schema([
                        TextInput::make('title')
                            ->label('Tiêu đề')
                            ->maxLength(255),

                        TextInput::make('link')
                            ->label('Đường dẫn (URL)')
                            ->maxLength(255),

                        Toggle::make('is_visible')
                            ->label('Hiển thị')
                            ->default(true),

                        CuratorPicker::make('image_id')
                            ->label('Hình ảnh Popup')
                            ->relationship('image', 'id')
                            ->required(),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                CuratorColumn::make('image_id')
                    ->label('Hình ảnh')
                    ->size(60),

                TextColumn::make('title')
                    ->label('Tiêu đề')
                    ->searchable(),

                TextColumn::make('link')
                    ->label('Link')
                    ->limit(30),

                IconColumn::make('is_visible')
                    ->label('Hiển thị')
                    ->boolean(),

                TextColumn::make('created_at')
                    ->label('Ngày tạo')
                    ->dateTime()
                    ->sortable(),
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

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListPopups::route('/'),
            'create' => CreatePopup::route('/create'),
            'edit' => EditPopup::route('/{record}/edit'),
        ];
    }
}
