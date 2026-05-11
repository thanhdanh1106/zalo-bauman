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
        'gram_weight',   // legacy — giữ lại để tương thích
        'price',
        'old_price',
        'sale_price',
        'cost',
        'qty',
        'is_visible',
        'image_url',
        'image_id',
        'weight_value',  // số trọng lượng / số lượng (vd: 100, 500, 1.5)
        'weight_unit',   // đơn vị (vd: g, kg, hộp, gói, chai...)
        'attributes',
        'position',
    ];

    /** Default weight_unit là gram cho shop thực phẩm */
    protected $attributes = [
        'weight_unit' => 'g',
    ];

    protected $casts = [
        'is_visible'   => 'boolean',
        'attributes'   => 'array',
        'gram_weight'  => 'decimal:2',
        'price'        => 'decimal:2',
        'old_price'    => 'decimal:2',
        'sale_price'   => 'decimal:2',
        'cost'         => 'decimal:2',
        'weight_value' => 'decimal:2',
    ];

    /**
     * Nhãn hiển thị thân thiện: "500 g", "1.5 kg", "2 hộp"...
     * Dùng ở frontend / API response thay vì format thủ công.
     */
    public function getDisplayLabelAttribute(): string
    {
        if (! $this->weight_value) {
            return $this->sku ?? 'Biến thể';
        }

        $value = rtrim(rtrim(number_format((float) $this->weight_value, 2, '.', ''), '0'), '.');

        return $value . ' ' . ($this->weight_unit ?? 'g');
    }

    /**
     * Giá hiệu lực: sale_price nếu có, ngược lại là price.
     */
    public function getEffectivePriceAttribute(): ?string
    {
        return $this->sale_price ?? $this->price;
    }

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
