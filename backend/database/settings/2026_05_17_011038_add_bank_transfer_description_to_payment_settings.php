<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('payment.bank_transfer_description', 'Thanh toan don hang {order_number}');
    }
};
