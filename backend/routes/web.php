<?php

use App\Livewire\Form;
use Illuminate\Support\Facades\Route;

Route::get('form', Form::class);

Route::redirect('login-redirect', 'login')->name('login');

Route::get('/', function (\Illuminate\Http\Request $request) {
    $appId = env('ZALO_APP_ID', '347006313594163523');
    $ref = $request->query('ref');
    
    $zaloUrl = "https://zalo.me/s/{$appId}/";
    
    if ($ref) {
        $zaloUrl .= "?ref={$ref}";
    }
    
    return redirect()->away($zaloUrl);
});