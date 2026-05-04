<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum CurrencyCode: string implements HasLabel
{
    case Usd = 'usd';

    case Vnd = 'vnd';

    public function getLabel(): string
    {
        return match ($this) {
            self::Usd => 'Đô la Mỹ (USD)',
            self::Vnd => 'Việt Nam Đồng (VND)',
        };
    }
}
