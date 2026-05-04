<?php

namespace App\Models\Shop;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    protected $table = 'product_variants';

    protected $fillable = [
        'product_id',
        'sku',
        'price',
        'old_price',
        'qty',
        'is_visible',
        'image_url',
        'image_id',
        'weight_value',
        'weight_unit',
        'attributes',
        'position',
    ];

    protected $casts = [
        'is_visible'  => 'boolean',
        'attributes'  => 'array',
        'price'       => 'decimal:2',
        'old_price'   => 'decimal:2',
        'weight_value'=> 'decimal:2',
    ];

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return BelongsTo<\Awcodes\Curator\Models\Media, $this> */
    public function image(): BelongsTo
    {
        return $this->belongsTo(\Awcodes\Curator\Models\Media::class, 'image_id');
    }
}
