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
            if (!Schema::hasColumn('products', 'views')) {
                $table->unsignedBigInteger('views')->default(0)->after('description');
            }
            if (!Schema::hasColumn('products', 'sold_count')) {
                $table->unsignedBigInteger('sold_count')->default(0)->after('views');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            if (Schema::hasColumn('products', 'views')) {
                $table->dropColumn('views');
            }
            if (Schema::hasColumn('products', 'sold_count')) {
                $table->dropColumn('sold_count');
            }
        });
    }
};
