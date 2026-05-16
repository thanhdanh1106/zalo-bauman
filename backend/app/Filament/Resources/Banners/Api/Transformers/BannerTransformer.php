<?php

namespace App\Filament\Resources\Banners\Api\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;

class BannerTransformer extends JsonResource
{
    public function toArray($request)
    {
        $imageUrl = null;
        if ($this->image) {
            // Logic y hệt ProductController để đảm bảo đồng bộ
            $imageUrl = $this->image->url ?: $this->image->medium_url;
            
            if ($imageUrl && str_contains($imageUrl, '/curator/public/')) {
                $imageUrl = str_replace('/curator/public/', '/curator/', $imageUrl);
            }

            if ($imageUrl && !filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                $imageUrl = url($imageUrl);
            }
        }

        // Fallback nếu vẫn không có hình
        if (!$imageUrl) {
            $imageUrl = "https://placehold.co/1200x400?text=Banner+" . ($this->id ?? 'No+Image');
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'link' => $this->link,
            'image' => $imageUrl,
            'sort_order' => $this->sort_order,
            'is_visible' => $this->is_visible,
        ];
    }
}
