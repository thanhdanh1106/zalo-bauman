<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class NotificationSeeder extends Seeder
{
    public function run()
    {
        $user = User::first();
        if (!$user) return;

        $notifications = [
            [
                'id' => Str::uuid(),
                'type' => 'App\Notifications\OrderNotification',
                'notifiable_type' => 'App\Models\User',
                'notifiable_id' => $user->id,
                'data' => json_encode([
                    'title' => 'Giao hàng thành công',
                    'message' => 'Đơn hàng #GINSENG2903 của bạn đã được giao thành công. Hãy đánh giá ngay nhé!',
                    'type' => 'order',
                    'icon' => 'shopping_bag',
                    'color' => '#FBBF24'
                ]),
                'read_at' => null,
                'created_at' => now()->subHours(2),
            ],
            [
                'id' => Str::uuid(),
                'type' => 'App\Notifications\PromotionNotification',
                'notifiable_type' => 'App\Models\User',
                'notifiable_id' => $user->id,
                'data' => json_encode([
                    'title' => 'Quà tặng đặc quyền tháng 10',
                    'message' => 'Tặng ngay 01 hộp Trà Sâm Linh Chi khi mua hóa đơn từ 2.000.000đ. Số lượng có hạn!',
                    'type' => 'promotion',
                    'icon' => 'campaign',
                    'color' => '#FCA5A5'
                ]),
                'read_at' => null,
                'created_at' => now()->subHours(5),
            ],
            [
                'id' => Str::uuid(),
                'type' => 'App\Notifications\ContentNotification',
                'notifiable_type' => 'App\Models\User',
                'notifiable_id' => $user->id,
                'data' => json_encode([
                    'title' => 'Bí quyết trẻ hóa cùng Nhân sâm',
                    'message' => 'Cùng chuyên gia tìm hiểu 5 cách sử dụng nhân sâm hiệu quả nhất để tăng cường sức khỏe.',
                    'type' => 'content',
                    'icon' => 'menu_book',
                    'color' => '#D1D5DB'
                ]),
                'read_at' => now()->subDay(),
                'created_at' => now()->subDay(),
            ],
            [
                'id' => Str::uuid(),
                'type' => 'App\Notifications\OrderNotification',
                'notifiable_type' => 'App\Models\User',
                'notifiable_id' => $user->id,
                'data' => json_encode([
                    'title' => 'Đang chuẩn bị hàng',
                    'message' => 'Kiện hàng chứa Nước Hồng Sâm 6 năm tuổi của bạn đang được đóng gói và chuẩn bị bàn giao.',
                    'type' => 'order',
                    'icon' => 'inventory_2',
                    'color' => '#FBBF24'
                ]),
                'read_at' => now()->subDays(2),
                'created_at' => now()->subDays(2),
            ],
            [
                'id' => Str::uuid(),
                'type' => 'App\Notifications\WelcomeNotification',
                'notifiable_type' => 'App\Models\User',
                'notifiable_id' => $user->id,
                'data' => json_encode([
                    'title' => 'Chào mừng Thành viên mới',
                    'message' => 'Nhận ngay voucher giảm 10% cho đơn hàng đầu tiên. Mã: WELCOME10',
                    'type' => 'promotion',
                    'icon' => 'card_giftcard',
                    'color' => '#FCA5A5'
                ]),
                'read_at' => null,
                'created_at' => now()->subDays(3),
            ],
        ];

        foreach ($notifications as $notification) {
            DB::table('notifications')->insert($notification);
        }
    }
}
