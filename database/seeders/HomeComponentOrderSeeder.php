<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\HomeComponentOrder;

class HomeComponentOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultComponents = [
            'resort-hero',
            'booking-bar',
            'resort-intro-gallery',
            'facilities',
            'rooms-section',
            'entertainment-strip',
            'dining-carousel',
            'activity-showcase',
            'activities-grid',
            'wellness-pairs-slider',
            'offers-deck',
            'events-showcase',
            'location-map',
            'guest-reviews',
            'vertical-spotlight-slider',
            'become-member'
        ];

        // Clear existing records first
        HomeComponentOrder::truncate();

        foreach ($defaultComponents as $index => $componentId) {
            HomeComponentOrder::create([
                'component_id' => $componentId,
                'variant_name' => null,
                'display_name' => null,
                'order_position' => $index + 1,
                'is_active' => true,
                'is_visible' => true,
                'is_original' => true
            ]);
        }
    }
}
