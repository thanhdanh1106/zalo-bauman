<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_variants', function (Blueprint $table): void {
            // Trọng lượng tính theo gram (dùng cho biến thể theo gram: 100g, 200g, 500g...)
            if (! Schema::hasColumn('product_variants', 'gram_weight')) {
                $table->decimal('gram_weight', 10, 2)->nullable()->after('sku')
                    ->comment('Trọng lượng biến thể tính bằng gram (vd: 100, 200, 500)');
            }

            // Giá nhập (cost/purchase price) cho biến thể
            if (! Schema::hasColumn('product_variants', 'cost')) {
                $table->decimal('cost', 10, 2)->nullable()->after('old_price')
                    ->comment('Giá nhập / giá vốn của biến thể này');
            }

            // Giá khuyến mãi cho biến thể
            if (! Schema::hasColumn('product_variants', 'sale_price')) {
                $table->decimal('sale_price', 10, 2)->nullable()->after('old_price')
                    ->comment('Giá khuyến mãi (sale price) — nếu có, đây là giá khách thực trả');
            }
        });
    }

    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table): void {
            $table->dropColumn(array_filter(['gram_weight', 'sale_price', 'cost'], fn ($col) => Schema::hasColumn('product_variants', $col)));
        });
    }
};
