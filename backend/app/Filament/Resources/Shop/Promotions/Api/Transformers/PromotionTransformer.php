<?php

namespace App\Filament\Resources\Shop\Promotions\Api\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;

class PromotionTransformer extends JsonResource
{
    public function toArray($request)
    {
        $imageUrl = null;
        if ($this->image) {
            $imageUrl = $this->image->url;
            if ($imageUrl && !filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                $imageUrl = url($imageUrl);
            }
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'name' => $this->slug,
            'description' => $this->description,
            'body' => $this->body,
            'promotion_code' => $this->promotion_code,
            'discount' => $this->discount,
            'start_date' => $this->start_date?->toISOString(),
            'end_date' => $this->end_date?->toISOString(),
            'is_featured' => $this->is_featured,
            'is_visible' => $this->is_visible,
            'status' => $this->status,
            'views' => $this->views,
            'thumbnail' => $imageUrl ? ['original_url' => $imageUrl] : null,
            'image' => $imageUrl,
            'user_id' => $this->user_id,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
