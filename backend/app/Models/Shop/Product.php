<?php

namespace App\Models\Shop;

use App\Models\Comment;
use Database\Factories\Shop\ProductFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use RalphJSmit\Laravel\SEO\Support\HasSEO;

use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Product extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use HasSEO;

    /**
     * @var string
     */
    protected $table = 'products';

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'featured'         => 'boolean',
        'is_visible'       => 'boolean',
        'backorder'        => 'boolean',
        'requires_shipping'=> 'boolean',
        'published_at'     => 'date',
    ];

    /**
     * Các loại sản phẩm WooCommerce
     */
    const WOO_TYPE_SIMPLE   = 'simple';
    const WOO_TYPE_VARIABLE = 'variable';
    const WOO_TYPE_GROUPED  = 'grouped';
    const WOO_TYPE_VARIATION = 'variation';

    /** @return BelongsTo<Brand, $this> */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    /** @return BelongsToMany<ProductCategory, $this> */
    public function productCategories(): BelongsToMany
    {
        return $this->belongsToMany(ProductCategory::class, 'product_category_product', 'product_id', 'product_category_id')->withTimestamps();
    }

    /** @return MorphMany<Comment, $this> */
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    /** @return HasMany<ProductVariant, $this> */
    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class)->orderBy('position');
    }

    /** @return HasMany<ProductAttribute, $this> */
    public function attributes(): HasMany
    {
        return $this->hasMany(ProductAttribute::class)->orderBy('position');
    }

    /**
     * Sản phẩm con trong nhóm (grouped product)
     *
     * @return BelongsToMany<Product, $this>
     */
    public function groupedChildren(): BelongsToMany
    {
        return $this->belongsToMany(
            Product::class,
            'product_grouped_items',
            'parent_product_id',
            'child_product_id'
        )->withPivot('position')->orderByPivot('position');
    }

    /**
     * Sản phẩm cha chứa sản phẩm này (là con trong grouped)
     *
     * @return BelongsToMany<Product, $this>
     */
    public function groupedParents(): BelongsToMany
    {
        return $this->belongsToMany(
            Product::class,
            'product_grouped_items',
            'child_product_id',
            'parent_product_id'
        );
    }

    /**
     * Biến thể gốc (dành cho variation, trỏ về variable parent)
     *
     * @return BelongsTo<Product, $this>
     */
    public function parentProduct(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'parent_product_id');
    }

    /**
     * Các variation của sản phẩm variable
     *
     * @return HasMany<Product, $this>
     */
    public function variations(): HasMany
    {
        return $this->hasMany(Product::class, 'parent_product_id');
    }



    public function images(): BelongsToMany
    {
        return $this->belongsToMany(\Awcodes\Curator\Models\Media::class, 'product_images', 'product_id', 'file_id')
            ->withPivot('collection')
            ->withTimestamps();
    }

    public function image(): BelongsTo
    {
        return $this->belongsTo(\Awcodes\Curator\Models\Media::class, 'image_id');
    }

    public function registerMediaCollections(): void
    {
        $this
            ->addMediaCollection('product-images')
            ->acceptsMimeTypes(['image/jpeg'])
            ->registerMediaConversions(function (Media $media): void {
                $this
                    ->addMediaConversion('thumb')
                    ->width(40)
                    ->height(40);
            });
    }
}
