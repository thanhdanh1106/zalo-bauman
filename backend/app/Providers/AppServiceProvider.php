<?php

namespace App\Providers;

use App\Models\User;
use App\Observers\UserObserver;
use App\Models\Shop\Order;
use App\Observers\OrderObserver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        if (!defined('CURL_SSLVERSION_TLSv1_2')) {
            define('CURL_SSLVERSION_TLSv1_2', 6);
        }
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        User::observe(UserObserver::class);
        Order::observe(OrderObserver::class);
        Model::unguard();

        if (app()->environment('production')) {
            URL::forceScheme('https');
        }
    }
}
