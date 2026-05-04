<?php

namespace App\Models\Shop;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductAttribute extends Model
{
    protected $table = 'product_attributes';

    protected $fillable = [
        'product_id',
        'name',
        'slug',
        'is_visible',
        'for_variations',
        'position',
    ];

    protected $casts = [
        'is_visible'      => 'boolean',
        'for_variations'  => 'boolean',
    ];

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return HasMany<ProductAttributeValue, $this> */
    public function values(): HasMany
    {
        return $this->hasMany(ProductAttributeValue::class)->orderBy('position');
    }
}
