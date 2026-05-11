<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_variants', function (Blueprint $table): void {
            // Đổi default weight_unit từ 'kg' → 'g' vì shop bán thực phẩm theo gram
            $table->string('weight_unit')->default('g')->change();
        });
    }

    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table): void {
            $table->string('weight_unit')->default('kg')->change();
        });
    }
};
