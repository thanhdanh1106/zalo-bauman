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
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'payment_method')) {
                $table->string('payment_method')->default('cod')->after('status');
            }
            if (!Schema::hasColumn('orders', 'payment_status')) {
                $table->string('payment_status')->default('pending')->after('payment_method');
            }
            if (!Schema::hasColumn('orders', 'affiliate_referrer_id')) {
                $table->unsignedBigInteger('affiliate_referrer_id')->nullable()->after('reward_id');
            }
            if (!Schema::hasColumn('orders', 'affiliate_points_awarded')) {
                $table->boolean('affiliate_points_awarded')->default(false)->after('affiliate_referrer_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'payment_method',
                'payment_status',
                'affiliate_referrer_id',
                'affiliate_points_awarded',
            ]);
        });
    }
};
