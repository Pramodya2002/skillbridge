<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskApplication extends Model
{
    protected $fillable = ['volunteer_id', 'task_id', 'status'];

    public function volunteer() {
        return $this->belongsTo(Volunteer::class);
    }
    public function task() {
        return $this->belongsTo(Task::class);
    }
}
