<?php

namespace App\Filament\Resources\Shop\Rewards;

use App\Filament\Resources\Shop\Rewards\Pages\ListRewards;
use App\Filament\Resources\Shop\Rewards\Pages\CreateReward;
use App\Filament\Resources\Shop\Rewards\Pages\EditReward;
use App\Models\Reward;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class RewardResource extends Resource
{
    protected static ?string $model = Reward::class;

    protected static ?string $modelLabel = 'Phần thưởng';

    protected static ?string $pluralModelLabel = 'Phần thưởng';

    protected static ?string $slug = 'shop/rewards';

    protected static ?string $recordTitleAttribute = 'name';

    protected static string | UnitEnum | null $navigationGroup = 'Cửa hàng';

    protected static string | BackedEnum | null $navigationIcon = Heroicon::OutlinedTrophy;

    protected static ?int $navigationSort = 6;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Schemas\Components\Section::make('Thông tin phần thưởng')
                    ->schema([
                        \Filament\Forms\Components\TextInput::make('name')
                            ->label('Tên phần thưởng')
                            ->required()
                            ->maxLength(255),

                        \Filament\Forms\Components\Textarea::make('description')
                            ->label('Mô tả')
                            ->rows(3),

                        \Filament\Forms\Components\TextInput::make('points_required')
                            ->label('Điểm cần đổi')
                            ->numeric()
                            ->required()
                            ->minValue(0),

                        \Filament\Forms\Components\Select::make('category')
                            ->label('Loại phần thưởng')
                            ->options([
                                'voucher' => 'Voucher',
                                'product' => 'Sản phẩm',
                                'service' => 'Dịch vụ',
                            ])
                            ->default('voucher')
                            ->required(),

                        \Filament\Forms\Components\TextInput::make('badge')
                            ->label('Nhãn hiệu (Badge)')
                            ->maxLength(50)
                            ->helperText('VD: BÁN CHẠY, MỚI, HOT'),

                        \Filament\Forms\Components\TextInput::make('stock')
                            ->label('Số lượng tồn')
                            ->numeric()
                            ->default(-1)
                            ->helperText('-1 = không giới hạn'),

                        \Filament\Forms\Components\Toggle::make('is_visible')
                            ->label('Hiển thị')
                            ->default(true),

                        \Filament\Forms\Components\Toggle::make('out_of_stock')
                            ->label('Hết hàng')
                            ->default(false),
                    ])
                    ->columns(2),

                \Filament\Schemas\Components\Section::make('Hình ảnh')
                    ->schema([
                        \Awcodes\Curator\Components\Forms\CuratorPicker::make('image_id')
                            ->label('Hình ảnh phần thưởng')
                            ->relationship('image', 'id'),
                    ])
                    ->collapsible(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                \Awcodes\Curator\Components\Tables\CuratorColumn::make('image_id')
                    ->label('Hình ảnh')
                    ->size(40),

                \Filament\Tables\Columns\TextColumn::make('name')
                    ->label('Tên')
                    ->searchable()
                    ->sortable(),

                \Filament\Tables\Columns\TextColumn::make('points_required')
                    ->label('Điểm')
                    ->sortable()
                    ->badge()
                    ->color('warning'),

                \Filament\Tables\Columns\TextColumn::make('category')
                    ->label('Loại')
                    ->badge()
                    ->colors([
                        'info' => 'voucher',
                        'success' => 'product',
                        'warning' => 'service',
                    ]),

                \Filament\Tables\Columns\TextColumn::make('stock')
                    ->label('Tồn kho')
                    ->getStateUsing(fn ($record) => $record->stock === -1 ? '∞' : $record->stock),

                \Filament\Tables\Columns\IconColumn::make('is_visible')
                    ->label('Hiển thị')
                    ->boolean(),

                \Filament\Tables\Columns\IconColumn::make('out_of_stock')
                    ->label('Hết hàng')
                    ->boolean(),
            ])
            ->recordActions([
                \Filament\Actions\ActionGroup::make([
                    \Filament\Actions\EditAction::make(),
                    \Filament\Actions\DeleteAction::make(),
                ]),
            ])
            ->groupedBulkActions([
                \Filament\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getApiTransformer()
    {
        return \App\Filament\Resources\Shop\Rewards\Api\Transformers\RewardTransformer::class;
    }

    public static function getNavigationBadge(): ?string
    {
        return (string) static::getModel()::count();
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListRewards::route('/'),
            'create' => CreateReward::route('/create'),
            'edit' => EditReward::route('/{record}/edit'),
        ];
    }
}
