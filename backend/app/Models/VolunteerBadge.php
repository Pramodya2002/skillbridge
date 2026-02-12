<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class VolunteerBadge extends Pivot  
{
    protected $table = 'volunteer_badges';

    protected $fillable = [
        'volunteer_id',
        'badge_id',
        'awarded_at',
    ];

    protected $dates = ['awarded_at'];

    public $timestamps = true;
}
