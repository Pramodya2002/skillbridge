<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User; 

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'location',
        'start_date',
        'end_date',
        'cause',
        'required_skills',
        'volunteers_needed',
        'status',
        'nonprofit_id',
    ];

    protected $casts = [
        'required_skills' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
    ];


    public function nonprofit()
    {
        return $this->belongsTo(User::class, 'nonprofit_id');
    }

    public function volunteers()
    {
        return $this->belongsToMany(User::class, 'task_user', 'task_id', 'user_id');
    }

    public function applications()
    {
        return $this->hasMany(\App\Models\TaskApplication::class);
    }


    
}
