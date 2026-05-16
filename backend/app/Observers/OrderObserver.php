<?php

namespace App\Observers;

use App\Models\Shop\Order;

class OrderObserver
{
    public function updated(\App\Models\Shop\Order $order): void
    {
        // 1. Tự động gửi thông báo khi có bất kỳ thay đổi trạng thái nào
        if ($order->wasChanged('status')) {
            $customerUser = \App\Models\User::where('email', $order->customer?->email)->first();
            if ($customerUser) {
                try {
                    $customerUser->notify(new \App\Notifications\OrderStatusNotification($order, $order->status->value));
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error("Notification Error: " . $e->getMessage());
                }
            }
        }

        // 2. Logic cộng điểm khi đơn hàng chuyển sang 'delivered'
        if ($order->status === \App\Enums\OrderStatus::Delivered && 
            $order->wasChanged('status') && 
            !$order->affiliate_points_awarded) {
            
            try {
                app(\App\Http\Controllers\Api\MiniApp\Shop\OrderController::class)->awardOrderPoints($order);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("OrderObserver Award Points Error: " . $e->getMessage());
            }
        }
    }

    /**
     * Handle the Order "created" event.
     */
    public function created(Order $order): void
    {
        //
    }

    /**
     * Handle the Order "deleted" event.
     */
    public function deleted(Order $order): void
    {
        //
    }

    /**
     * Handle the Order "restored" event.
     */
    public function restored(Order $order): void
    {
        //
    }

    /**
     * Handle the Order "force deleted" event.
     */
    public function forceDeleted(Order $order): void
    {
        //
    }
}
