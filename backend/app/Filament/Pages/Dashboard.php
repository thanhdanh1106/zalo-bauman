<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\FeaturesOverview;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Widgets\AccountWidget;
use Filament\Widgets\FilamentInfoWidget;

class Dashboard extends BaseDashboard
{
    protected static bool $shouldRegisterNavigation = false;

    protected static ?string $title = 'Welcome';

    protected ?string $heading = 'Welcome to the Filament Demo!';

    public function getWidgets(): array
    {
        return [
            AccountWidget::class,
            FilamentInfoWidget::class,
            FeaturesOverview::class,
        ];
    }
}
