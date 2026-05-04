<?php

namespace App\Filament\Ctv\Pages;

use Filament\Pages\Page;
use App\Filament\Ctv\Widgets\CtvStats;
use App\Filament\Ctv\Widgets\CtvRecentTransactions;
use BackedEnum;

class MyWallet extends Page
{
    protected static ?string $title = 'Ví của tôi';

    protected static ?string $navigationLabel = 'Ví của tôi';

    protected static string | BackedEnum | null $navigationIcon = 'heroicon-o-wallet';

    protected static ?int $navigationSort = 2;

    protected string $view = 'filament.ctv.pages.my-wallet';

    protected function getHeaderWidgets(): array
    {
        return [
            CtvStats::class,
        ];
    }

    protected function getFooterWidgets(): array
    {
        return [
            CtvRecentTransactions::class,
        ];
    }
}
