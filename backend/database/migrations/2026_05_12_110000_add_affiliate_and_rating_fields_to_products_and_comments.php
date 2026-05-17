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
        Schema::table('products', function (Blueprint $table): void {
            if (!Schema::hasColumn('products', 'rating')) {
                $table->decimal('rating', 3, 2)->default(5.00)->after('sold_count');
            }
            if (!Schema::hasColumn('products', 'affiliate_commission_rate')) {
                $table->decimal('affiliate_commission_rate', 5, 2)->default(10.00)->after('rating');
            }
            if (!Schema::hasColumn('products', 'affiliate_reward_points')) {
                $table->unsignedInteger('affiliate_reward_points')->default(100)->after('affiliate_commission_rate');
            }
        });

        Schema::table('comments', function (Blueprint $table): void {
            if (!Schema::hasColumn('comments', 'rating')) {
                $table->unsignedTinyInteger('rating')->default(5)->after('content');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            if (Schema::hasColumn('products', 'rating')) {
                $table->dropColumn('rating');
            }
            if (Schema::hasColumn('products', 'affiliate_commission_rate')) {
                $table->dropColumn('affiliate_commission_rate');
            }
            if (Schema::hasColumn('products', 'affiliate_reward_points')) {
                $table->dropColumn('affiliate_reward_points');
            }
        });

        Schema::table('comments', function (Blueprint $table): void {
            if (Schema::hasColumn('comments', 'rating')) {
                $table->dropColumn('rating');
            }
        });
    }
};
