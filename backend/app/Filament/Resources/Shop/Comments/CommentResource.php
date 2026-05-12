<?php

namespace App\Filament\Resources\Shop\Comments;

use App\Filament\Resources\Shop\Comments\Pages\CreateComment;
use App\Filament\Resources\Shop\Comments\Pages\EditComment;
use App\Filament\Resources\Shop\Comments\Pages\ListComments;
use App\Filament\Resources\Shop\Comments\Schemas\CommentForm;
use App\Filament\Resources\Shop\Comments\Tables\CommentsTable;
use App\Models\Comment;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class CommentResource extends Resource
{
    protected static ?string $model = Comment::class;

    protected static ?string $modelLabel = 'Đánh giá & Bình luận';

    protected static ?string $pluralModelLabel = 'Đánh giá & Bình luận';

    protected static ?string $recordTitleAttribute = 'title';

    protected static string | BackedEnum | null $navigationIcon = Heroicon::OutlinedChatBubbleBottomCenterText;

    protected static string | UnitEnum | null $navigationGroup = 'Cửa hàng';

    protected static ?int $navigationSort = 4;

    protected static ?string $slug = 'shop/comments';

    public static function form(Schema $schema): Schema
    {
        return CommentForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CommentsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListComments::route('/'),
            'create' => CreateComment::route('/create'),
            'edit' => EditComment::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return (string) static::getModel()::count();
    }
}
