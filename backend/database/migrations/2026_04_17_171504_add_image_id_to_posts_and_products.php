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
        Schema::table('posts', function (Blueprint $table): void {
            $table->unsignedBigInteger('image_id')->nullable()->after('post_category_id');
        });

        Schema::table('products', function (Blueprint $table): void {
            $table->unsignedBigInteger('image_id')->nullable()->after('brand_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table): void {
            $table->dropColumn('image_id');
        });

        Schema::table('products', function (Blueprint $table): void {
            $table->dropColumn('image_id');
        });
    }
};
