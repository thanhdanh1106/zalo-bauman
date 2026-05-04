<?php

namespace App\Filament\Ctv\Pages;

use Filament\Pages\Page;
use App\Models\User;
use BackedEnum;

class MyAffiliate extends Page
{
    protected static ?string $title = 'Tiếp thị liên kết (Affiliate)';

    protected static ?string $navigationLabel = 'Kiếm tiền';

    protected static string | BackedEnum | null $navigationIcon = 'heroicon-o-currency-dollar';

    protected static ?int $navigationSort = 1;

    protected string $view = 'filament.ctv.pages.my-affiliate';

    public function getViewData(): array
    {
        /** @var User $user */
        $user = auth()->user();

        return [
            'referral_link' => url('/app/register?ref=' . $user->id),
        ];
    }
}
