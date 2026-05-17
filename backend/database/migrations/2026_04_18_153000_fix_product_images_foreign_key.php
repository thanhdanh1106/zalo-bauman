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
        Schema::table('product_images', function (Blueprint $table): void {
            // Drop existing foreign key that points to the wrong table
            $table->dropForeign(['file_id']);
            
            // Add correct foreign key pointing to curator table
            $table->foreign('file_id')
                ->references('id')
                ->on('curator')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_images', function (Blueprint $table): void {
            $table->dropForeign(['file_id']);
            $table->foreign('file_id')
                ->references('id')
                ->on('media_files')
                ->cascadeOnDelete();
        });
    }
};
