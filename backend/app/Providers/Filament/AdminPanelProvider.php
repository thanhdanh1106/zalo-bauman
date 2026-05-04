<?php

namespace App\Providers\Filament;

use App\Filament\Pages\ShopDashboard;

use BezhanSalleh\FilamentShield\FilamentShieldPlugin;
use Awcodes\Curator\CuratorPlugin;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;


class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->id('admin')
            ->default()
            ->login()
            ->spa()
            ->path('admin')
            ->viteTheme('resources/css/filament/admin/theme.css')
            ->colors([
                'primary' => Color::Amber,
            ])
            ->plugins([
                CuratorPlugin::make()
                    ->label('Media')
                    ->pluralLabel('Thư viện ảnh')
                    ->navigationGroup('Thư viện ảnh')
                    ->navigationIcon('heroicon-o-photo')
                    ->navigationSort(1),
                FilamentShieldPlugin::make()
                    ->gridColumns([
                        'default' => 1,
                        'sm' => 2,
                        'lg' => 3,
                    ])
                    ->sectionColumnSpan(1)
                    ->checkboxListColumns([
                        'default' => 1,
                        'sm' => 2,
                        'lg' => 4,
                    ])
                    ->resourceCheckboxListColumns([
                        'default' => 1,
                        'sm' => 2,
                    ]),
                \Rupadana\ApiService\ApiServicePlugin::make(),
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                ShopDashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ])
            ->navigationItems([
                \Filament\Navigation\NavigationItem::make('Bảng điều khiển CTV')
                    ->url('/ctv')
                    ->icon('heroicon-o-presentation-chart-line')
                    ->group('Tiếp thị & Affiliate')
                    ->sort(10),
                \Filament\Navigation\NavigationItem::make('Tài liệu API')
                    ->url('/docs/api')
                    ->icon('heroicon-o-document-text')
                    ->group('Hệ thống')
                    ->sort(100),
            ]);
    }
}