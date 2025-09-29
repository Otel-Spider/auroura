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
        Schema::table('home_component_orders', function (Blueprint $table) {
            $table->string('variant_name')->nullable()->after('component_id');
            $table->string('display_name')->nullable()->after('variant_name');
            $table->boolean('is_visible')->default(true)->after('is_active');
            $table->boolean('is_original')->default(true)->after('is_visible');

            // Remove unique constraint from component_id since we can have duplicates now
            $table->dropUnique(['component_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('home_component_orders', function (Blueprint $table) {
            $table->dropColumn(['variant_name', 'display_name', 'is_visible', 'is_original']);
            $table->unique('component_id');
        });
    }
};
