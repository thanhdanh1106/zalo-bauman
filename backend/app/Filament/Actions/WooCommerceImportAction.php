<?php

namespace App\Filament\Actions;

use App\Filament\Imports\Shop\WooCommerceProductImporter;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\HtmlString;

class WooCommerceImportAction extends Action
{
    public static function getDefaultName(): ?string
    {
        return 'woocommerce_import';
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this
            ->label('Nhập từ WooCommerce')
            ->icon('heroicon-o-cloud-arrow-up')
            ->color('success')
            ->modalHeading('Nhập sản phẩm từ WooCommerce CSV')
            ->modalDescription(new HtmlString(
                '<p class="text-sm text-gray-500">Xuất file CSV từ WooCommerce: <strong>WooCommerce → Sản phẩm → Xuất</strong>, sau đó tải lên ở đây.</p>'
                . '<p class="text-sm text-gray-500 mt-1">Hỗ trợ: sản phẩm đơn, sản phẩm tùy biến (variable), biến thể (variation) và sản phẩm nhóm (grouped).</p>'
            ))
            ->modalWidth('xl')
            ->modalSubmitActionLabel('Bắt đầu nhập')
            ->schema([
                FileUpload::make('csv_file')
                    ->label('File CSV từ WooCommerce')
                    ->disk('local')
                    ->directory('woo-imports')
                    ->acceptedFileTypes(['text/csv', 'text/plain', 'application/csv', 'application/vnd.ms-excel'])
                    ->maxSize(20480) // 20 MB
                    ->required()
                    ->helperText('Chọn file .csv xuất từ trang quản trị WooCommerce.'),

                Placeholder::make('format_hint')
                    ->label('Hướng dẫn')
                    ->content(new HtmlString(
                        '<div class="text-sm space-y-1">'
                        . '<p>✅ <strong>Sản phẩm đơn</strong> — Type = <code>simple</code></p>'
                        . '<p>✅ <strong>Sản phẩm tùy biến</strong> — Type = <code>variable</code> + <code>variation</code></p>'
                        . '<p>✅ <strong>Sản phẩm nhóm</strong> — Type = <code>grouped</code>, cột "Grouped products"</p>'
                        . '<p>✅ <strong>Thuộc tính</strong> — Attribute 1 name / Attribute 1 value(s) ...</p>'
                        . '<p>✅ <strong>Hình ảnh</strong> — Tự động tải xuống từ URL trong cột "Images"</p>'
                        . '</div>'
                    )),
            ])
            ->action(function (array $data): void {
                $storedPath = $data['csv_file'];

                // FileUpload trả về tên file trong disk local/woo-imports
                $absolutePath = Storage::disk('local')->path($storedPath);

                $importer = new WooCommerceProductImporter();
                $result   = $importer->importFromCsv($absolutePath);

                // Dọn file tạm
                Storage::disk('local')->delete($storedPath);

                $body = "✅ Tạo mới: {$result['created']} | 🔄 Cập nhật: {$result['updated']} | ❌ Lỗi: {$result['failed']}";

                if (! empty($result['errors'])) {
                    $body .= "\n\nChi tiết lỗi:\n" . implode("\n", array_slice($result['errors'], 0, 10));
                }

                if ($result['failed'] === 0) {
                    Notification::make()
                        ->title('Nhập WooCommerce thành công!')
                        ->body($body)
                        ->success()
                        ->persistent()
                        ->send();
                } else {
                    Notification::make()
                        ->title('Nhập WooCommerce hoàn thành (có lỗi)')
                        ->body($body)
                        ->warning()
                        ->persistent()
                        ->send();
                }
            });
    }
}
