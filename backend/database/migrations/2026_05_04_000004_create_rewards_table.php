<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rewards', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedInteger('points_required')->default(0);
            $table->unsignedBigInteger('image_id')->nullable();
            $table->string('category')->default('voucher'); // voucher, product, service
            $table->string('badge')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->boolean('out_of_stock')->default(false);
            $table->integer('stock')->default(-1); // -1 = unlimited
            $table->timestamps();

            $table->foreign('image_id')->references('id')->on('media')->nullOnDelete();
        });

        Schema::create('reward_redemptions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('reward_id');
            $table->unsignedInteger('points_spent');
            $table->string('status')->default('pending'); // pending, completed, cancelled
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('reward_id')->references('id')->on('rewards')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reward_redemptions');
        Schema::dropIfExists('rewards');
    }
};
