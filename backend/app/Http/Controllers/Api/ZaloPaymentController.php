<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shop\Order;
use App\Settings\PaymentSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Api\MiniApp\Shop\OrderController;

class ZaloPaymentController extends Controller
{
    /**
     * Xử lý Callback từ ZaloPay
     */
    public function callback(Request $request, PaymentSettings $settings)
    {
        $result = [];
        try {
            $dataStr = $request->input('data');
            $requestMac = $request->input('mac');

            // 1. Tính toán MAC để kiểm tra tính xác thực
            $mac = hash_hmac("sha256", $dataStr, $settings->zalopay_key2);

            if ($requestMac !== $mac) {
                // MAC không khớp -> Dữ liệu không tin cậy
                $result["return_code"] = -1;
                $result["return_message"] = "mac not equal";
            } else {
                // 2. MAC khớp -> Thanh toán thành công từ phía Zalo
                $dataJson = json_decode($dataStr, true);
                
                // Giải mã extradata để lấy thông tin đơn hàng
                $extradata = json_decode($dataJson["embed_data"] ?? $dataJson["item"] ?? "{}", true);
                
                // Zalo Platform thường trả về thông tin trong embed_data hoặc item tùy cấu hình
                $orderId = $extradata['order_id'] ?? null;
                $orderNumber = $extradata['order_number'] ?? null;

                if ($orderId) {
                    $order = Order::find($orderId);
                    if ($order && $order->payment_status !== 'paid') {
                        // Cập nhật trạng thái thanh toán
                        $order->update(['payment_status' => 'paid']);
                        
                        // Cộng điểm thưởng (nếu có logic cộng điểm)
                        try {
                            app(OrderController::class)->awardOrderPoints($order);
                        } catch (\Exception $e) {
                            Log::error("Zalo Callback Award Points Error: " . $e->getMessage());
                        }

                        Log::info("Zalo Payment Success for Order: " . $orderNumber);
                    }
                }

                $result["return_code"] = 1;
                $result["return_message"] = "success";
            }
        } catch (\Exception $e) {
            Log::error("Zalo Callback Exception: " . $e->getMessage());
            $result["return_code"] = 0; // ZaloPay sẽ callback lại sau
            $result["return_message"] = $e->getMessage();
        }

        return response()->json($result);
    }
}
