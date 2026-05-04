<?php

namespace App\Filament\Resources\Shop\Orders\Api\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderTransformer extends JsonResource
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
            'number' => $this->number,
            'total_price' => $this->total_price,
            'status' => $this->status,
            'currency' => $this->currency,
            'shipping_price' => $this->shipping_price,
            'customer' => [
                'name' => $this->customer?->name,
                'email' => $this->customer?->email,
            ],
            'items' => $this->items->map(fn($item) => [
                'product_name' => $item->product?->name,
                'qty' => $item->qty,
                'unit_price' => $item->unit_price,
            ]),
            'created_at' => $this->created_at,
        ];
    }
}
