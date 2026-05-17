<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('banners', function (Blueprint $table): void {
            $table->dropForeign(['image_id']);
            $table->foreign('image_id')->references('id')->on('curator')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('banners', function (Blueprint $table): void {
            $table->dropForeign(['image_id']);
            $table->foreign('image_id')->references('id')->on('media')->nullOnDelete();
        });
    }
};
