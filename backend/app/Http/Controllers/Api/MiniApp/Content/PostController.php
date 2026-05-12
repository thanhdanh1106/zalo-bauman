<?php

namespace App\Http\Controllers\Api\MiniApp\Content;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Blog\Post;
use App\Models\Blog\PostCategory;
use App\Filament\Resources\Blog\Posts\Api\Transformers\PostTransformer;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $posts = Post::with(['image', 'postCategory', 'author', 'tags'])
            ->where('is_visible', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->where(function($query) {
                $query->whereDoesntHave('postCategory')
                      ->orWhereHas('postCategory', function ($q) {
                          $q->where('is_visible', true);
                      });
            })
            ->latest()
            ->paginate($request->query('per_page', 12));

        return PostTransformer::collection($posts);
    }

    public function show($id)
    {
        $post = Post::with(['image', 'postCategory', 'author', 'tags'])->find($id);

        if (!$post) {
            return response()->json(['error' => true, 'message' => 'Bài viết không tồn tại'], 404);
        }

        return new PostTransformer($post);
    }

    public function showBySlug($slug)
    {
        $post = Post::with(['image', 'postCategory', 'author', 'tags'])
            ->where('slug', $slug)
            ->first();

        if (!$post) {
            return response()->json(['error' => true, 'message' => 'Bài viết không tồn tại'], 404);
        }

        return new PostTransformer($post);
    }

    public function categories(Request $request)
    {
        $categories = PostCategory::with(['image'])->where('is_visible', true)
            ->paginate($request->query('per_page', 12));

        $data = collect($categories->items())->map(function($cat) {
            $imageUrl = $cat->image?->medium_url ?: $cat->image?->url;
            
            if ($imageUrl && !filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                $imageUrl = url($imageUrl);
            }

            return [
                'id' => $cat->id,
                'name' => $cat->name,
                'slug' => $cat->slug,
                'image' => $imageUrl ?: "https://placehold.co/300x300?text=Category"
            ];
        });

        return response()->json([
            'error' => false,
            'data' => $data,
            'meta' => [
                'total' => $categories->total(),
                'per_page' => $categories->perPage(),
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
            ]
        ]);
    }
}
