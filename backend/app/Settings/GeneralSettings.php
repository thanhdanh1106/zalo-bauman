<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class GeneralSettings extends Settings
{
    public string $site_name;
    public ?string $site_description;
    public ?int $logo_id;
    public ?int $favicon_id;
    public ?string $support_email;
    public ?string $support_phone;
    public ?string $facebook_url;
    public ?string $youtube_url;
    public ?string $zalo_url;

    public static function group(): string
    {
        return 'general';
    }
}
