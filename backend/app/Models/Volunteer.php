<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Volunteer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'skills',
        'availability',
        'causes',
        'experience_level',
        'portfolio_url',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
