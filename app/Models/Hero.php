<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hero extends Model
{
    use HasFactory;

    protected $table = 'hero_settings';

    protected $fillable = [
        'title',
        'location',
        'stars',
        'bg_image_url',
        'bg_image',
        'bg_image_alt',
        'bg_image_name',
        'rating_score',
        'rating_reviews',
        'chips',
        'chip_images',
        'is_active'
    ];

    protected $casts = [
        'chips' => 'array',
        'chip_images' => 'array',
        'is_active' => 'boolean',
        'stars' => 'integer'
    ];

    /**
     * Get the active hero settings
     */
    public static function getActive()
    {
        return self::where('is_active', true)->first();
    }

    /**
     * Set this hero as active and deactivate others
     */
    public function setActive()
    {
        // Deactivate all other heroes
        self::where('id', '!=', $this->id)->update(['is_active' => false]);

        // Activate this one
        $this->update(['is_active' => true]);
    }
}
