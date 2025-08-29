<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'location',
        'start_date',
        'end_date',
        'required_skills',
        'volunteers_needed',
        'status',
    ];

    protected $casts = [
    'required_skills' => 'array',
    ];

    public function volunteers()
    {
        return $this->belongsToMany(User::class, 'task_user', 'task_id', 'user_id');
    }

    
}
