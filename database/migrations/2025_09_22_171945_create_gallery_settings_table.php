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
        Schema::create('gallery_settings', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default('Welcome to Rixos Sharm El Sheikh Adults Only 18+');
            $table->text('description')->nullable();
            $table->string('check_in')->default('Check-in – 2:00 PM');
            $table->string('check_out')->default('Check-out – 12:00 PM');
            $table->json('images')->nullable(); // Array of image objects with src, alt, name
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallery_settings');
    }
};
