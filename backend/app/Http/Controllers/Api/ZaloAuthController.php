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
        $request->validate([
            'zalo_token' => 'required|string',
        ]);

        $zaloToken = $request->zalo_token;
        $userInfo = $request->input('userInfo', []);

        // 1. Verify token with Zalo API
        $zaloId = null;
        $name = null;
        $avatar = null;

        // Support mock tokens for development environments
        if (app()->environment('local') && str_starts_with($zaloToken, 'mock_')) {
            $zaloId = "zalo_" . substr(md5($zaloToken), 0, 16);
            $name = $userInfo['name'] ?? "Zalo Mock User " . substr($zaloId, -4);
            $avatar = $userInfo['avatar'] ?? null;
        } else {
            try {
                // Call Zalo Graph API to get user profile
                Log::info('Attempting Zalo authentication with token: ' . substr($zaloToken, 0, 15) . '...');
                
                $response = Http::get('https://graph.zalo.me/v2.0/me', [
                    'access_token' => $zaloToken,
                    'fields' => 'id,name,picture'
                ]);

                if ($response->successful()) {
                    $zaloData = $response->json();
                    Log::info('Zalo API Response:', $zaloData);
                    
                    if (isset($zaloData['error'])) {
                        Log::error('Zalo API returned error: ' . json_encode($zaloData));
                        return response()->json([
                            'error' => true,
                            'message' => 'Lỗi từ Zalo (Code ' . ($zaloData['error'] ?? '') . '): ' . ($zaloData['message'] ?? 'Không xác định')
                        ], 401);
                    }

                    $zaloId = $zaloData['id'] ?? null;
                    $name = $zaloData['name'] ?? null;
                    $avatar = $zaloData['picture']['data']['url'] ?? ($userInfo['avatar'] ?? null);
                } else {
                    Log::error('Zalo API Request Failed. Status: ' . $response->status() . ' Body: ' . $response->body());
                    return response()->json([
                        'error' => true,
                        'message' => 'Không thể kết nối tới Zalo để xác thực (HTTP ' . $response->status() . ').'
                    ], 401);
                }
            } catch (\Exception $e) {
                Log::error('Zalo Auth Exception: ' . $e->getMessage());
                return response()->json([
                    'error' => true,
                    'message' => 'Lỗi hệ thống khi xác thực Zalo: ' . $e->getMessage()
                ], 500);
            }
        }

        if (!$zaloId) {
            return response()->json([
                'error' => true,
                'message' => 'Không lấy được Zalo ID từ API.'
            ], 401);
        }

        try {
            // 2. Find or Create User
            $user = User::where('zalo_id', $zaloId)->first();

            if (!$user) {
                Log::info('Creating new user for Zalo ID: ' . $zaloId);
                $user = User::create([
                    'name' => $name,
                    'email' => $zaloId . '@zalo.me', 
                    'password' => Hash::make(Str::random(24)),
                    'zalo_id' => $zaloId,
                    'referred_by' => $request->input('referred_by'),
                    'email_verified_at' => now(),
                ]);
                
                // Create corresponding Customer
                Customer::updateOrCreate(
                    ['email' => $user->email],
                    [
                        'name' => $user->name,
                        'phone' => $request->input('phone', ''),
                    ]
                );
            } else {
                Log::info('Existing user found: ' . $user->email);
                // Update user info if changed
                $user->update([
                    'name' => $name,
                ]);
                
                $customer = Customer::where('email', $user->email)->first();
                if ($customer) {
                    $customer->update(['name' => $name]);
                } else {
                    // Create customer if it doesn't exist for existing user
                    Customer::create([
                        'email' => $user->email,
                        'name' => $user->name,
                        'phone' => $request->input('phone', ''),
                    ]);
                }
            }

            // Add/Update information relation if exists
            if (method_exists($user, 'information') || isset($user->information)) {
                if ($user->information) {
                    $user->information->update([
                        'first_name' => $name,
                        'last_name' => '',
                        'phone' => $request->input('phone', $user->information->phone),
                    ]);
                }
            }

            // 3. Create Token
            $token = $user->createToken('zalo-mini-app')->plainTextToken;

            return response()->json([
                'error' => false,
                'message' => 'Đăng nhập thành công',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'zalo_id' => $user->zalo_id,
                    'avatar' => $avatar,
                    'information' => [
                        'first_name' => $name,
                        'phone' => $request->input('phone', (method_exists($user, 'information') ? $user->information?->phone : '') ?? ''),
                    ]
                ],
                'li_at' => $token,
                'credentials' => [
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                    'expires_in' => 2592000, // 30 days
                ]
            ]);
        } catch (\Exception $dbEx) {
            Log::error('Database Error during Zalo Login: ' . $dbEx->getMessage());
            return response()->json([
                'error' => true,
                'message' => 'Lỗi lưu trữ dữ liệu người dùng: ' . $dbEx->getMessage()
            ], 500);
        }
    }
}
