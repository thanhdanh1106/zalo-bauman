<?php

declare(strict_types=1);

namespace App\Services\Curator;

use Awcodes\Curator\PathGenerators\Contracts\PathGenerator;
use Carbon\Carbon;

class WordPressPathGenerator implements PathGenerator
{
    public function getPath(?string $baseDir = null): string
    {
        $now = Carbon::now();

        return (in_array($baseDir, [null, '', '0'], true) ? '' : $baseDir.'/').sprintf(
            '%s/%s',
            $now->format('Y'),
            $now->format('m')
        );
    }
}
