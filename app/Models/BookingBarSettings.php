<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingBarSettings extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'date_label',
        'date_value',
        'guests_label',
        'guests_value',
        'cta_text',
        'price_currency',
        'price_amount',
        'price_meta',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    /**
     * Get the active booking bar settings
     */
    public static function getActive()
    {
        return self::where('is_active', true)->first();
    }

    /**
     * Set this booking bar as active and deactivate others
     */
    public function setActive()
    {
        // Deactivate all other booking bars
        self::where('id', '!=', $this->id)->update(['is_active' => false]);

        // Activate this one
        $this->update(['is_active' => true]);
    }
}
