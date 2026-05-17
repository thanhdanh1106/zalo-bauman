<?php

namespace App\Filament\Pages;

use Filament\Schemas\Components\Section;
use App\Settings\MembershipSettings;
use BackedEnum;
use Filament\Forms\Components\TextInput;
use Filament\Pages\SettingsPage;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

class ManageMembershipSettings extends SettingsPage
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSparkles;

    protected static ?string $title = 'Cấu hình Hạng & Tiếp thị liên kết';

    protected static ?string $navigationLabel = 'Cấu hình Thành viên';

    protected static string|UnitEnum|null $navigationGroup = 'Hệ thống';

    protected static string $settings = MembershipSettings::class;

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Chính sách Tiếp thị liên kết & Chia sẻ Link')
                    ->description('Quản lý định dạng link chia sẻ và cấu hình giải ngân điểm thưởng tự động khi người dùng phát tán link tiếp thị.')
                    ->icon(Heroicon::OutlinedShare)
                    ->schema([
                        TextInput::make('sample_link')
                            ->label('Cấu trúc Link Tiếp thị mẫu (Tham khảo)')
                            ->default(url('/?ref={USER_ID}'))
                            ->disabled()
                            ->dehydrated(false)
                            ->helperText('Đường dẫn minh họa được cấp cho người dùng trong Mini App để đi chia sẻ/mời bạn bè.'),
                        TextInput::make('affiliate_click_points')
                            ->label('Điểm thưởng khi có lượt truy cập (Click link)')
                            ->numeric()
                            ->required()
                            ->helperText('Số điểm cộng ngay cho chủ sở hữu link khi có một người dùng mới bấm/truy cập vào đường dẫn chia sẻ.'),
                        TextInput::make('affiliate_register_points')
                            ->label('Điểm thưởng khi đăng ký/đăng nhập thành công')
                            ->numeric()
                            ->required()
                            ->helperText('Số điểm thưởng lớn giải ngân khi khách được giới thiệu hoàn tất quy trình xác thực/đăng nhập trở thành cấp dưới hợp lệ.'),
                    ])->columns(1),

                Section::make('Cấu hình chung Tích điểm & Hoa hồng')
                    ->schema([
                        TextInput::make('points_earning_rate')
                            ->label('Tỷ lệ tích điểm (Điểm / 1.000 VND)')
                            ->numeric()
                            ->required(),
                        TextInput::make('referral_commission_rate')
                            ->label('Tỷ lệ hoa hồng giới thiệu đơn hàng mặc định (%)')
                            ->numeric()
                            ->minValue(0)
                            ->maxValue(100)
                            ->required(),
                    ])->columns(2),

                Section::make('Hệ thống Hạng Thành viên (Các mốc điểm tối thiểu)')
                    ->schema([
                        TextInput::make('bronze_label')->label('Tên Hạng 1')->required(),
                        TextInput::make('bronze_min_points')->label('Điểm tối thiểu Hạng 1')->numeric()->required(),
                        
                        TextInput::make('silver_label')->label('Tên Hạng 2')->required(),
                        TextInput::make('silver_min_points')->label('Điểm tối thiểu Hạng 2')->numeric()->required(),
                        
                        TextInput::make('gold_label')->label('Tên Hạng 3')->required(),
                        TextInput::make('gold_min_points')->label('Điểm tối thiểu Hạng 3')->numeric()->required(),
                        
                        TextInput::make('diamond_label')->label('Tên Hạng 4')->required(),
                        TextInput::make('diamond_min_points')->label('Điểm tối thiểu Hạng 4')->numeric()->required(),
                    ])->columns(2),
            ]);
    }
}
