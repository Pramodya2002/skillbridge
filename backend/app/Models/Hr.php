<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hr extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_name',
        'department',
        'position',
        'company_website',
        'employee_count',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
