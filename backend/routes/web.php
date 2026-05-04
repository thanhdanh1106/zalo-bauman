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
