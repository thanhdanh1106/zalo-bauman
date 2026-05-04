<?php

namespace App\Filament\Resources\Shop\Products\Api\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductTransformer extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'price' => $this->price,
            'old_price' => $this->old_price,
            'sku' => $this->sku,
            'qty' => $this->qty,
            'is_visible' => $this->is_visible,
            'published_at' => $this->published_at,
            'image_url' => $this->image?->url,
            'brand' => $this->brand?->name,
            'categories' => $this->productCategories->pluck('name'),
        ];
    }
}
