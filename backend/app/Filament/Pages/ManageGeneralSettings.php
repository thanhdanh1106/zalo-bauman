<?php

namespace App\Filament\Pages;

use App\Settings\GeneralSettings;
use BackedEnum;
use Filament\Forms\Components\TextInput;
use Filament\Pages\SettingsPage;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

class ManageGeneralSettings extends SettingsPage
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static ?string $title = 'Cấu hình chung';

    protected static ?string $navigationLabel = 'Cấu hình chung';

    protected static string|UnitEnum|null $navigationGroup = 'Hệ thống';

    protected static string $settings = GeneralSettings::class;

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Schemas\Components\Section::make('Thông tin cơ bản')
                    ->schema([
                        TextInput::make('site_name')
                            ->label('Tên trang web')
                            ->required(),
                        TextInput::make('site_description')
                            ->label('Mô tả trang web'),
                    ])->columns(2),

                \Filament\Schemas\Components\Section::make('Hình ảnh & Thương hiệu')
                    ->schema([
                        \Awcodes\Curator\Components\Forms\CuratorPicker::make('logo_id')
                            ->label('Logo thương hiệu'),
                        \Awcodes\Curator\Components\Forms\CuratorPicker::make('favicon_id')
                            ->label('Favicon (Biểu tượng trình duyệt)'),
                    ])->columns(2),

                \Filament\Schemas\Components\Section::make('Thông tin liên hệ')
                    ->schema([
                        TextInput::make('support_email')
                            ->label('Email hỗ trợ')
                            ->email(),
                        TextInput::make('support_phone')
                            ->label('Số điện thoại hỗ trợ')
                            ->tel(),
                    ])->columns(2),

                \Filament\Schemas\Components\Section::make('Mạng xã hội')
                    ->schema([
                        TextInput::make('facebook_url')
                            ->label('Link Facebook')
                            ->prefix('https://facebook.com/'),
                        TextInput::make('youtube_url')
                            ->label('Link Youtube')
                            ->prefix('https://youtube.com/'),
                        TextInput::make('zalo_url')
                            ->label('Số điện thoại/Link Zalo')
                            ->prefix('zalo.me/'),
                    ])->columns(3),
            ]);
    }
}
