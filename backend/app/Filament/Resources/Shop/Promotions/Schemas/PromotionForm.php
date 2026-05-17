<?php

namespace App\Filament\Resources\Shop\Promotions\Schemas;

use Filament\Schemas\Components\Group;
use App\Models\Promotion;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;
use Awcodes\Curator\Components\Forms\CuratorPicker;

class PromotionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Group::make()
                    ->schema([
                        Section::make('Thông tin khuyến mãi')
                            ->schema([
                                TextInput::make('title')
                                    ->label('Tiêu đề')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->maxLength(255)
                                    ->afterStateUpdated(fn (string $operation, $state, Set $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null)
                                    ->columnSpanFull(),

                                TextInput::make('slug')
                                    ->label('Đường dẫn (Slug)')
                                    ->disabled()
                                    ->dehydrated()
                                    ->required()
                                    ->maxLength(255)
                                    ->unique(Promotion::class, 'slug', ignoreRecord: true)
                                    ->columnSpanFull(),

                                Textarea::make('description')
                                    ->label('Mô tả ngắn')
                                    ->rows(3)
                                    ->columnSpanFull(),

                                RichEditor::make('body')
                                    ->label('Nội dung chi tiết')
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
                                    ->extraInputAttributes(['style' => 'min-height: 400px;']),
                            ])
                            ->columns(2),
                    ])
                    ->columnSpan(['lg' => 3]),

                Group::make()
                    ->schema([
                        Section::make('Trạng thái & Cấu hình')
                            ->schema([
                                Toggle::make('is_visible')
                                    ->label('Hiển thị')
                                    ->default(true),

                                Toggle::make('is_featured')
                                    ->label('Nổi bật')
                                    ->default(false),

                                TextInput::make('promotion_code')
                                    ->label('Mã khuyến mãi')
                                    ->unique(Promotion::class, 'promotion_code', ignoreRecord: true)
                                    ->maxLength(50)
                                    ->helperText('Mã code để khách hàng áp dụng'),

                                TextInput::make('discount')
                                    ->label('Giảm giá (%)')
                                    ->numeric()
                                    ->minValue(0)
                                    ->maxValue(100)
                                    ->suffix('%')
                                    ->default(0),

                                DatePicker::make('start_date')
                                    ->label('Ngày bắt đầu')
                                    ->default(now())
                                    ->required(),

                                DatePicker::make('end_date')
                                    ->label('Ngày kết thúc')
                                    ->required()
                                    ->afterOrEqual('start_date'),

                                Select::make('status')
                                    ->label('Trạng thái')
                                    ->options([
                                        'active' => 'Hoạt động',
                                        'inactive' => 'Tạm dừng',
                                        'expired' => 'Hết hạn',
                                    ])
                                    ->default('active'),
                            ]),

                        Section::make('Hình ảnh')
                            ->schema([
                                CuratorPicker::make('image_id')
                                    ->label('Ảnh đại diện')
                                    ->relationship('image', 'id'),
                            ])
                            ->collapsible(),
                    ])
                    ->columnSpan(['lg' => 1]),
            ])
            ->columns(4);
    }
}
