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
                $url = \Illuminate\Support\Facades\Storage::disk($media->disk)->url($media->path);
                $data['logo_url'] = !filter_var($url, FILTER_VALIDATE_URL) ? url($url) : $url;
            }
        }

        if (isset($data['favicon_id']) && $data['favicon_id']) {
            $media = \Awcodes\Curator\Models\Media::find($data['favicon_id']);
            if ($media) {
                $url = \Illuminate\Support\Facades\Storage::disk($media->disk)->url($media->path);
                $data['favicon_url'] = !filter_var($url, FILTER_VALIDATE_URL) ? url($url) : $url;
            }
        }

        return response()->json([
            'error' => false,
            'data' => $data,
        ]);
    }
}
