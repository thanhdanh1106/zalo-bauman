<x-filament-panels::page>
    <div class="space-y-6">
        <x-filament::section>
            <x-slot name="heading">
                Link giới thiệu của bạn
            </x-slot>
            
            <x-slot name="description">
                Chia sẻ link này để mời thành viên mới và nhận hoa hồng 10% trên mỗi đơn hàng thành công.
            </x-slot>

            <div class="flex items-center gap-4">
                <div class="flex-1">
                    <x-filament::input.wrapper>
                        <x-filament::input
                            type="text"
                            readonly
                            value="{{ $referral_link }}"
                            id="referral-link"
                        />
                    </x-filament::input.wrapper>
                </div>
                
                <x-filament::button
                    icon="heroicon-m-clipboard-document"
                    color="primary"
                    onclick="copyLink()"
                    style="height: 42px;"
                >
                    Sao chép ngay
                </x-filament::button>
            </div>
            
            <div class="mt-6 flex flex-col md:flex-row items-center gap-8 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <div class="bg-white p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    {!! \SimpleSoftwareIO\QrCode\Facades\QrCode::size(120)->generate($referral_link) !!}
                </div>
                <div class="flex-1 space-y-2 text-center md:text-left">
                    <h4 class="font-bold text-gray-900 dark:text-white">Hướng dẫn nhanh</h4>
                    <ul class="text-sm text-gray-500 space-y-1">
                        <li>1. Sao chép link hoặc đưa mã QR cho khách hàng.</li>
                        <li>2. Khách hàng nhấp vào link và hoàn tất mua hàng.</li>
                        <li>3. Hoa hồng được cộng ngay vào ví của bạn khi đơn giao thành công.</li>
                    </ul>
                </div>
            </div>
        </x-filament::section>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
             <x-filament::card class="flex flex-col items-center p-6 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900">
                <div class="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full mb-4">
                    <x-heroicon-o-share class="w-6 h-6 text-primary-600" style="width: 24px; height: 24px;"/>
                </div>
                <h5 class="font-bold">Chia sẻ</h5>
                <p class="text-xs text-center text-gray-500">Gửi link cho khách hàng tiềm năng</p>
             </x-filament::card>

             <x-filament::card class="flex flex-col items-center p-6 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900">
                <div class="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full mb-4">
                    <x-heroicon-o-shopping-cart class="w-6 h-6 text-primary-600" style="width: 24px; height: 24px;"/>
                </div>
                <h5 class="font-bold">Chốt Đơn</h5>
                <p class="text-xs text-center text-gray-500">Khách mua hàng qua link của bạn</p>
             </x-filament::card>

             <x-filament::card class="flex flex-col items-center p-6 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900">
                <div class="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full mb-4">
                    <x-heroicon-o-banknotes class="w-6 h-6 text-primary-600" style="width: 24px; height: 24px;"/>
                </div>
                <h5 class="font-bold">Nhận Tiền</h5>
                <p class="text-xs text-center text-gray-500">Hoa hồng cộng ngay vào ví</p>
             </x-filament::card>
        </div>
    </div>

    <script>
        function copyLink() {
            var input = document.getElementById("referral-link");
            input.select();
            navigator.clipboard.writeText(input.value);
            alert('Đã sao chép link!');
        }
    </script>
</x-filament-panels::page>
