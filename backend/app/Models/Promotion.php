<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Promotion extends Model implements HasMedia
{
    use InteractsWithMedia;
    use HasSlug;

    protected $table = 'promotions';

    protected $fillable = [
        'title',
        'slug',
        'description',
        'body',
        'promotion_code',
        'discount',
        'start_date',
        'end_date',
        'is_featured',
        'is_visible',
        'image_id',
        'user_id',
        'status',
        'views',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_visible' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
        'discount' => 'decimal:2',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    public function image(): BelongsTo
    {
        return $this->belongsTo(\Awcodes\Curator\Models\Media::class, 'image_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function isActive(): bool
    {
        $now = now();
        return $this->is_visible
            && $this->start_date <= $now
            && $this->end_date >= $now;
    }
}
