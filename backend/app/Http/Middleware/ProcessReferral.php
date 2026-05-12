<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProcessReferral
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->has('ref')) {
            $ref = $request->query('ref');
            $response = $next($request);
            
            // Check if we haven't already awarded click points for this referral ID from this browser/visitor
            if (!$request->hasCookie('referral_clicked_' . $ref)) {
                try {
                    $referrer = \App\Models\User::find($ref);
                    if ($referrer) {
                        $settings = app(\App\Settings\MembershipSettings::class);
                        $clickPoints = $settings->affiliate_click_points ?? 10;
                        if ($clickPoints > 0) {
                            $referrer->deposit($clickPoints, [
                                'title' => 'Thưởng lượt truy cập link tiếp thị từ khách hàng',
                                'type' => 'affiliate_click',
                                'ip' => $request->ip(),
                            ]);
                        }
                    }
                } catch (\Throwable $e) {
                    // Ignore DB/Settings lookup failures gracefully
                }
                // Set cookie for 24 hours to prevent duplicate point increments
                $response->cookie('referral_clicked_' . $ref, '1', 60 * 24);
            }

            return $response->cookie('referral', $ref, 60 * 24 * 30);
        }

        return $next($request);
    }
}
