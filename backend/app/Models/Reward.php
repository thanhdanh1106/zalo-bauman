<?php

namespace App\Models;

use Awcodes\Curator\Models\Media;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reward extends Model
{
    protected $table = 'rewards';

    protected $fillable = [
        'name',
        'description',
        'points_required',
        'image_id',
        'category',
        'badge',
        'is_visible',
        'out_of_stock',
        'stock',
    ];

    protected $casts = [
        'is_visible' => 'boolean',
        'out_of_stock' => 'boolean',
    ];

    public function image(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'image_id');
    }

    public function redemptions(): HasMany
    {
        return $this->hasMany(RewardRedemption::class);
    }
}
