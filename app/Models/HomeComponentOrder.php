<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeComponentOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'component_id',
        'variant_name',
        'display_name',
        'order_position',
        'is_active',
        'is_visible',
        'is_original',
        'component_data',
        'draft_data'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_visible' => 'boolean',
        'is_original' => 'boolean',
        'component_data' => 'array',
        'draft_data' => 'array',
    ];
}
