<?php

namespace App\Http\Controllers\Api\MiniApp\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $type = $request->query('type'); // all, promotion, order

        $query = $user->notifications();

        if ($type === 'promotion') {
            $query->where('data', 'like', '%"type":"promotion"%');
        } elseif ($type === 'order') {
            $query->where('data', 'like', '%"type":"order"%');
        }

        $notifications = $query->paginate(20);

        return response()->json([
            'error' => false,
            'data' => $notifications,
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json([
            'error' => false,
            'message' => 'Thông báo đã được đánh dấu là đã đọc',
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json([
            'error' => false,
            'message' => 'Tất cả thông báo đã được đánh dấu là đã đọc',
        ]);
    }

    /**
     * Get unread notifications count.
     */
    public function unreadCount(Request $request)
    {
        return response()->json([
            'error' => false,
            'count' => $request->user()->unreadNotifications()->count(),
        ]);
    }
}
