<?php

namespace App\Services;

use App\Models\Badge;
use App\Models\User;
use App\Models\VolunteerBadge;
use App\Models\Volunteer;


class GamificationService
{
    public static function awardBadgeForSkill(Volunteer $volunteer, string $skill): void
    {
        // More aggressive cleaning
        $normalized = $skill;
        $normalized = trim($normalized);                     // remove start/end whitespace
        $normalized = str_replace(["\r", "\n", "\t"], '', $normalized); // remove control chars
        $normalized = preg_replace('/\s+/', '-', $normalized); // collapse any whitespace to single -
        $normalized = strtolower($normalized);

        // Optional: remove any non-word characters except - (very strict)
        // $normalized = preg_replace('/[^a-z0-9-]/i', '', $normalized);

        \Log::info("Normalized skill for badge award", [
            'original'     => $skill,
            'original_hex' => bin2hex($skill),
            'normalized'   => $normalized,
            'volunteer_id' => $volunteer->id
        ]);

        $badge = Badge::whereRaw('LOWER(TRIM(skill)) = ?', [$normalized])
                    ->orWhereRaw('LOWER(skill) = ?', [$normalized])
                    ->first();

        if (!$badge) {
            \Log::warning("No badge found after normalization", [
                'original'    => $skill,
                'normalized'  => $normalized,
                'volunteer_id'=> $volunteer->id
            ]);
            return;
        }

        VolunteerBadge::firstOrCreate(
            [
                'volunteer_id' => $volunteer->id,
                'badge_id'     => $badge->id,
            ],
            [
                'awarded_at' => now(),
            ]
        );
    }

}

