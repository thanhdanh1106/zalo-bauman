<?php

namespace App\Filament\Pages;

use Filament\Schemas\Components\Section;
use Illuminate\Support\Facades\Http;
use Exception;
use App\Settings\PaymentSettings;
use BackedEnum;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Pages\SettingsPage;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

class ManagePaymentSettings extends SettingsPage
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCreditCard;

    protected static ?string $title = 'Cấu hình Vận chuyển & Thanh toán';

    protected static ?string $navigationLabel = 'Vận chuyển & Thanh toán';

    protected static string|UnitEnum|null $navigationGroup = 'Hệ thống';

    protected static string $settings = PaymentSettings::class;

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Cấu hình Vận chuyển')
                    ->description('Thiết lập biểu phí giao hàng chuẩn và điều kiện tự động miễn phí vận chuyển cho các đơn hàng đạt mốc.')
                    ->icon(Heroicon::OutlinedTruck)
                    ->schema([
                        TextInput::make('default_shipping_fee')
                            ->label('Phí giao hàng mặc định (VND)')
                            ->numeric()
                            ->required()
                            ->helperText('Phí vận chuyển áp dụng cho các đơn hàng chưa đủ điều kiện miễn ship.'),
                        TextInput::make('free_shipping_threshold')
                            ->label('Hạn mức tối thiểu để Miễn phí giao hàng')
                            ->numeric()
                            ->required()
                            ->helperText('Đơn hàng có tổng tiền hàng đạt hoặc vượt ngưỡng này sẽ được hệ thống gán phí ship = 0đ tự động trên giao diện thanh toán.'),
                    ])->columns(1),

                Section::make('Phương thức Thanh toán Tiền mặt (COD)')
                    ->schema([
                        Toggle::make('enable_cod')
                            ->label('Kích hoạt phương thức Thanh toán khi nhận hàng (COD)'),
                        TextInput::make('cod_description')
                            ->label('Mô tả/Hướng dẫn COD')
                            ->required()
                            ->columnSpanFull(),
                    ])->columns(1),

                Section::make('Cấu hình Chuyển khoản Ngân hàng')
                    ->description('Thông tin tài khoản nhận tiền hiển thị tại bước Thanh toán để khách hàng quét mã hoặc sao chép chuyển khoản.')
                    ->schema([
                        Toggle::make('enable_banking')
                            ->label('Kích hoạt phương thức Chuyển khoản ngân hàng (Thủ công)'),
                        TextInput::make('bank_name')
                            ->label('Tên Ngân hàng (Ví dụ: Vietcombank, MB Bank...)')
                            ->required(),
                        TextInput::make('bank_account_number')
                            ->label('Số tài khoản')
                            ->required(),
                        TextInput::make('bank_account_name')
                            ->label('Tên chủ tài khoản')
                            ->required(),
                        TextInput::make('bank_transfer_description')
                            ->label('Nội dung chuyển khoản mẫu')
                            ->required()
                            ->helperText('Sử dụng {order_number} để hệ thống tự điền mã đơn hàng thực tế. Ví dụ: "Thanh toan {order_number}"'),
                    ])->columns(1),

                Section::make('Cấu hình VietQR (Tạo mã QR chuyển khoản)')
                    ->description('Thiết lập thông tin bắt buộc để tạo mã VietQR chính xác theo chuẩn ngân hàng Việt Nam.')
                    ->schema([
                        Toggle::make('vietqr_enabled')
                            ->label('Kích hoạt hiển thị mã VietQR'),
                        Select::make('vietqr_bank_bin')
                            ->label('Chọn Ngân hàng nhận tiền')
                            ->options(function () {
                                try {
                                    $response = Http::get('https://api.vietqr.io/v2/banks');
                                    if ($response->successful()) {
                                        return collect($response->json()['data'])->mapWithKeys(function ($bank) {
                                            return [$bank['bin'] => "{$bank['shortName']} - {$bank['name']}"];
                                        })->toArray();
                                    }
                                } catch (Exception $e) {
                                    return [
                                        '970436' => 'Vietcombank',
                                        '970422' => 'MB Bank',
                                        '970415' => 'VietinBank',
                                        '970418' => 'BIDV',
                                      ];
                                }
                                return [];
                            })
                            ->searchable()
                            ->required()
                            ->helperText('Hệ thống tự động lấy mã BIN chuẩn từ VietQR API dựa trên ngân hàng bạn chọn.'),
                        Select::make('vietqr_template')
                            ->label('Giao diện hiển thị QR')
                            ->options([
                                'compact2' => 'Thu gọn 2 (mặc định)',
                                'compact' => 'Thu gọn',
                                'qr_only' => 'Chỉ hiện QR',
                            ])
                            ->default('compact2'),
                    ])->columns(1),

                Section::make('Cổng thanh toán ZaloPay Gateway (Tự động xác thực)')
                    ->description('Các mã khóa bí mật kết nối với hệ sinh thái ZaloPay Merchant để sinh chữ ký và tự động cập nhật trạng thái đơn hàng.')
                    ->schema([
                        TextInput::make('zalopay_app_id')
                            ->label('ZaloPay App ID')
                            ->required(),
                        Toggle::make('zalopay_sandbox')
                            ->label('Chế độ Thử nghiệm (Sandbox)')
                            ->helperText('Bật tùy chọn này để sử dụng môi trường test của ZaloPay khi đang phát triển.'),
                        TextInput::make('zalopay_key1')
                            ->label('ZaloPay Key 1 (Dùng tạo chữ ký đơn hàng)')
                            ->password()
                            ->revealable()
                            ->required(),
                        TextInput::make('zalopay_key2')
                            ->label('ZaloPay Key 2 (Dùng xác thực dữ liệu Webhook trả về)')
                            ->password()
                            ->revealable()
                            ->required(),
                    ])->columns(2)
                    ->collapsed(),
            ]);
    }
}