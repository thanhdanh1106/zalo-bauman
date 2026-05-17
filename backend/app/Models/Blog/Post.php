<?php

namespace App\Models\Blog;

use App\Models\User;
use Illuminate\Support\Facades\Notification;
use App\Notifications\NewPostNotification;
use App\Models\Comment;
use Database\Factories\Blog\PostFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use RalphJSmit\Laravel\SEO\Support\HasSEO;

use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Tags\HasTags;

class Post extends Model implements HasMedia
{
    use HasFactory;
    use HasSEO;
    use HasTags;
    use InteractsWithMedia;

    protected static function booted()
    {
        static::created(function ($post): void {
            if ($post->is_visible) {
                $users = User::all();
                Notification::send($users, new NewPostNotification($post));
            }
        });

        static::updated(function ($post): void {
            // If post was just made visible, notify
            if ($post->wasChanged('is_visible') && $post->is_visible) {
                $users = User::all();
                Notification::send($users, new NewPostNotification($post));
            }
        });
    }

    /**
     * @var string
     */
    protected $table = 'posts';

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'is_visible' => 'boolean',
        'published_at' => 'date',
    ];

    /** @return BelongsTo<Author, $this> */
    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class, 'author_id');
    }

    /** @return BelongsTo<PostCategory, $this> */
    public function postCategory(): BelongsTo
    {
        return $this->belongsTo(PostCategory::class, 'post_category_id');
    }

    /** @return MorphMany<Comment, $this> */
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }



    public function image(): BelongsTo
    {
        return $this->belongsTo(\Awcodes\Curator\Models\Media::class, 'image_id');
    }

    public function registerMediaCollections(): void
    {
        $this
            ->addMediaCollection('post-images')
            ->acceptsMimeTypes(['image/jpeg'])
            ->singleFile()
            ->registerMediaConversions(function (Media $media): void {
                $this
                    ->addMediaConversion('thumb')
                    ->width(40)
                    ->height(40);
            });
    }
}
