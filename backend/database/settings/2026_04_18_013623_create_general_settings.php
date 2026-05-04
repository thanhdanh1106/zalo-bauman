<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        try {
            $this->migrator->add('general.site_name', 'My Awesome Shop');
            $this->migrator->add('general.site_description', 'Mô tả ngắn về cửa hàng của bạn');
            $this->migrator->add('general.logo_id', null);
            $this->migrator->add('general.favicon_id', null);
            $this->migrator->add('general.support_email', 'admin@example.com');
            $this->migrator->add('general.support_phone', '0123456789');
            $this->migrator->add('general.facebook_url', '');
            $this->migrator->add('general.youtube_url', '');
            $this->migrator->add('general.zalo_url', '');
        } catch (\Exception $e) {
            // Ignore if already exists
        }
    }
};

