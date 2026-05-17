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
        Schema::table('addresses', function (Blueprint $table): void {
            $table->string('name')->nullable()->after('id');
            $table->string('phone')->nullable()->after('name');
            $table->string('type')->nullable()->default('home')->after('zip');
            $table->boolean('is_default')->default(false)->after('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('addresses', function (Blueprint $table): void {
            $table->dropColumn(['name', 'phone', 'type', 'is_default']);
        });
    }
};
