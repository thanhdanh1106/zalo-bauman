<?php

namespace App\Http\Controllers\Api\MiniApp\Content;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Filament\Resources\Banners\Api\Transformers\BannerTransformer;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::with('image')
            ->where('is_visible', true)
            ->orderBy('sort_order', 'asc')
            ->get();

        $data = $banners->map(function($banner) {
            $imageUrl = null;
            if ($banner->image) {
                // Ưu tiên dùng medium_url (Glide) để tối ưu dung lượng
                $imageUrl = $banner->image->medium_url ?: $banner->image->url;
                
                // Lọc sạch đường dẫn để Glide tìm đúng file
                if ($imageUrl && str_contains($imageUrl, '/curator/public/')) {
                    $imageUrl = str_replace('/curator/public/', '/curator/', $imageUrl);
                }

                // Ép về tuyệt đối và đảm bảo HTTPS
                if ($imageUrl && !filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                    $imageUrl = url($imageUrl);
                }
                
                // Đảm bảo luôn là https nếu không phải localhost
                if ($imageUrl && str_starts_with($imageUrl, 'http://') && !str_contains($imageUrl, 'localhost')) {
                    $imageUrl = str_replace('http://', 'https://', $imageUrl);
                }
            }

            return [
                'id' => $banner->id,
                'title' => $banner->title,
                'subtitle' => $banner->subtitle,
                'link' => $banner->link,
                'image' => $imageUrl ?: "https://placehold.co/1200x400?text=Banner+" . ($banner->id),
            ];
        });

        return response()->json([
            'error' => false,
            'data' => $data->isEmpty() ? [
                ['image' => "https://placehold.co/1200x400?text=Nhân+Sâm+Baumann+1", 'title' => 'Nhân Sâm Baumann', 'subtitle' => 'Khởi nguồn sức khỏe', 'link' => null],
                ['image' => "https://placehold.co/1200x400?text=Nhân+Sâm+Baumann+2", 'title' => 'Nhân Sâm Baumann', 'subtitle' => 'Khởi nguồn sức khỏe', 'link' => null]
            ] : $data
        ]);
    }
}
