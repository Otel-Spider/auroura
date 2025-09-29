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
            $table->json('component_data')->nullable()->after('is_original');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('home_component_orders', function (Blueprint $table) {
            $table->dropColumn('component_data');
        });
    }
};
