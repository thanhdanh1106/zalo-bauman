<x-filament-panels::page>
    <div class="space-y-6">
        <x-filament::section>
            <x-slot name="heading">
                Thông tin thanh toán
            </x-slot>
            <p class="text-sm text-gray-500">
                Lưu ý: Hoa hồng được cộng sau khi đơn hàng ở trạng thái "Hoàn thành". Bạn có thể yêu cầu rút tiền khi số dư đạt mức tối thiểu 50.000 đ.
            </p>
            <div class="mt-4">
                <x-filament::button
                    icon="heroicon-m-banknotes"
                    color="success"
                    disabled
                >
                    Yêu cầu rút tiền (Sắp ra mắt)
                </x-filament::button>
            </div>
        </x-filament::section>
    </div>
</x-filament-panels::page>
