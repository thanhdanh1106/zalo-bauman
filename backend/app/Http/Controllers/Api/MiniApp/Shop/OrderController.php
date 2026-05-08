<?php

namespace App\Http\Controllers\Api\MiniApp\Shop;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Shop\Order;
use App\Models\Shop\Customer;
use App\Models\Shop\OrderAddress;
use App\Models\Shop\OrderItem;
use App\Models\User;
use App\Settings\MembershipSettings;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $customer = Customer::where('email', $user->email)->first();
        
        if (!$customer) {
            return response()->json(['error' => false, 'data' => [], 'meta' => null]);
        }

        $status = $request->query('status');
        $query = $customer->orders()->with(['orderItems.product.image']);

        if ($status) {
            $mappedStatus = match ($status) {
                'pending' => 'new',
                'shipping' => 'shipped',
                'completed' => 'delivered',
                default => $status
            };
            $query->where('status', $mappedStatus);
        }

        $orders = $query->latest()->paginate($request->query('per_page', 12));

        $data = collect($orders->items())->map(function($order) {
            return $this->transformOrder($order);
        });

        return response()->json([
            'error' => false,
            'data' => $data,
            'meta' => [
                'total' => $orders->total(),
                'per_page' => $orders->perPage(),
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $customer = Customer::where('email', $user->email)->first();
        
        if (!$customer) {
             $customer = Customer::create([
                'name' => $request->customer_name ?? $user->name,
                'email' => $user->email,
                'phone' => $request->customer_phone,
            ]);
        } else {
            if (empty($customer->phone) && !empty($request->customer_phone)) {
                $customer->update(['phone' => $request->customer_phone]);
            }
        }

        $totalAmount = $request->total_amount ?? $request->amount;
        $shippingFee = $request->shipping_fee ?? 0;
        $orderNotes = $request->notes ?? $request->desc;
        $items = $request->order_items ?? $request->item ?? [];

        $order = Order::create([
            'customer_id' => $customer->id,
            'number' => 'ORD-' . strtoupper(Str::random(8)),
            'total_price' => $totalAmount,
            'shipping_price' => $shippingFee,
            'shipping_method' => 'standard',
            'status' => 'new',
            'currency' => 'vnd',
            'notes' => $orderNotes,
            'promotion_id' => $request->promotion_id,
            'reward_id' => $request->reward_id,
        ]);

        if ($request->has('shipping_address')) {
            $addr = $request->shipping_address;
            OrderAddress::create([
                'addressable_id' => $order->id,
                'addressable_type' => Order::class,
                'country' => 'vn',
                'city' => $addr['city'] ?? '',
                'state' => $addr['district'] ?? '',
                'street' => ($addr['ward'] ?? '') . ', ' . ($addr['address_line_1'] ?? ''),
                'zip' => $addr['postal_code'] ?? null,
            ]);
        }

        foreach ($items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['id'],
                'qty' => $item['quantity'],
                'unit_price' => $item['price'],
                'selected_option' => $item['selected_option'] ?? null,
            ]);
        }

        $membershipSettings = app(MembershipSettings::class);
        $pointsToAward = floor(($order->total_price / 1000) * $membershipSettings->points_earning_rate);
        
        if ($pointsToAward > 0) {
            $user->deposit($pointsToAward, [
                'title' => 'Tích điểm từ đơn hàng ' . $order->number,
                'order_id' => $order->id,
            ]);
        }

        if ($user->referred_by) {
            $referrer = User::find($user->referred_by);
            if ($referrer) {
                $commissionPoints = floor(($pointsToAward * $membershipSettings->referral_commission_rate) / 100);
                if ($commissionPoints > 0) {
                    $referrer->deposit($commissionPoints, [
                        'title' => 'Hoa hồng từ đơn hàng của ' . ($user->name ?? $user->email),
                        'referral_id' => $user->id,
                        'order_id' => $order->id,
                    ]);
                }
            }
        }

        return response()->json(['error' => false, 'data' => $this->transformOrder($order), 'points_earned' => $pointsToAward]);
    }

    public function show($number)
    {
        $order = Order::with(['customer', 'orderItems.product.image', 'address'])
            ->where('number', $number)
            ->orWhere('id', $number)
            ->first();

        if (!$order) {
            return response()->json(['error' => true, 'message' => 'Đơn hàng không tồn tại'], 404);
        }

        return response()->json(['error' => false, 'data' => $this->transformOrder($order)]);
    }

    public function cancel($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['error' => true, 'message' => 'Đơn hàng không tồn tại'], 404);
        }

        if ($order->status !== 'new' && $order->status !== 'pending') {
            return response()->json(['error' => true, 'message' => 'Đơn hàng này không thể hủy'], 400);
        }

        $order->update(['status' => 'cancelled']);

        return response()->json(['error' => false, 'message' => 'Đã hủy đơn hàng thành công']);
    }

    public function stations()
    {
        return response()->json([
            'error' => false,
            'data' => [
                [
                    "id" => 1,
                    "name" => "Z06 Số 13, Tân Thuận Đông, Quận 7, Hồ Chí Minh",
                    "image" => "https://placehold.co/600x400?text=Station",
                    "address" => "Z06 Số 13, Tân Thuận Đông, Quận 7, Hồ Chí Minh",
                    "location" => [
                        "lat" => 10.773756,
                        "lng" => 106.689247
                    ]
                ]
            ]
        ]);
    }

    private function transformOrder($order)
    {
        return [
            'id' => $order->id,
            'order_number' => $order->number,
            'user_id' => $order->customer_id,
            'customer_name' => optional($order->customer)->name,
            'customer_email' => optional($order->customer)->email,
            'customer_phone' => optional($order->customer)->phone,
            'status' => $order->status,
            'payment_status' => $order->payment_status ?? 'pending',
            'payment_method' => $order->payment_method ?? 'cod',
            'subtotal' => $order->total_price - $order->shipping_price,
            'tax_amount' => 0,
            'shipping_fee' => $order->shipping_price,
            'total_amount' => $order->total_price,
            'total_items' => $order->orderItems->sum('qty'),
            'shipping_address' => $order->address,
            'notes' => $order->notes,
            'order_date' => $order->created_at->toISOString(),
            'created_at' => $order->created_at->toISOString(),
            'order_items' => $order->orderItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->qty,
                    'price' => $item->unit_price,
                    'selected_option' => $item->selected_option,
                    'product' => [
                        'id' => $item->product?->id,
                        'name' => $item->product?->name,
                        'thumbnail' => [
                            'original_url' => ($item->product?->image?->url ?: $item->product?->getFirstMediaUrl('product-images')) ?: url("/images/product-placeholder.png"),
                        ],
                        'sku' => $item->product?->sku,
                    ]
                ];
            }),
        ];
    }
}
