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
            'featured' => $this->featured,
            'type' => $this->type,
            'woo_type' => $this->woo_type,
            'published_at' => $this->published_at,
            'image_url' => $this->image?->medium_url ?: $this->image?->url,
            'brand' => $this->brand?->name,
            'categories' => $this->productCategories->pluck('name'),
            'is_sold_by_gram' => $this->is_sold_by_gram,
            'sales_unit' => $this->sales_unit,
            'min_gram' => $this->min_gram,
            'gram_step' => $this->gram_step,
            'gram_options' => $this->gram_options,
            'weight' => [
                'value' => $this->weight_value,
                'unit' => $this->weight_unit,
            ],
            'dimensions' => [
                'height' => $this->height_value,
                'width' => $this->width_value,
                'depth' => $this->depth_value,
                'unit' => $this->height_unit, // assuming same unit for all dimensions
            ],
            'volume' => [
                'value' => $this->volume_value,
                'unit' => $this->volume_unit,
            ],
        ];
    }
}
