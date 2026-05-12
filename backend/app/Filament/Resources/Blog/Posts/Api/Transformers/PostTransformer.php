<?php

namespace App\Filament\Resources\Blog\Posts\Api\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;

class PostTransformer extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // Get image URL from Curator relationship or Spatie Media Library
        $imageUrl = null;
        if ($this->image) {
            $imageUrl = $this->image->medium_url ?: $this->image->url;
            // Ensure absolute URL if it's a relative path
            if ($imageUrl && !filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                $imageUrl = url($imageUrl);
            }
        } else {
            $imageUrl = $this->getFirstMediaUrl('post-images');
        }

        // Final fallback to a placeholder if still null
        if (!$imageUrl) {
            $imageUrl = url('/images/placeholder-post.png');
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'name' => $this->slug, // Alias for frontend routing
            'content' => $this->content,
            'description' => mb_substr(strip_tags($this->content), 0, 150, 'UTF-8') . '...',
            'published_at' => $this->published_at,
            'image' => $imageUrl,
            'thumbnail' => $imageUrl, // Alias for frontend thumbnail
            'createdAt' => $this->created_at->toISOString(),
            'created_at' => $this->created_at->toISOString(), // Snake case alias
            'category' => $this->postCategory?->name,
            'author' => [
                'name' => $this->author?->name ?? 'Admin',
            ],
            'user' => [
                'information' => [
                    'first_name' => $this->author?->name ?? 'Admin',
                    'last_page' => '',
                ]
            ],
            'tags' => $this->tags->pluck('name'),
        ];
    }
}
