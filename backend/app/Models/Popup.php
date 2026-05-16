<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Popup extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'title',
        'link',
        'image_id',
        'is_visible',
    ];

    protected $casts = [
        'is_visible' => 'boolean',
    ];

    public function image(): BelongsTo
    {
        return $this->belongsTo(\Awcodes\Curator\Models\Media::class, 'image_id');
    }

    /**
     * Get the URL for the popup image.
     */
    public function getImageUrlAttribute(): ?string
    {
        if ($this->image) {
            return $this->image->url;
        }
        return null;
    }

    protected $appends = ['image_url'];
}
