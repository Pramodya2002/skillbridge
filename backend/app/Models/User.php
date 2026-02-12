<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',

    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function badges()
    {
        return $this->belongsToMany(Badge::class, 'volunteer_badges')
            ->withPivot('awarded_at')
            ->withTimestamps();
    }


    public function engagementScore(): int
    {
        $tasksCompleted = $this->tasks()
            ->where('status', 'completed')
            ->count();

        $totalHours = $this->tasks()
            ->where('status', 'completed')
            ->sum('hours');

        $distinctSkills = $this->tasks()
            ->where('status', 'completed')
            ->distinct('skill')
            ->count('skill');

        $badgesEarned = $this->badges()->count();

        return
            ($tasksCompleted * 2) +
            ($totalHours * 1) +
            ($distinctSkills * 3) +
            ($badgesEarned * 5);
    }

    /**
     * Get the HR profile associated with the user (if role = hr)
     */
    public function hr()
    {
        return $this->hasOne(Hr::class);
    }

    /**
     * Get the Volunteer profile (if role = volunteer)
     */
    public function volunteer()
    {
        return $this->hasOne(Volunteer::class);
    }


}
