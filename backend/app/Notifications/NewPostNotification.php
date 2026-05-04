<?php

namespace App\Notifications;

use App\Models\Blog\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewPostNotification extends Notification
{
    use Queueable;

    protected $post;

    /**
     * Create a new notification instance.
     */
    public function __construct(Post $post)
    {
        $this->post = $post;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Bài viết mới: ' . $this->post->title,
            'message' => $this->post->excerpt ?? 'Đã có bài viết mới trong mục Cẩm nang sức khỏe. Hãy vào xem ngay nhé!',
            'type' => 'content',
            'post_id' => $this->post->id,
            'post_slug' => $this->post->slug,
            'icon' => 'menu_book',
            'color' => '#D1D5DB'
        ];
    }
}
