<?php

namespace App\Filament\Resources\Banners\Api\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;

class BannerTransformer extends JsonResource
{
    public function toArray($request)
    {
        $imageUrl = null;
        if ($this->image) {
            $imageUrl = \Illuminate\Support\Facades\Storage::disk($this->image->disk)->url($this->image->path);
            if ($imageUrl && !filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                $imageUrl = url($imageUrl);
            }
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
