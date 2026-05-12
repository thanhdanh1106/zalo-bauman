<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class PaymentSettings extends Settings
{
    // Phí vận chuyển
    public int $default_shipping_fee;
    public int $free_shipping_threshold;

    // Chuyển khoản ngân hàng
    public string $bank_name;
    public string $bank_account_number;
    public string $bank_account_name;

    // ZaloPay Gateway
    public string $zalopay_app_id;
    public string $zalopay_key1;
    public string $zalopay_key2;
    public bool $zalopay_sandbox;

    // COD
    public bool $enable_cod;
    public string $cod_description;

    public static function group(): string
    {
        return 'payment';
    }
}
