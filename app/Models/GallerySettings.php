<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GallerySettings extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'check_in',
        'check_out',
        'images',
        'is_active'
    ];

    protected $casts = [
        'images' => 'array',
        'is_active' => 'boolean'
    ];

    /**
     * Get the active gallery settings
     */
    public static function getActive()
    {
        return self::where('is_active', true)->first();
    }

    /**
     * Set this gallery as active and deactivate others
     */
    public function setActive()
    {
        // Deactivate all other galleries
        self::where('id', '!=', $this->id)->update(['is_active' => false]);

        // Activate this one
        $this->update(['is_active' => true]);
    }
}
