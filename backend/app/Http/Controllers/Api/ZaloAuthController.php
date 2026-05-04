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
                    $name = $zaloData['name'] ?? $name;
                }
            } catch (\Exception $e) {
                Log::warning('Zalo Graph API failed, falling back to userInfo');
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

            if (!$user) {
                // Safe referral handling
                $referredBy = $request->input('referred_by');
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
                Log::info('New User created: ' . $user->id);
            } else {
                $user->update(['name' => $name]);
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

        } catch (\Exception $e) {
            Log::error('FATAL ERROR IN ZALO LOGIN: ' . $e->getMessage());
            return response()->json([
                'error' => true, 
                'message' => 'Lỗi Server: ' . $e->getMessage(),
                'trace' => app()->environment('local') ? $e->getTraceAsString() : null
            ], 500);
        }
    }
}
