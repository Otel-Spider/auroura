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
        Schema::create('booking_bar_settings', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default('Book your next ALL Inclusive Collection experience');
            $table->string('date_label')->default('Dates');
            $table->string('date_value')->default('09 Oct – 14 Oct');
            $table->string('guests_label')->default('Rooms & Guests');
            $table->string('guests_value')->default('1 room – 2 guests');
            $table->string('cta_text')->default('BOOK NOW');
            $table->string('price_currency')->default('USD');
            $table->string('price_amount')->default('1444.95');
            $table->string('price_meta')->default('5 nights – 2 guests');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_bar_settings');
    }
};
