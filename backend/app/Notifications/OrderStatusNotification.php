<?php

namespace App\Notifications;

use App\Models\Shop\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class OrderStatusNotification extends Notification
{
    use Queueable;

    protected $order;
    protected $status;

    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order, string $status)
    {
        $this->order = $order;
        $this->status = $status;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $statusInfo = $this->getStatusInfo($this->status);

        return [
            'title' => $statusInfo['title'] . ' #' . $this->order->number,
            'message' => $statusInfo['message'],
            'type' => 'order',
            'order_id' => $this->order->id,
            'order_code' => $this->order->number,
            'icon' => $statusInfo['icon'],
            'color' => $statusInfo['color']
        ];
    }

    protected function getStatusInfo(string $status): array
    {
        return match ($status) {
            'paid' => [
                'title' => 'Thanh toán thành công',
                'message' => 'Đơn hàng của bạn đã được xác nhận thanh toán thành công. Chúng tôi sẽ sớm chuẩn bị hàng.',
                'icon' => 'check_circle',
                'color' => '#10B981', // green-500
            ],
            'shipped' => [
                'title' => 'Đơn hàng đang giao',
                'message' => 'Đơn hàng đang trên đường đến với bạn. Vui lòng để ý điện thoại của shipper nhé!',
                'icon' => 'local_shipping',
                'color' => '#3B82F6', // blue-500
            ],
            'delivered' => [
                'title' => 'Giao hàng thành công',
                'message' => 'Đơn hàng đã được giao thành công. Hy vọng bạn hài lòng với sản phẩm của chúng tôi!',
                'icon' => 'verified',
                'color' => '#059669', // green-600
            ],
            'cancelled' => [
                'title' => 'Đơn hàng đã hủy',
                'message' => 'Đơn hàng của bạn đã được hủy bỏ. Hẹn gặp lại bạn ở những lần mua sắm sau.',
                'icon' => 'cancel',
                'color' => '#EF4444', // red-500
            ],
            'processing' => [
                'title' => 'Đang chuẩn bị hàng',
                'message' => 'Shop đang chuẩn bị những sản phẩm tốt nhất để gửi đến bạn.',
                'icon' => 'package_2',
                'color' => '#F59E0B', // amber-500
            ],
            default => [
                'title' => 'Cập nhật đơn hàng',
                'message' => 'Đơn hàng của bạn vừa có cập nhật mới. Nhấn để xem chi tiết.',
                'icon' => 'shopping_bag',
                'color' => '#8F0012',
            ],
        };
    }
}
