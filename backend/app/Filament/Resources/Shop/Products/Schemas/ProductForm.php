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
                                    ->toolbarButtons([
                                        'paragraph',
                                        'h1',
                                        'h2',
                                        'h3',
                                        'h4',
                                        'h5',
                                        'h6',
                                        'bold',
                                        'italic',
                                        'strike',
                                        'underline',
                                        'link',
                                        'bulletList',
                                        'orderedList',
                                        'blockquote',
                                        'codeBlock',
                                        'table',
                                        'undo',
                                        'redo',
                                        'alignStart',
                                        'alignCenter',
                                        'alignEnd',
                                        'alignJustify',
                                    ])
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

                        Section::make('Tiếp thị liên kết (Affiliate)')
                            ->schema([
                                TextInput::make('affiliate_commission_rate')
                                    ->label('Tỉ lệ hoa hồng')
                                    ->numeric()
                                    ->suffix('%')
                                    ->default(10.00)
                                    ->helperText('Hoa hồng chia sẻ cho người tiếp thị.'),

                                TextInput::make('affiliate_reward_points')
                                    ->label('Điểm thưởng giới thiệu')
                                    ->numeric()
                                    ->default(100)
                                    ->helperText('Điểm thưởng cộng cho người chia sẻ link khi đơn thành công.'),
                            ])
                            ->collapsible(),

                        Section::make('Thống kê & Đánh giá')
                            ->schema([
                                TextInput::make('rating')
                                    ->label('Đánh giá (Sao)')
                                    ->numeric()
                                    ->minValue(1)
                                    ->maxValue(5)
                                    ->default(5.00),

                                TextInput::make('sold_count')
                                    ->label('Lượt bán')
                                    ->numeric()
                                    ->default(0),

                                TextInput::make('views')
                                    ->label('Lượt xem')
                                    ->numeric()
                                    ->default(0),
                            ])
                            ->collapsible(),

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
