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
            // Store for 30 days
            return $next($request)->cookie('referral', $ref, 60 * 24 * 30);
        }

        return $next($request);
    }
}
