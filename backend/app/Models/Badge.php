<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    protected $fillable = ['name', 'skill', 'criteria'];

    public function volunteers()
    {
        return $this->belongsToMany(Volunteer::class, 'volunteer_badges')
            ->withPivot('awarded_at')
            ->withTimestamps();
    }
}
