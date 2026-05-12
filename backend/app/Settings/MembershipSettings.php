<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class MembershipSettings extends Settings
{
    public string $bronze_label;
    public int $bronze_min_points;

    public string $silver_label;
    public int $silver_min_points;

    public string $gold_label;
    public int $gold_min_points;

    public string $diamond_label;
    public int $diamond_min_points;

    public int $points_earning_rate; // points per 1000 VND
    public int $referral_commission_rate; // percentage
    public int $affiliate_click_points; // Points awarded for each shared link visit
    public int $affiliate_register_points; // Points awarded for successful login/registration via link

    public static function group(): string
    {
        return 'membership';
    }
}
