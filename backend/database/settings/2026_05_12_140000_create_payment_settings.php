<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('payment.default_shipping_fee', 30000);
        $this->migrator->add('payment.free_shipping_threshold', 500000);

        $this->migrator->add('payment.bank_name', 'Vietcombank');
        $this->migrator->add('payment.bank_account_number', '1029384756');
        $this->migrator->add('payment.bank_account_name', 'CÔNG TY TNHH NHÂN SÂM BAUMANN');

        $this->migrator->add('payment.zalopay_app_id', '2553');
        $this->migrator->add('payment.zalopay_key1', 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL');
        $this->migrator->add('payment.zalopay_key2', 'kLtgPl8HHhfvMuDHPwKfgfsY4XLhjave');
        $this->migrator->add('payment.zalopay_sandbox', true);

        $this->migrator->add('payment.enable_cod', true);
        $this->migrator->add('payment.cod_description', 'Thanh toán tiền mặt khi nhận hàng tại nhà.');
    }
};
