<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MiniApp\Content\BannerController;
use App\Http\Controllers\Api\MiniApp\Shop\ProductController;
use App\Http\Controllers\Api\MiniApp\Shop\OrderController;
use App\Http\Controllers\Api\MiniApp\Content\PostController;
use App\Http\Controllers\Api\MiniApp\Shop\PromotionController;
use App\Http\Controllers\Api\MiniApp\Account\SettingController;
use App\Http\Controllers\Api\MiniApp\Account\MemberController;
use App\Http\Controllers\Api\MiniApp\Account\AddressController;
use App\Http\Controllers\Api\MiniApp\Shop\CartController;
use App\Http\Controllers\Api\MiniApp\Shop\WishlistController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', fn (Request $request) => $request->user()->load('avatar'));
    Route::post('/auth/me', function (Request $request) {
        $user = $request->user();
        $user->update($request->all());
        return $user->load('avatar');
    });

    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\Api\MiniApp\Account\NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [\App\Http\Controllers\Api\MiniApp\Account\NotificationController::class, 'unreadCount']);
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\Api\MiniApp\Account\NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [\App\Http\Controllers\Api\MiniApp\Account\NotificationController::class, 'markAllAsRead']);
});

Route::post('/auth/zalo-login', [\App\Http\Controllers\Api\ZaloAuthController::class, 'login']);
Route::post('/auth/login', [\App\Http\Controllers\Api\ZaloAuthController::class, 'devLogin']); // DEV ONLY

// Zalo Payment Callback (Public)
Route::post('/zalopay/callback', [\App\Http\Controllers\Api\ZaloPaymentController::class, 'callback']);

// Public Content Routes
Route::get('/banners', [BannerController::class, 'index']);
Route::get('/categories', [ProductController::class, 'categories']);
Route::get('/product-brands', [ProductController::class, 'brands']);
Route::get('/post-categories', [PostController::class, 'categories']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/name/{slug}', [ProductController::class, 'showBySlug']);
Route::get('/stations', [OrderController::class, 'stations']);
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);
Route::get('/posts/name/{slug}', [PostController::class, 'showBySlug']);
Route::get('/popups/active', [\App\Http\Controllers\Api\PopupController::class, 'getActive']);

// Public Shop Routes
Route::get('/promotions', [PromotionController::class, 'index']);
Route::get('/promotions/name/{slug}', [PromotionController::class, 'showBySlug']);
Route::post('/promotions/apply/{code}', [PromotionController::class, 'apply']);
Route::get('/orders/number/{number}', [OrderController::class, 'show']);
Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);

// Settings Routes
Route::get('/settings', [SettingController::class, 'general']);
Route::get('/settings/payment', [SettingController::class, 'payment']);
Route::get('/settings/pages/{template}', [SettingController::class, 'show']);
Route::get('/settings/pages', [SettingController::class, 'batch']);

// Public Rewards
Route::get('/rewards', [MemberController::class, 'rewards']);

Route::middleware('auth:sanctum')->group(function () {
    // Account Routes
    Route::prefix('account')->group(function () {
        Route::get('/orders', [OrderController::class, 'index']);
        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/addresses', [AddressController::class, 'index']);
        Route::post('/addresses', [AddressController::class, 'store']);
        Route::get('/points', [MemberController::class, 'points']);
        Route::get('/affiliate', [MemberController::class, 'points']); // Alias
        Route::get('/affiliate/qr', [MemberController::class, 'affiliateQR']);
        Route::get('/wishlist', [WishlistController::class, 'index']);
        Route::post('/wishlist', [WishlistController::class, 'toggle']);
    });

    // Unified Order Management
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::post('/orders/{id}/confirm-payment', [OrderController::class, 'confirmPayment']);
    Route::post('/orders/{id}/mark-delivered', [OrderController::class, 'markDelivered']);
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);

    // Unified Address Management
    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::patch('/addresses/{id}', [AddressController::class, 'update']);
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);

    // Points & Rewards
    Route::get('/points', [MemberController::class, 'points']);
    Route::get('/points/history', [MemberController::class, 'pointsHistory']);
    Route::get('/vouchers', [MemberController::class, 'vouchers']);
    Route::get('/redemptions', [MemberController::class, 'redemptions']);
    Route::post('/rewards/{rewardId}/redeem', [MemberController::class, 'redeem']);

    // Affiliate
    Route::get('/affiliate/qr', [MemberController::class, 'affiliateQR']);

    // Avatar upload
    Route::post('/auth/avatar', [MemberController::class, 'uploadAvatar']);

    // Cart Management
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::patch('/cart', [CartController::class, 'update']);
    Route::delete('/cart', [CartController::class, 'destroy']);
    Route::post('/cart/sync', [CartController::class, 'sync']);

    // Wishlist Management
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist/toggle', [WishlistController::class, 'toggle']);

    // Comments & Reviews Submission
    Route::post('/products/{id}/comments', [ProductController::class, 'storeComment']);
});
