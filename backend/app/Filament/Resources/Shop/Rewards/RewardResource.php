<?php

namespace App\Filament\Resources\Shop\Rewards;

use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Awcodes\Curator\Components\Forms\CuratorPicker;
use Awcodes\Curator\Components\Tables\CuratorColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\ActionGroup;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use App\Filament\Resources\Shop\Rewards\Api\Transformers\RewardTransformer;
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
                Group::make()
                    ->schema([
                        Section::make('Thông tin phần thưởng')
                            ->schema([
                                TextInput::make('name')
                                    ->label('Tên phần thưởng')
                                    ->required()
                                    ->maxLength(255),

                                Textarea::make('description')
                                    ->label('Mô tả')
                                    ->rows(3),

                                TextInput::make('points_required')
                                    ->label('Điểm cần đổi')
                                    ->numeric()
                                    ->required()
                                    ->minValue(0),

                                Select::make('category')
                                    ->label('Loại phần thưởng')
                                    ->options([
                                        'voucher' => 'Voucher',
                                        'product' => 'Sản phẩm',
                                        'service' => 'Dịch vụ',
                                    ])
                                    ->default('voucher')
                                    ->required(),

                                TextInput::make('badge')
                                    ->label('Nhãn hiệu (Badge)')
                                    ->maxLength(50)
                                    ->helperText('VD: BÁN CHẠY, MỚI, HOT'),

                                TextInput::make('stock')
                                    ->label('Số lượng tồn')
                                    ->numeric()
                                    ->default(-1)
                                    ->helperText('-1 = không giới hạn'),
                            ])
                            ->columns(2),
                    ])
                    ->columnSpan(['lg' => 3]),

                Group::make()
                    ->schema([
                        Section::make('Trạng thái')
                            ->schema([
                                Toggle::make('is_visible')
                                    ->label('Hiển thị')
                                    ->default(true),

                                Toggle::make('out_of_stock')
                                    ->label('Hết hàng')
                                    ->default(false),
                            ]),

                        Section::make('Hình ảnh')
                            ->schema([
                                CuratorPicker::make('image_id')
                                    ->label('Hình ảnh phần thưởng')
                                    ->relationship('image', 'id'),
                            ])
                            ->collapsible(),
                    ])
                    ->columnSpan(['lg' => 1]),
            ])
            ->columns(4);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                CuratorColumn::make('image_id')
                    ->label('Hình ảnh')
                    ->size(40),

                TextColumn::make('name')
                    ->label('Tên')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('points_required')
                    ->label('Điểm')
                    ->sortable()
                    ->badge()
                    ->color('warning'),

                TextColumn::make('category')
                    ->label('Loại')
                    ->badge()
                    ->colors([
                        'info' => 'voucher',
                        'success' => 'product',
                        'warning' => 'service',
                    ]),

                TextColumn::make('stock')
                    ->label('Tồn kho')
                    ->getStateUsing(fn ($record) => $record->stock === -1 ? '∞' : $record->stock),

                IconColumn::make('is_visible')
                    ->label('Hiển thị')
                    ->boolean(),

                IconColumn::make('out_of_stock')
                    ->label('Hết hàng')
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
            ]);
    }

    public static function getApiTransformer()
    {
        return RewardTransformer::class;
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
