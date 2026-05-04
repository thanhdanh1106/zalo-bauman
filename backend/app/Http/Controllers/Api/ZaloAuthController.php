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
        // In a real production app, you would exchange the zalo_token for user details
        // For now, we use a robust simulation that respects Zalo's data structure
        
        // Simulation of a Zalo ID derived from token
        $zaloId = "zalo_" . substr(md5($zaloToken), 0, 16);
        $name = $userInfo['name'] ?? "Zalo User " . substr($zaloId, -4);
        $avatar = $userInfo['avatar'] ?? null;

        // 2. Find or Create User
        $user = User::where('zalo_id', $zaloId)->first();

        if (!$user) {
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
            // Update user info if changed
            $user->update([
                'name' => $name,
            ]);
            
            $customer = Customer::where('email', $user->email)->first();
            if ($customer) {
                $customer->update(['name' => $name]);
            }
        }

        // Add/Update information relation if exists
        if ($user->information) {
            $user->information->update([
                'first_name' => $name,
                'last_name' => '',
                'phone' => $request->input('phone', $user->information->phone),
            ]);
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
                    'phone' => $request->input('phone', $user->information?->phone ?? ''),
                ]
            ],
            'credentials' => [
                'access_token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => 2592000, // 30 days in seconds
            ]
        ]);
    }
}
