<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


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
        'company_name',

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

    public function badges()
    {
        return $this->belongsToMany(Badge::class, 'volunteer_badges')
                    ->withPivot('awarded_at')
                    ->withTimestamps();
    }


    public function taskApplications(): HasMany
    {
        return $this->hasMany(TaskApplication::class, 'volunteer_id');
    }
}
