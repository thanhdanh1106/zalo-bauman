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
        // Set invalid avatar_ids to null
        \Illuminate\Support\Facades\DB::table('users')
            ->whereNotNull('avatar_id')
            ->whereNotIn('avatar_id', \Illuminate\Support\Facades\DB::table('curator')->pluck('id'))
            ->update(['avatar_id' => null]);

        Schema::table('users', function (Blueprint $table) {
            $table->foreign('avatar_id')->references('id')->on('curator')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['avatar_id']);
            // Optionally restore old one if we knew what it was exactly
        });
    }
};
