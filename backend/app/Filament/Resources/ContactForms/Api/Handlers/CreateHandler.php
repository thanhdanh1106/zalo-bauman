<?php

namespace App\Filament\Resources\ContactForms\Api\Handlers;

use App\Filament\Resources\ContactForms\ContactFormResource;
use Rupadana\ApiService\Http\Handlers;
use Illuminate\Http\Request;

class CreateHandler extends Handlers
{
    public static ?string $uri = '/';
    public static ?string $resource = ContactFormResource::class;
    public static string $method = 'post';
    public static bool $public = true;

    public function handler(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
        ]);

        $model = static::getModel();
        $record = $model::create($validated);

        return static::getApiTransformer()::make($record);
    }
}
