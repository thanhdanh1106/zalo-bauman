<?php

namespace App\Filament\Resources\Banners;

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
use App\Filament\Resources\Banners\Api\Transformers\BannerTransformer;
use App\Filament\Resources\Banners\Pages\ListBanners;
use App\Filament\Resources\Banners\Pages\CreateBanner;
use App\Filament\Resources\Banners\Pages\EditBanner;
use App\Models\Banner;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class BannerResource extends Resource
{
    protected static ?string $model = Banner::class;

    protected static ?string $modelLabel = 'Banner';

    protected static ?string $pluralModelLabel = 'Banner';

    protected static ?string $slug = 'banners';

    protected static ?string $recordTitleAttribute = 'title';

    protected static string | UnitEnum | null $navigationGroup = 'Hệ thống';

    protected static string | BackedEnum | null $navigationIcon = Heroicon::OutlinedPhoto;

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Thông tin Banner')
                    ->schema([
                        TextInput::make('title')
                            ->label('Tiêu đề')
                            ->maxLength(255),

                        TextInput::make('subtitle')
                            ->label('Phụ đề')
                            ->maxLength(255),

                        TextInput::make('link')
                            ->label('Đường dẫn (URL)')
                            ->url()
                            ->maxLength(255),

                        TextInput::make('sort_order')
                            ->label('Thứ tự')
                            ->numeric()
                            ->default(0),

                        Toggle::make('is_visible')
                            ->label('Hiển thị')
                            ->default(true),

                        CuratorPicker::make('image_id')
                            ->label('Hình ảnh Banner')
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

                TextColumn::make('sort_order')
                    ->label('Thứ tự')
                    ->sortable(),

                IconColumn::make('is_visible')
                    ->label('Hiển thị')
                    ->boolean(),
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
            ->defaultSort('sort_order', 'asc')
            ->reorderable('sort_order');
    }

    public static function getApiTransformer()
    {
        return BannerTransformer::class;
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListBanners::route('/'),
            'create' => CreateBanner::route('/create'),
            'edit' => EditBanner::route('/{record}/edit'),
        ];
    }
}
