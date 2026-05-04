<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop nếu tồn tại (để chạy lại được)
        Schema::dropIfExists('product_grouped_items');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('product_attribute_values');
        Schema::dropIfExists('product_attributes');

        // Bảng thuộc tính sản phẩm (Màu, Size, Chất liệu...)
        Schema::create('product_attributes', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('name');          // vd: "Màu sắc", "Kích thước"
            $table->string('slug')->nullable(); // vd: "mau-sac", "kich-thuoc"
            $table->boolean('is_visible')->default(true);
            $table->boolean('for_variations')->default(false);
            $table->integer('position')->default(0);
            $table->timestamps();
        });

        // Giá trị của thuộc tính (Đỏ, Xanh, S, M, L...)
        Schema::create('product_attribute_values', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_attribute_id')->constrained()->cascadeOnDelete();
            $table->string('value');    // vd: "Đỏ", "XL"
            $table->integer('position')->default(0);
            $table->timestamps();
        });

        // Bảng biến thể sản phẩm (Áo đỏ size L)
        Schema::create('product_variants', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('sku')->nullable()->index();
            $table->decimal('price', 10, 2)->nullable();
            $table->decimal('old_price', 10, 2)->nullable();
            $table->unsignedBigInteger('qty')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->string('image_url', 1000)->nullable();
            $table->foreignId('image_id')->nullable()->constrained('curator')->nullOnDelete();
            $table->decimal('weight_value', 10, 2)->nullable();
            $table->string('weight_unit')->default('kg');
            $table->json('attributes')->nullable(); // {"Màu": "Đỏ", "Size": "L"}
            $table->integer('position')->default(0);
            $table->timestamps();
        });

        // Bảng sản phẩm nhóm (grouped product → danh sách sản phẩm con)
        Schema::create('product_grouped_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('parent_product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('child_product_id')->constrained('products')->cascadeOnDelete();
            $table->integer('position')->default(0);
            $table->timestamps();

            $table->unique(['parent_product_id', 'child_product_id']);
        });

        // Thêm cột woo_type và woo_id vào bảng products để theo dõi nguồn gốc
        Schema::table('products', function (Blueprint $table): void {
            if (! Schema::hasColumn('products', 'woo_type')) {
                $table->string('woo_type', 50)->nullable()->after('type');
            }
            if (! Schema::hasColumn('products', 'woo_id')) {
                $table->string('woo_id')->nullable()->after('woo_type');
            }
            if (! Schema::hasColumn('products', 'parent_product_id')) {
                $table->foreignId('parent_product_id')->nullable()->after('woo_id')
                    ->constrained('products')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->dropForeign(['parent_product_id']);
            $table->dropColumn(['woo_type', 'woo_id', 'parent_product_id']);
        });

        Schema::dropIfExists('product_grouped_items');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('product_attribute_values');
        Schema::dropIfExists('product_attributes');
    }
};
