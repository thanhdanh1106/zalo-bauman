<?php

namespace App\Filament\Resources\Shop\Orders\Api\Handlers;

use App\Filament\Resources\Shop\Orders\OrderResource;
use Rupadana\ApiService\Http\Handlers;
use Illuminate\Http\Request;

class CreateHandler extends Handlers
{
    public static ?string $uri = '/';
    public static ?string $resource = OrderResource::class;
    public static string $method = 'post';
    public static bool $public = true;

    public function handler(Request $request)
    {
        $model = static::getModel();
        $data = $request->all();
        $record = $model::create($data);

        return static::getApiTransformer()::make($record);
    }
}
