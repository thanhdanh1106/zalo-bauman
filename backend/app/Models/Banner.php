<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Banner extends Model
{
    protected $table = 'banners';

    protected $fillable = [
        'title',
        'subtitle',
        'link',
        'image_id',
        'sort_order',
        'is_visible',
    ];

    protected $casts = [
        'is_visible' => 'boolean',
    ];

    public function image(): BelongsTo
    {
        return $this->belongsTo(\Awcodes\Curator\Models\Media::class, 'image_id');
    }
}
