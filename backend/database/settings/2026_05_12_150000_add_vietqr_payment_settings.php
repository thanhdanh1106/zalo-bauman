<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('payment.vietqr_enabled', false);
        $this->migrator->add('payment.vietqr_bank_bin', null);
        $this->migrator->add('payment.vietqr_template', 'compact2');
    }
};
