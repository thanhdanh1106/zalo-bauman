<?php

namespace App\Filament\Resources\Shop\Products\RelationManagers;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Tables;
use Filament\Tables\Table;
use Awcodes\Curator\Components\Forms\CuratorPicker;
use Filament\Actions\CreateAction;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;

class VariantsRelationManager extends RelationManager
{
    protected static string $relationship = 'variants';
    
    protected static ?string $title = 'Biến thể theo đơn vị (Variants)';

    protected static ?string $modelLabel = 'Biến thể';

    /** Danh sách đơn vị hỗ trợ — dùng lại ở form và table */
    public const WEIGHT_UNITS = [
        'g'    => 'g (gram)',
        'kg'   => 'kg (kilogram)',
        'ml'   => 'ml (mililit)',
        'l'    => 'l (lít)',
        'hộp'  => 'Hộp',
        'gói'  => 'Gói',
        'chai' => 'Chai',
        'túi'  => 'Túi',
        'viên' => 'Viên',
        'cái'  => 'Cái',
    ];

    public static function canViewForRecord($ownerRecord, $pageClass): bool
    {
        return in_array($ownerRecord->woo_type, ['variable', 'simple']);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                // ── Nhóm 1: Định danh biến thể ────────────────────────────
                Section::make('Thông tin biến thể')
                    ->description('Chọn đơn vị và nhập số lượng để định danh biến thể (vd: 100 g, 500 g, 1 kg, 2 hộp...).')
                    ->icon('heroicon-o-scale')
                    ->schema([
                        // Hàng 1: Đơn vị + Khối lượng (liên quan trực tiếp nhau)
                        Select::make('weight_unit')
                            ->label('Đơn vị')
                            ->options(self::WEIGHT_UNITS)
                            ->default('g')
                            ->required()
                            ->live()
                            ->helperText('Chọn đơn vị cho biến thể này'),

                        TextInput::make('weight_value')
                            ->label('Khối lượng / Số lượng')
                            ->helperText('Nhập số tương ứng với đơn vị đã chọn (vd: 100, 500, 1.5)')
                            ->numeric()
                            ->suffix(fn ($get) => $get('weight_unit') ?: 'g')
                            ->required()
                            ->minValue(0.01)
                            ->step(0.01),

                        // Hàng 2: SKU full-width
                        TextInput::make('sku')
                            ->label('SKU biến thể')
                            ->helperText('Mã định danh riêng — bỏ trống để tự động tạo')
                            ->maxLength(255)
                            ->placeholder('vd: SP001-100G')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                // ── Nhóm 2: Giá bán ────────────────────────────────────────
                Section::make('Giá bán')
                    ->icon('heroicon-o-currency-dollar')
                    ->schema([
                        // Hàng 1: Giá quan trọng nhất (khách nhìn thấy)
                        TextInput::make('price')
                            ->label('Giá gốc (đ)')
                            ->helperText('Giá niêm yết — luôn nhập dù có KM hay không')
                            ->numeric()
                            ->prefix('đ')
                            ->required()
                            ->minValue(0),

                        TextInput::make('sale_price')
                            ->label('Giá khuyến mãi (đ)')
                            ->helperText('Nếu có → đây là giá khách thực trả')
                            ->numeric()
                            ->prefix('đ')
                            ->minValue(0),

                        // Hàng 2: Giá phụ (nội bộ / hiển thị phụ)
                        TextInput::make('old_price')
                            ->label('Giá so sánh / gạch bỏ (đ)')
                            ->helperText('Hiển thị bị gạch ngang bên cạnh — tùy chọn')
                            ->numeric()
                            ->prefix('đ')
                            ->minValue(0),

                        TextInput::make('cost')
                            ->label('Giá vốn / Giá nhập (đ)')
                            ->helperText('Chỉ dùng nội bộ — khách hàng không thấy')
                            ->numeric()
                            ->prefix('đ')
                            ->minValue(0),
                    ])
                    ->columns(2),

                // ── Nhóm 3: Kho hàng & Trạng thái ─────────────────────────
                Section::make('Kho hàng & Trạng thái')
                    ->icon('heroicon-o-archive-box')
                    ->schema([
                        TextInput::make('qty')
                            ->label('Tồn kho')
                            ->numeric()
                            ->default(0)
                            ->minValue(0)
                            ->suffix('sản phẩm'),

                        TextInput::make('position')
                            ->label('Thứ tự hiển thị')
                            ->helperText('Số nhỏ hơn hiển thị trước')
                            ->numeric()
                            ->default(0),

                        Toggle::make('is_visible')
                            ->label('Hiển thị biến thể này')
                            ->helperText('Tắt để ẩn khỏi cửa hàng')
                            ->default(true)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                // ── Nhóm 4: Hình ảnh (thu gọn mặc định) ───────────────────
                Section::make('Hình ảnh biến thể')
                    ->icon('heroicon-o-photo')
                    ->description('Ảnh riêng cho biến thể này — không bắt buộc, sẽ dùng ảnh sản phẩm nếu để trống.')
                    ->schema([
                        CuratorPicker::make('image_id')
                            ->label('Chọn ảnh')
                            ->relationship('image', 'id')
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->collapsed(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('weight_value')
            ->defaultSort('position')
            ->columns([
                Tables\Columns\TextColumn::make('weight_value')
                    ->label('Biến thể')
                    ->formatStateUsing(function ($state, $record) {
                        if (! $state) return '—';
                        $value = rtrim(rtrim(number_format((float) $state, 2, '.', ''), '0'), '.');
                        $unit  = $record->weight_unit ?? 'g';
                        return $value . ' ' . $unit;
                    })
                    ->badge()
                    ->color('info')
                    ->sortable(),

                Tables\Columns\TextColumn::make('weight_unit')
                    ->label('Đơn vị')
                    ->formatStateUsing(fn ($state) => self::WEIGHT_UNITS[$state] ?? $state)
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('sku')
                    ->label('SKU')
                    ->searchable()
                    ->placeholder('—')
                    ->copyable(),

                Tables\Columns\TextColumn::make('price')
                    ->label('Giá gốc')
                    ->money('VND')
                    ->sortable()
                    ->color(fn ($record) => $record->sale_price ? 'gray' : 'success'),

                Tables\Columns\TextColumn::make('sale_price')
                    ->label('Giá KM')
                    ->money('VND')
                    ->placeholder('—')
                    ->color('danger')
                    ->badge()
                    ->sortable(),

                Tables\Columns\TextColumn::make('old_price')
                    ->label('Giá so sánh')
                    ->money('VND')
                    ->placeholder('—')
                    ->color('gray')
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('cost')
                    ->label('Giá vốn')
                    ->money('VND')
                    ->placeholder('—')
                    ->color('warning')
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('qty')
                    ->label('Tồn kho')
                    ->badge()
                    ->color(fn ($state) => match (true) {
                        $state <= 0  => 'danger',
                        $state <= 10 => 'warning',
                        default      => 'success',
                    })
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_visible')
                    ->label('Hiển thị')
                    ->boolean(),

                Tables\Columns\TextColumn::make('position')
                    ->label('Thứ tự')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->reorderable('position')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_visible')
                    ->label('Hiển thị'),
            ])
            ->headerActions([
                CreateAction::make()
                    ->label('Thêm biến thể')
                    ->modalWidth('4xl'),
            ])
            ->actions([
                EditAction::make()
                    ->modalWidth('4xl'),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateIcon('heroicon-o-scale')
            ->emptyStateHeading('Chưa có biến thể nào')
            ->emptyStateDescription('Thêm các biến thể (100g, 500g, 1kg, 2 hộp...) với giá bán và giá vốn tương ứng.');
    }
}
