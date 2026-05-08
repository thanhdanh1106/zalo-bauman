<?php

namespace App\Filament\Resources\Shop\Products\Schemas;

use App\Filament\Resources\Shop\Brands\RelationManagers\ProductsRelationManager;
use App\Models\Shop\Product;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\TagsInput;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;
use Awcodes\Curator\Components\Forms\CuratorPicker;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Group::make()
                    ->schema([
                        Section::make('Thông tin sản phẩm')
                            ->schema([
                                TextInput::make('name')
                                    ->label('Tên sản phẩm')
                                    ->required()
                                    ->maxLength(255)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(function (string $operation, $state, Set $set): void {
                                        if ($operation !== 'create') {
                                            return;
                                        }

                                        $set('slug', Str::slug($state));
                                    })
                                    ->columnSpanFull(),

                                TextInput::make('slug')
                                    ->label('Đường dẫn (Slug)')
                                    ->disabled()
                                    ->dehydrated()
                                    ->required()
                                    ->maxLength(255)
                                    ->unique(Product::class, 'slug', ignoreRecord: true)
                                    ->columnSpanFull(),

                                RichEditor::make('description')
                                    ->label('Mô tả sản phẩm')
                                    ->columnSpan('full')
                                    ->extraInputAttributes(['style' => 'min-height: 500px;']),
                            ])
                            ->columns(2),



                        Section::make('Bộ sưu tập ảnh')
                            ->schema([
                                CuratorPicker::make('images')
                                    ->label('Bộ sưu tập ảnh (Gallery)')
                                    ->relationship('images', 'id')
                                    ->multiple()
                                    ->helperText('Chọn nhiều ảnh từ thư viện cho sản phẩm này'),
                            ])
                            ->collapsible(),

                        Section::make('Giá bán')
                            ->schema([
                                TextInput::make('price')
                                    ->label('Giá hiện tại')
                                    ->numeric()
                                    ->prefix('đ')
                                    ->required(),

                                TextInput::make('old_price')
                                    ->label('Giá cũ (Giá so sánh)')
                                    ->numeric()
                                    ->prefix('đ')
                                    ->required(),

                                TextInput::make('cost')
                                    ->label('Giá vốn')
                                    ->helperText('Khách hàng sẽ không thấy giá này.')
                                    ->numeric()
                                    ->prefix('đ'),
                                   
                            ])
                            ->columns(2),
                        Section::make('Kho hàng')
                            ->schema([
                                TextInput::make('sku')
                                    ->label('Mã sản phẩm (SKU)')
                                    ->unique(Product::class, 'sku', ignoreRecord: true)
                                    ->maxLength(255)
                                    ->required(),

                                TextInput::make('barcode')
                                    ->label('Mã vạch (Barcode)')
                                    ->unique(Product::class, 'barcode', ignoreRecord: true)
                                    ->maxLength(255),

                                TextInput::make('qty')
                                    ->label('Số lượng tồn kho')
                                    ->numeric()
                                    ->required(),

                                TextInput::make('security_stock')
                                    ->label('Mức tồn kho cảnh báo')
                                    ->helperText('Hệ thống sẽ cảnh báo nếu tồn kho thấp hơn mức này.')
                                    ->numeric(),
                            ])
                            ->columns(2),

                        Section::make('Bán theo trọng lượng (Gram)')
                            ->schema([
                                Toggle::make('is_sold_by_gram')
                                    ->label('Bán theo Gram')
                                    ->helperText('Nếu bật, khách hàng có thể chọn mua theo gram.')
                                    ->live(),

                                TextInput::make('sales_unit')
                                    ->label('Đơn vị bán')
                                    ->placeholder('vd: gram, hộp, túi')
                                    ->visible(fn ($get) => $get('is_sold_by_gram')),

                                TextInput::make('min_gram')
                                    ->label('Trọng lượng tối thiểu')
                                    ->numeric()
                                    ->suffix('g')
                                    ->visible(fn ($get) => $get('is_sold_by_gram')),

                                TextInput::make('gram_step')
                                    ->label('Bước nhảy (Increment)')
                                    ->numeric()
                                    ->suffix('g')
                                    ->visible(fn ($get) => $get('is_sold_by_gram')),

                                TagsInput::make('gram_options')
                                    ->label('Các tùy chọn Gram (nếu có)')
                                    ->placeholder('Thêm tùy chọn vd: 100, 200, 500')
                                    ->helperText('Nhấn Enter sau mỗi giá trị.')
                                    ->visible(fn ($get) => $get('is_sold_by_gram'))
                                    ->columnSpanFull(),
                            ])
                            ->columns(2)
                            ->collapsible(),

                        Section::make('Vận chuyển')
                            ->schema([
                                Checkbox::make('backorder')
                                    ->label('Cho phép đổi trả hàng'),

                                Checkbox::make('requires_shipping')
                                    ->label('Yêu cầu vận chuyển'),
                            ])
                            ->columns(2),
                       

                        Section::make('Thông số vật lý')
                            ->schema([
                                TextInput::make('weight_value')
                                    ->label('Trọng lượng')
                                    ->numeric()
                                    ->suffix(fn ($get) => $get('weight_unit') ?? 'kg'),
                                TextInput::make('weight_unit')
                                    ->label('Đơn vị trọng lượng')
                                    ->default('kg'),

                                TextInput::make('height_value')
                                    ->label('Chiều cao')
                                    ->numeric()
                                    ->suffix(fn ($get) => $get('height_unit') ?? 'cm'),
                                TextInput::make('height_unit')
                                    ->label('Đơn vị chiều cao')
                                    ->default('cm'),

                                TextInput::make('width_value')
                                    ->label('Chiều rộng')
                                    ->numeric()
                                    ->suffix(fn ($get) => $get('width_unit') ?? 'cm'),
                                TextInput::make('width_unit')
                                    ->label('Đơn vị chiều rộng')
                                    ->default('cm'),

                                TextInput::make('depth_value')
                                    ->label('Chiều sâu')
                                    ->numeric()
                                    ->suffix(fn ($get) => $get('depth_unit') ?? 'cm'),
                                TextInput::make('depth_unit')
                                    ->label('Đơn vị chiều sâu')
                                    ->default('cm'),

                                TextInput::make('volume_value')
                                    ->label('Thể tích')
                                    ->numeric()
                                    ->suffix(fn ($get) => $get('volume_unit') ?? 'l'),
                                TextInput::make('volume_unit')
                                    ->label('Đơn vị thể tích')
                                    ->default('l'),
                            ])
                            ->columns(2)
                            ->collapsible(),
                            Section::make('Vận chuyển')
                            ->schema([
                                Checkbox::make('backorder')
                                    ->label('Cho phép đổi trả hàng'),

                                Checkbox::make('requires_shipping')
                                    ->label('Yêu cầu vận chuyển'),
                            ])
                            ->columns(2),
                       
                             Section::make('SEO')
                            ->schema([
                                \RalphJSmit\Filament\SEO\SEO::make(),
                                TextInput::make('seo_title')
                                    ->label('SEO Title (Meta)')
                                    ->maxLength(60),
                                TextInput::make('seo_description')
                                    ->label('SEO Description (Meta)')
                                    ->maxLength(160),
                            ])
                            ->collapsible(),
                    ])
                    ->columnSpan(['lg' => 3]),

                Group::make()
                    ->schema([
                        Section::make('Trạng thái')
                            ->schema([
                                Toggle::make('is_visible')
                                    ->label('Hiển thị trên cửa hàng')
                                    ->default(true),

                                DatePicker::make('published_at')
                                    ->label('Ngày đăng')
                                    ->default(now())
                                    ->required(),

                                Toggle::make('featured')
                                    ->label('Sản phẩm nổi bật')
                                    ->default(false),
                            ]),

                        Section::make('Hình ảnh')
                            ->schema([
                                CuratorPicker::make('image_id')
                                    ->label('Ảnh chính')
                                    ->relationship('image', 'id')
                                    ->required(),
                            ])
                            ->collapsible(),

                        Section::make('Phân loại')
                            ->schema([
                                Select::make('woo_type')
                                    ->label('Loại sản phẩm (WooCommerce)')
                                    ->options([
                                        'simple' => 'Sản phẩm đơn (Simple)',
                                        'variable' => 'Sản phẩm tùy biến (Variable)',
                                        'grouped' => 'Sản phẩm nhóm (Grouped)',
                                        'variation' => 'Biến thể (Variation)',
                                    ])
                                    ->default('simple')
                                    ->live(),

                                Select::make('type')
                                    ->label('Kiểu sản phẩm')
                                    ->options([
                                        'deliverable' => 'Giao hàng (Deliverable)',
                                        'downloadable' => 'Tải về (Downloadable)',
                                    ])
                                    ->default('deliverable'),

                                TextInput::make('woo_id')
                                    ->label('WooCommerce ID')
                                    ->disabled()
                                    ->dehydrated(),

                                Select::make('parent_product_id')
                                    ->label('Sản phẩm cha (Parent)')
                                    ->relationship('parentProduct', 'name')
                                    ->searchable()
                                    ->placeholder('Chọn sản phẩm cha nếu đây là biến thể')
                                    ->visible(fn ($get) => $get('woo_type') === 'variation'),

                                Select::make('brand_id')
                                    ->label('Thương hiệu')
                                    ->relationship('brand', 'name')
                                    ->searchable()
                                    ->hiddenOn(ProductsRelationManager::class),

                                Select::make('productCategories')
                                    ->label('Danh mục sản phẩm')
                                    ->relationship('productCategories', 'name')
                                    ->multiple()
                                    ->preload(),
                            ]),
                    ])
                    ->columnSpan(['lg' => 1]),
            ])
            ->columns(4);
    }
}
