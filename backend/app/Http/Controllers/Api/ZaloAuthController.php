<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Shop\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ZaloAuthController extends Controller
{
    /**
     * Handle Login from Zalo Mini App
     * 
     * @param Request $request [zalo_token, userInfo]
     */
    public function login(Request $request)
    {
        if (!defined('CURL_SSLVERSION_TLSv1_2')) {
            define('CURL_SSLVERSION_TLSv1_2', 6);
        }
        try {
            $zaloToken = $request->input('zalo_token');
            $userInfo = $request->input('userInfo', []);
            
            if (!$zaloToken) {
                return response()->json(['error' => true, 'message' => 'Thiếu Zalo Token'], 400);
            }

            Log::info('Zalo Login Step 1: Token received');

            // 1. Get User ID from Zalo Graph API
            $zaloId = null;
            $name = $userInfo['name'] ?? 'Zalo User';
            
            try {
                $response = Http::timeout(10)->get('https://graph.zalo.me/v2.0/me', [
                    'access_token' => $zaloToken,
                    'fields' => 'id,name,picture'
                ]);
                
                if ($response->successful()) {
                    $zaloData = $response->json();
                    $zaloId = $zaloData['id'] ?? null;
                    $name = !empty($zaloData['name']) ? $zaloData['name'] : $name;
                }
            } catch (\Throwable $e) {
                Log::warning('Zalo Graph API failed (SSL/Network): ' . $e->getMessage());
            }

            // Fallback to userInfo if Graph API fails
            if (!$zaloId) {
                $zaloId = $userInfo['id'] ?? null;
            }

            if (!$zaloId) {
                return response()->json(['error' => true, 'message' => 'Không thể xác định Zalo ID'], 401);
            }

            // 2. Find or Create User
            $user = User::where('zalo_id', $zaloId)->first();
            
            if (!$user) {
                $email = $zaloId . '@zalo.me';
                $user = User::where('email', $email)->first();
            }

            $isNewRegistration = false;
            if (!$user) {
                // Safe referral handling
                $referredBy = $request->input('referred_by') ?? $request->input('ref') ?? $request->cookie('referral');
                if (!is_numeric($referredBy)) {
                    $referredBy = null;
                }

                $user = User::create([
                    'name' => $name,
                    'email' => $zaloId . '@zalo.me',
                    'password' => Hash::make(Str::random(24)),
                    'zalo_id' => $zaloId,
                    'referred_by' => $referredBy,
                    'email_verified_at' => now(),
                ]);
                $isNewRegistration = true;
                Log::info('New User created: ' . $user->id);
            } else {
                $user->update(['name' => $name]);
                // If existing user doesn't have a referrer yet but logs in via a shared link, set it
                $possibleRef = $request->input('referred_by') ?? $request->input('ref') ?? $request->cookie('referral');
                if (is_numeric($possibleRef) && !$user->referred_by && $possibleRef != $user->id) {
                    $user->update(['referred_by' => $possibleRef]);
                    $isNewRegistration = true;
                }
            }

            // Award referral login/registration points if applicable
            if ($isNewRegistration && $user->referred_by) {
                try {
                    $referrerUser = User::find($user->referred_by);
                    if ($referrerUser && $referrerUser->id !== $user->id) {
                        $settings = app(\App\Settings\MembershipSettings::class);
                        $regPoints = $settings->affiliate_register_points ?? 50;
                        if ($regPoints > 0) {
                            $referrerUser->deposit($regPoints, [
                                'title' => 'Thưởng phát triển cộng đồng (Thành viên mới đăng nhập)',
                                'type' => 'affiliate_register',
                                'new_user_id' => $user->id,
                            ]);
                        }
                    }
                } catch (\Throwable $e) {
                    Log::warning('Affiliate registration reward deposit failed: ' . $e->getMessage());
                }
            }

            // 3. Sync with Customer table (optional/non-fatal)
            try {
                Customer::updateOrCreate(
                    ['email' => $user->email],
                    [
                        'name' => $user->name,
                        'phone' => $request->input('phone', ''),
                    ]
                );
            } catch (\Exception $e) {
                Log::warning('Customer sync failed: ' . $e->getMessage());
            }

            // 4. Create Token
            $token = $user->createToken('zalo-mini-app')->plainTextToken;

            return response()->json([
                'error' => false,
                'message' => 'Đăng nhập thành công',
                'li_at' => $token,
                'credentials' => [
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                    'expires_in' => 2592000,
                ],
                'user' => $user
            ]);

        } catch (\Throwable $e) {
            Log::error('FATAL ERROR IN ZALO LOGIN: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'error' => true, 
                'message' => 'Backend Error: ' . $e->getMessage() . ' (Line: ' . $e->getLine() . ' in ' . basename($e->getFile()) . ')',
            ], 500);
        }
    }
}
