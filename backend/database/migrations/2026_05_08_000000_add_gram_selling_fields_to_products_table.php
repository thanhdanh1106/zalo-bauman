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
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_sold_by_gram')->default(false)->after('price');
            $table->string('sales_unit')->nullable()->after('is_sold_by_gram');
            $table->integer('min_gram')->nullable()->after('sales_unit');
            $table->integer('gram_step')->nullable()->after('min_gram');
            $table->json('gram_options')->nullable()->after('gram_step');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['is_sold_by_gram', 'sales_unit', 'min_gram', 'gram_step', 'gram_options']);
        });
    }
};
