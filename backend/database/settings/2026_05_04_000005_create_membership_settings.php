<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('membership.bronze_label', 'Đồng');
        $this->migrator->add('membership.bronze_min_points', 0);
        $this->migrator->add('membership.silver_label', 'Bạc');
        $this->migrator->add('membership.silver_min_points', 5000);
        $this->migrator->add('membership.gold_label', 'Vàng');
        $this->migrator->add('membership.gold_min_points', 10000);
        $this->migrator->add('membership.diamond_label', 'Kim Cương');
        $this->migrator->add('membership.diamond_min_points', 20000);
        $this->migrator->add('membership.points_earning_rate', 1);
        $this->migrator->add('membership.referral_commission_rate', 10);
    }
};
