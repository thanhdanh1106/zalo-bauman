<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;
use Filament\Support\Icons\Heroicon;

enum OrderStatus: string implements HasColor, HasIcon, HasLabel
{
    case New = 'new';

    case Processing = 'processing';

    case Shipped = 'shipped';

    case Delivered = 'delivered';

    case Cancelled = 'cancelled';

    public function getLabel(): string
    {
        return match ($this) {
            self::New => 'Mới',
            self::Processing => 'Đang xử lý',
            self::Shipped => 'Đã giao cho ĐVVC',
            self::Delivered => 'Đã giao hàng',
            self::Cancelled => 'Đã hủy',
        };
    }

    public function getColor(): string
    {
        return match ($this) {
            self::New => 'info',
            self::Processing => 'warning',
            self::Shipped, self::Delivered => 'success',
            self::Cancelled => 'danger',
        };
    }

    public function getIcon(): Heroicon
    {
        return match ($this) {
            self::New => Heroicon::Sparkles,
            self::Processing => Heroicon::ArrowPath,
            self::Shipped => Heroicon::Truck,
            self::Delivered => Heroicon::CheckBadge,
            self::Cancelled => Heroicon::XCircle,
        };
    }
}
