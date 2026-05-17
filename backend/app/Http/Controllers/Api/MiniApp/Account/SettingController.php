<?php

namespace App\Http\Controllers\Api\MiniApp\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Settings\GeneralSettings;

class SettingController extends Controller
{
    public function show(Request $request, $template)
    {
        $settings = DB::table('settings')
            ->where('group', 'page_' . $template)
            ->pluck('payload', 'name');

        if ($settings->isEmpty()) {
            return response()->json([
                'error' => false,
                'data' => null,
                'message' => 'Chưa có cấu hình cho trang này',
            ]);
        }

        $decoded = $settings->map(function ($value) {
            $decoded = json_decode($value, true);
            return $decoded ?? $value;
        });

        return response()->json([
            'error' => false,
            'data' => $decoded,
        ]);
    }

    public function batch(Request $request)
    {
        $templates = $request->query('templates', []);

        $result = [];
        foreach ($templates as $template) {
            $settings = DB::table('settings')
                ->where('group', 'page_' . $template)
                ->pluck('payload', 'name');

            $decoded = $settings->map(function ($value) {
                $decoded = json_decode($value, true);
                return $decoded ?? $value;
            });

            $result[$template] = $decoded;
        }

        return response()->json([
            'error' => false,
            'data' => $result,
        ]);
    }

    public function general(Request $request)
    {
        $keys = $request->query('settings', []);
        $settings = app(GeneralSettings::class);

        $data = [];
        if (empty($keys)) {
            $keys = array_keys(get_object_vars($settings));
        }

        foreach ($keys as $key) {
            if (property_exists($settings, $key)) {
                $data[$key] = $settings->$key;
            }
        }

        // Handle image URLs
        if (isset($data['logo_id']) && $data['logo_id']) {
            $media = \Awcodes\Curator\Models\Media::find($data['logo_id']);
            if ($media) {
                $url = $media->medium_url ?: $media->url;
                $data['logo_url'] = !filter_var($url, FILTER_VALIDATE_URL) ? url($url) : $url;
            }
        }

        if (isset($data['favicon_id']) && $data['favicon_id']) {
            $media = \Awcodes\Curator\Models\Media::find($data['favicon_id']);
            if ($media) {
                $url = $media->medium_url ?: $media->url;
                $data['favicon_url'] = !filter_var($url, FILTER_VALIDATE_URL) ? url($url) : $url;
            }
        }

        return response()->json([
            'error' => false,
            'data' => $data,
        ]);
    }

    public function payment()
    {
        try {
            $settings = app(\App\Settings\PaymentSettings::class);
            return response()->json([
                'error' => false,
                'data' => [
                    'default_shipping_fee' => $settings->default_shipping_fee ?? 30000,
                    'free_shipping_threshold' => $settings->free_shipping_threshold ?? 500000,
                    'enable_banking' => $settings->enable_banking ?? true,
                    'bank_name' => $settings->bank_name ?? 'Vietcombank',
                    'bank_account_number' => $settings->bank_account_number ?? '1029384756',
                    'bank_account_name' => $settings->bank_account_name ?? 'CÔNG TY TNHH NHÂN SÂM BAUMANN',
                    'bank_transfer_description' => $settings->bank_transfer_description ?? 'Thanh toan don hang {order_number}',
                    'enable_cod' => $settings->enable_cod ?? true,
                    'cod_description' => $settings->cod_description ?? 'Thanh toán tiền mặt khi nhận hàng tại nhà.',
                    'zalopay_app_id' => $settings->zalopay_app_id ?? '2553',
                    'vietqr_enabled' => $settings->vietqr_enabled ?? false,
                    'vietqr_bank_bin' => $settings->vietqr_bank_bin ?? null,
                    'vietqr_template' => $settings->vietqr_template ?? 'compact2',
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => true,
                'message' => 'Không thể tải cấu hình thanh toán',
            ], 500);
        }
    }
}
