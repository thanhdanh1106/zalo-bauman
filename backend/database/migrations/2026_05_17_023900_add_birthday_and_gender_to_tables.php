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
        // Add columns to users table
        Schema::table('users', function (Blueprint $table): void {
            if (!Schema::hasColumn('users', 'birthday')) {
                $table->date('birthday')->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'gender')) {
                $table->string('gender')->nullable()->after('birthday');
            }
        });

        // Add column to customers table
        Schema::table('customers', function (Blueprint $table): void {
            if (!Schema::hasColumn('customers', 'gender')) {
                $table->string('gender')->nullable()->after('birthday');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['birthday', 'gender']);
        });

        Schema::table('customers', function (Blueprint $table): void {
            $table->dropColumn('gender');
        });
    }
};
