<?php

namespace App\Filament\Resources\Shop\Promotions;

use App\Filament\Resources\Shop\Promotions\Pages\CreatePromotion;
use App\Filament\Resources\Shop\Promotions\Pages\EditPromotion;
use App\Filament\Resources\Shop\Promotions\Pages\ListPromotions;
use App\Filament\Resources\Shop\Promotions\Schemas\PromotionForm;
use App\Filament\Resources\Shop\Promotions\Tables\PromotionsTable;
use App\Models\Promotion;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class PromotionResource extends Resource
{
    protected static ?string $model = Promotion::class;

    protected static ?string $modelLabel = 'Khuyến mãi';

    protected static ?string $pluralModelLabel = 'Khuyến mãi';

    protected static ?string $slug = 'shop/promotions';

    protected static ?string $recordTitleAttribute = 'title';

    protected static string | UnitEnum | null $navigationGroup = 'Cửa hàng';

    protected static string | BackedEnum | null $navigationIcon = Heroicon::OutlinedGift;

    protected static ?int $navigationSort = 5;

    public static function form(Schema $schema): Schema
    {
        return PromotionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PromotionsTable::configure($table);
    }

    public static function getApiTransformer()
    {
        return \App\Filament\Resources\Shop\Promotions\Api\Transformers\PromotionTransformer::class;
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
            'index' => ListPromotions::route('/'),
            'create' => CreatePromotion::route('/create'),
            'edit' => EditPromotion::route('/{record}/edit'),
        ];
    }
}
