<?php

namespace App\Http\Controllers\Api\MiniApp\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Promotion;
use App\Models\Reward;
use App\Models\RewardRedemption;
use App\Models\User;
use App\Settings\MembershipSettings;
use Awcodes\Curator\Models\Media;

class MemberController extends Controller
{
    public function rewards(Request $request)
    {
        $rewards = Reward::with('image')
            ->where('is_visible', true)
            ->paginate($request->query('per_page', 20));

        $data = collect($rewards->items())->map(function ($reward) {
            $imageUrl = $reward->image?->url;
            if ($imageUrl && !filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                $imageUrl = url($imageUrl);
            }

            return [
                'id' => $reward->id,
                'name' => $reward->name,
                'description' => $reward->description,
                'points' => $reward->points_required,
                'image' => $imageUrl,
                'category' => $reward->category,
                'badge' => $reward->badge,
                'outOfStock' => $reward->out_of_stock,
            ];
        });

        return response()->json([
            'error' => false,
            'data' => $data,
            'meta' => [
                'total' => $rewards->total(),
                'per_page' => $rewards->perPage(),
                'current_page' => $rewards->currentPage(),
                'last_page' => $rewards->lastPage(),
            ],
        ]);
    }

    public function points(Request $request)
    {
        $user = $request->user();
        $settings = app(MembershipSettings::class);
        $balance = $user->balanceInt;

        $tiers = [
            ['label' => $settings->bronze_label, 'min' => $settings->bronze_min_points],
            ['label' => $settings->silver_label, 'min' => $settings->silver_min_points],
            ['label' => $settings->gold_label, 'min' => $settings->gold_min_points],
            ['label' => $settings->diamond_label, 'min' => $settings->diamond_min_points],
        ];

        usort($tiers, fn($a, $b) => $b['min'] <=> $a['min']);

        $currentTier = $tiers[count($tiers) - 1];
        $nextTier = null;

        foreach ($tiers as $index => $tier) {
            if ($balance >= $tier['min']) {
                $currentTier = $tier;
                $nextTier = $tiers[$index - 1] ?? null;
                break;
            }
        }

        return response()->json([
            'error' => false,
            'data' => [
                'balance' => $user->balance,
                'balance_int' => $balance,
                'membership' => [
                    'current_tier' => $currentTier['label'],
                    'next_tier' => $nextTier ? $nextTier['label'] : null,
                    'points_to_next_tier' => $nextTier ? ($nextTier['min'] - $balance) : 0,
                    'next_tier_min_points' => $nextTier ? $nextTier['min'] : null,
                    'progress_percent' => $nextTier 
                        ? min(100, max(0, ($balance - $currentTier['min']) / ($nextTier['min'] - $currentTier['min']) * 100)) 
                        : 100,
                ],
                'affiliate' => [
                    'referral_link' => url('/?ref=' . $user->id),
                    'referral_code' => (string)$user->id,
                    'commission_rate' => $settings->referral_commission_rate,
                ]
            ],
        ]);
    }

    public function pointsHistory(Request $request)
    {
        $user = $request->user();

        $transactions = $user->transactions()
            ->latest()
            ->paginate($request->query('per_page', 20));

        $data = collect($transactions->items())->map(function ($tx) {
            return [
                'id' => $tx->id,
                'type' => $tx->amount >= 0 ? 'earn' : 'spend',
                'title' => $tx->meta['title'] ?? ($tx->type === 'deposit' ? 'Nhận điểm' : 'Tiêu điểm'),
                'points' => (int)$tx->amount,
                'created_at' => $tx->created_at->toISOString(),
                'date' => $tx->created_at->format('d/m/Y'),
                'time' => $tx->created_at->format('H:i'),
            ];
        });

        return response()->json([
            'error' => false,
            'data' => $data,
            'meta' => [
                'total' => $transactions->total(),
                'per_page' => $transactions->perPage(),
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
            ],
        ]);
    }

    public function vouchers(Request $request)
    {
        $user = $request->user();
        $promotions = Promotion::where('user_id', $user->id)
            ->where('is_visible', true)
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', now());
            })
            ->latest()
            ->get();

        return response()->json([
            'error' => false,
            'data' => $promotions,
        ]);
    }

    public function redemptions(Request $request)
    {
        $user = $request->user();
        $redemptions = RewardRedemption::with('reward.image')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        $data = $redemptions->map(function ($r) {
            $imageUrl = $r->reward->image?->url;
            if ($imageUrl && !filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                $imageUrl = url($imageUrl);
            }
            return [
                'id' => $r->id,
                'reward_id' => $r->reward_id,
                'name' => $r->reward->name,
                'description' => $r->reward->description,
                'points' => $r->points_spent,
                'status' => $r->status,
                'image' => $imageUrl,
                'category' => $r->reward->category,
                'redeemed_at' => $r->created_at->toISOString(),
            ];
        });

        return response()->json([
            'error' => false,
            'data' => $data,
        ]);
    }

    public function redeem(Request $request, $rewardId)
    {
        $user = $request->user();
        $reward = Reward::findOrFail($rewardId);

        if ($reward->out_of_stock) {
            return response()->json(['error' => true, 'message' => 'Phần thưởng đã hết hàng'], 400);
        }

        if ($user->balanceInt < $reward->points_required) {
            return response()->json(['error' => true, 'message' => 'Bạn không đủ điểm để đổi phần thưởng này'], 400);
        }

        $user->withdraw($reward->points_required, ['title' => 'Đổi quà: ' . $reward->name]);

        $redemption = RewardRedemption::create([
            'user_id' => $user->id,
            'reward_id' => $reward->id,
            'points_spent' => $reward->points_required,
            'status' => 'completed',
        ]);

        // If it's a voucher category, create a Promotion record
        if ($reward->category === 'voucher') {
            // Extract discount percentage from name or description (heuristic)
            // e.g. "Voucher Giảm 10%" -> 10
            preg_match('/(\d+)\s*%/', $reward->name . ' ' . $reward->description, $matches);
            $discount = $matches[1] ?? 5; // Default 5% if not found

            Promotion::create([
                'title' => $reward->name,
                'description' => $reward->description,
                'promotion_code' => 'REDEEM-' . strtoupper(str_random(8)),
                'discount' => $discount,
                'start_date' => now(),
                'end_date' => now()->addDays(30),
                'is_visible' => true,
                'user_id' => $user->id,
                'status' => 'active',
            ]);
        }

        if ($reward->stock > 0) {
            $reward->decrement('stock');
            if ($reward->stock <= 0) {
                $reward->update(['out_of_stock' => true]);
            }
        }

        return response()->json([
            'error' => false,
            'data' => $redemption,
            'message' => 'Đổi quà thành công!',
        ]);
    }

    public function affiliateQR(Request $request)
    {
        $user = $request->user();
        $link = 'https://zalo.me/s/' . env('ZALO_APP_ID', '347006313594163523') . '/?ref=' . $user->id;
        
        $qrCode = \SimpleSoftwareIO\QrCode\Facades\QrCode::size(300)
            ->format('svg')
            ->generate($link);

        return response()->json([
            'error' => false,
            'data' => [
                'svg' => (string)$qrCode,
                'link' => $link
            ]
        ]);
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        $user = $request->user();
        $file = $request->file('image');

        $path = $file->store('avatars', 'public');

        $media = Media::create([
            'disk' => 'public',
            'directory' => 'avatars',
            'name' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'path' => $path,
            'width' => null,
            'height' => null,
            'size' => $file->getSize(),
            'type' => $file->getMimeType(),
            'ext' => $file->getClientOriginalExtension(),
        ]);

        $user->update(['avatar_id' => $media->id]);

        return response()->json([
            'error' => false,
            'message' => 'Cập nhật ảnh đại diện thành công',
            'data' => [
                'id' => $media->id,
                'url' => $media->url,
            ]
        ]);
    }
}
