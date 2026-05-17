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
        Schema::table('orders', function (Blueprint $table): void {
            $table->unsignedBigInteger('promotion_id')->nullable()->after('customer_id');
            $table->unsignedBigInteger('reward_id')->nullable()->after('promotion_id');
            
            $table->foreign('promotion_id')->references('id')->on('promotions')->nullOnDelete();
            $table->foreign('reward_id')->references('id')->on('rewards')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->dropForeign(['promotion_id']);
            $table->dropForeign(['reward_id']);
            $table->dropColumn(['promotion_id', 'reward_id']);
        });
    }
};
