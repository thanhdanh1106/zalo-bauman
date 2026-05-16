<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Popup;
use Illuminate\Http\JsonResponse;

class PopupController extends Controller
{
    /**
     * Get the latest active popup.
     */
    public function getActive(): JsonResponse
    {
        $popup = Popup::where('is_visible', true)
            ->with('image')
            ->latest()
            ->first();

        return response()->json([
            'success' => true,
            'data' => $popup
        ]);
    }
}
