<?php

namespace App\Observers;

use App\Models\Shop\Order;

class OrderObserver
{
    public function updated(\App\Models\Shop\Order $order): void
    {
        // If order is completed/delivered (assuming status 'delivered' or similar)
        if ($order->status === 'delivered' && $order->wasChanged('status')) {
            $customerUser = \App\Models\User::where('email', $order->customer?->email)->first();
            
            if ($customerUser && $customerUser->referred_by) {
                $referrer = \App\Models\User::find($customerUser->referred_by);
                if ($referrer) {
                    $commission = $order->total_price * 0.1; // 10% commission
                    $referrer->deposit($commission, ['description' => 'Hoa hồng từ đơn hàng #' . $order->number]);
                }
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
