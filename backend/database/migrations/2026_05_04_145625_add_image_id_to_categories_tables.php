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
        Schema::table('product_categories', function (Blueprint $table) {
            $table->unsignedBigInteger('image_id')->nullable()->after('slug');
            $table->foreign('image_id')->references('id')->on('curator')->nullOnDelete();
        });

        Schema::table('post_categories', function (Blueprint $table) {
            $table->unsignedBigInteger('image_id')->nullable()->after('slug');
            $table->foreign('image_id')->references('id')->on('curator')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_categories', function (Blueprint $table) {
            $table->dropForeign(['image_id']);
            $table->dropColumn('image_id');
        });

        Schema::table('post_categories', function (Blueprint $table) {
            $table->dropForeign(['image_id']);
            $table->dropColumn('image_id');
        });
    }
};
