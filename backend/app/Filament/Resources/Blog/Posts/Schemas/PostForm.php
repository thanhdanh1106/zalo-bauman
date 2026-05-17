<?php

namespace App\Filament\Resources\Blog\Posts\Schemas;

use Filament\Schemas\Components\Group;
use RalphJSmit\Filament\SEO\SEO;
use App\Models\Blog\Post;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieTagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;
use Awcodes\Curator\Components\Forms\CuratorPicker;

class PostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Group::make()
                    ->schema([
                        Section::make('Nội dung bài viết')
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
                                    ->unique(Post::class, 'slug', ignoreRecord: true)
                                    ->columnSpanFull(),

                                RichEditor::make('content')
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
                                    ->extraInputAttributes(['style' => 'min-height: 700px;']),
                            ])
                            ->columns(2),
                    ])
                    ->columnSpan(['lg' => 3]),

                Group::make()
                    ->schema([
                        Section::make('Trạng thái & Phân loại')
                            ->schema([
                                Toggle::make('is_visible')
                                    ->label('Công khai bài viết')
                                    ->default(true),

                                Select::make('author_id')
                                    ->label('Tác giả')
                                    ->relationship('author', 'name')
                                    ->searchable()
                                    ->default(fn () => auth()->id())
                                    ->helperText('Nếu để trống, người đăng sẽ là người dùng hiện tại.'),

                                Select::make('post_category_id')
                                    ->label('Danh mục')
                                    ->relationship('postCategory', 'name')
                                    ->searchable(),

                                DatePicker::make('published_at')
                                    ->label('Ngày xuất bản')
                                    ->default(now())
                                    ->required(),

                                SpatieTagsInput::make('tags')
                                    ->label('Thẻ (Tags)'),
                            ]),

                        Section::make('Hình ảnh')
                            ->schema([
                                CuratorPicker::make('image_id')
                                    ->label('Ảnh đại diện bài viết')
                                    ->relationship('image', 'id')
                                    
                            ])
                            ->collapsible(),

                        Section::make('SEO')
                            ->schema([
                                SEO::make(),
                            ])
                            ->collapsible(),
                    ])
                    ->columnSpan(['lg' => 1]),
            ])
            ->columns(4);
    }
}
