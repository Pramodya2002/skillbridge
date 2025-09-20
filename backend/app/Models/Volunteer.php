<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Volunteer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'phone',
        'skills',
        'availability',
        'causes',
        'experience_level',
        'portfolio_url',
        'max_hours_per_week',

    ];

    protected $casts = [
        'skills' => 'array',
        'causes' => 'array',
        'availability' => 'array',

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
