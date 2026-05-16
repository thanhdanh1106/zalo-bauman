<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Popup;
use Illuminate\Http\JsonResponse;

class PopupController extends Controller
{
    /**
     * Get the latest active popup.
     */
    public function getActive(): JsonResponse
    {
        $popup = Popup::where('is_visible', true)
            ->with('image')
            ->latest()
            ->first();

        if ($popup) {
            $imageUrl = null;
            if ($popup->image) {
                // Ưu tiên dùng medium_url (Glide) để tối ưu
                $imageUrl = $popup->image->medium_url ?: $popup->image->url;
                
                // Lọc sạch đường dẫn để Glide tìm đúng file
                if ($imageUrl && str_contains($imageUrl, '/curator/public/')) {
                    $imageUrl = str_replace('/curator/public/', '/curator/', $imageUrl);
                }

                // Ép về tuyệt đối và HTTPS
                if ($imageUrl && !filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                    $imageUrl = url($imageUrl);
                }
                
                if ($imageUrl && str_starts_with($imageUrl, 'http://') && !str_contains($imageUrl, 'localhost')) {
                    $imageUrl = str_replace('http://', 'https://', $imageUrl);
                }
            }

            $data = [
                'id' => $popup->id,
                'title' => $popup->title,
                'link' => $popup->link,
                'image' => $imageUrl,
                'is_visible' => $popup->is_visible,
            ];

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => null
        ]);
    }
}
