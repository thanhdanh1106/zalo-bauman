<?php

namespace App\Http\Controllers\Api;

use Throwable;
use Illuminate\Support\Facades\Storage;
use Awcodes\Curator\Models\Media;
use App\Settings\MembershipSettings;
use Exception;
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
            } catch (Throwable $e) {
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
            $phone = $request->input('phone') ?? $userInfo['phone'] ?? '';
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
                    'phone' => $phone,
                    'referred_by' => $referredBy,
                    'email_verified_at' => now(),
                ]);
                $isNewRegistration = true;
                Log::info('New User created: ' . $user->id);
            } else {
                $user->update([
                    'name' => $name,
                    'phone' => $request->input('phone') ?? $user->phone ?? $phone,
                ]);
                // If existing user doesn't have a referrer yet but logs in via a shared link, set it
                $possibleRef = $request->input('referred_by') ?? $request->input('ref') ?? $request->cookie('referral');
                if (is_numeric($possibleRef) && !$user->referred_by && $possibleRef != $user->id) {
                    $user->update(['referred_by' => $possibleRef]);
                    $isNewRegistration = true;
                }
            }

            // Download Zalo Avatar if provided and user doesn't have an avatar yet
            $avatarId = $user->avatar_id;
            $zaloAvatarUrl = $userInfo['avatar'] ?? null;
            if (!$avatarId && $zaloAvatarUrl) {
                try {
                    $imageContent = Http::timeout(10)->get($zaloAvatarUrl)->body();
                    if ($imageContent) {
                        $extension = 'jpg';
                        $filename = 'zalo_avatar_' . $user->id . '_' . time() . '.' . $extension;
                        $directory = 'avatars';
                        $path = $directory . '/' . $filename;
                        
                        Storage::disk('public')->put($path, $imageContent);
                        
                        $fullPath = Storage::disk('public')->path($path);
                        $size = file_exists($fullPath) ? filesize($fullPath) : strlen($imageContent);
                        
                        $media = Media::create([
                            'disk' => 'public',
                            'directory' => $directory,
                            'name' => 'zalo_avatar_' . $user->id,
                            'path' => $path,
                            'width' => null,
                            'height' => null,
                            'size' => $size,
                            'type' => 'image/jpeg',
                            'ext' => $extension,
                        ]);
                        
                        if ($media) {
                            $user->update(['avatar_id' => $media->id]);
                            $avatarId = $media->id;
                            Log::info('Downloaded and saved Zalo avatar for User: ' . $user->id);
                        }
                    }
                } catch (Throwable $e) {
                    Log::warning('Failed to download and save Zalo avatar: ' . $e->getMessage());
                }
            }

            // Award referral login/registration points if applicable
            if ($isNewRegistration && $user->referred_by) {
                try {
                    $referrerUser = User::find($user->referred_by);
                    if ($referrerUser && $referrerUser->id !== $user->id) {
                        $settings = app(MembershipSettings::class);
                        $regPoints = $settings->affiliate_register_points ?? 50;
                        if ($regPoints > 0) {
                            $referrerUser->deposit($regPoints, [
                                'title' => 'Thưởng phát triển cộng đồng (Thành viên mới đăng nhập)',
                                'type' => 'affiliate_register',
                                'new_user_id' => $user->id,
                            ]);
                        }
                    }
                } catch (Throwable $e) {
                    Log::warning('Affiliate registration reward deposit failed: ' . $e->getMessage());
                }
            }

            // 3. Sync with Customer table (optional/non-fatal)
            try {
                $customerData = [
                    'name' => $user->name,
                    'phone' => $user->phone ?? '',
                    'avatar_id' => $avatarId,
                ];

                if ($zaloAvatarUrl) {
                    $customerData['photo'] = $zaloAvatarUrl;
                }

                Customer::updateOrCreate(
                    ['email' => $user->email],
                    $customerData
                );
            } catch (Exception $e) {
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

        } catch (Throwable $e) {
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

    /**
     * Dev Login: Đăng nhập bằng email/password (chỉ dùng để test)
     * Nên bảo vệ hoặc xóa khi đưa lên production thật sự.
     */
    public function devLogin(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => true, 'message' => 'Email hoặc mật khẩu không đúng'], 401);
        }

        $token = $user->createToken('dev-login')->plainTextToken;

        return response()->json([
            'error'   => false,
            'message' => 'Đăng nhập dev thành công',
            'li_at'   => $token,
            'credentials' => [
                'access_token' => $token,
                'token_type'   => 'Bearer',
                'expires_in'   => 2592000,
            ],
            'user' => $user,
        ]);
    }
}
