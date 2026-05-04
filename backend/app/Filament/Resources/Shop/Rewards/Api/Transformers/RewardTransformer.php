<?php

namespace App\Filament\Resources\Shop\Rewards\Api\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;

class RewardTransformer extends JsonResource
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
            'name' => $this->name,
            'description' => $this->description,
            'points' => $this->points_required,
            'points_required' => $this->points_required,
            'image' => $imageUrl,
            'category' => $this->category,
            'badge' => $this->badge,
            'is_visible' => $this->is_visible,
            'outOfStock' => $this->out_of_stock,
            'out_of_stock' => $this->out_of_stock,
            'stock' => $this->stock,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
