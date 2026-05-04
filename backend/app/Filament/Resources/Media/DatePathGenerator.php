<?php

namespace App\Filament\Resources\Media;

use Awcodes\Curator\PathGenerators\DefaultPathGenerator;
use Illuminate\Support\Str;

class DatePathGenerator extends DefaultPathGenerator
{
    public function getPath(?string $path = null): string
    {
        $datePath = now()->format('Y/m');
        
        return ($path) 
            ? Str::finish($path, '/') . $datePath
            : $datePath;
    }
}
