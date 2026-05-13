<?php

use App\Livewire\Form;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('form', Form::class);

Route::redirect('login-redirect', 'login')->name('login');

Route::get('/', function (Request $request) {
    $appId = config('services.zalo.app_id', '347006313594163523');
    $ref = $request->query('ref');

    $zaloUrl = "https://zalo.me/s/{$appId}/";

    if ($ref) {
        $zaloUrl .= "?ref={$ref}";
    }

    return redirect()->away($zaloUrl);
});

Route::get('/clear-server-cache', function () {
    \Illuminate\Support\Facades\Artisan::call('optimize:clear');
    \Illuminate\Support\Facades\Artisan::call('filament:clear-cached-components');
    try {
        \Illuminate\Support\Facades\Artisan::call('settings:clear-cache');
    } catch (\Throwable $e) {}
    
    if (function_exists('opcache_reset')) {
        opcache_reset();
    }
    
    return '<h1>Xóa Cache thành công!</h1><p>Đã làm mới toàn bộ giao diện Filament, Cấu hình và bộ nhớ đệm OPcache trên RAM.</p>';
});
