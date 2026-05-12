<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('membership.affiliate_click_points', 10);
        $this->migrator->add('membership.affiliate_register_points', 50);
    }
};
