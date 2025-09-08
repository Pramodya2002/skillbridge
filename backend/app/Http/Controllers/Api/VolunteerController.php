<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\User;
use App\Models\Volunteer;


class VolunteerController extends Controller
{
   public function matchedTasks($id)
    {
        $volunteer = \App\Models\Volunteer::where('user_id', $id)->firstOrFail();

        $skills = is_string($volunteer->skills) ? json_decode($volunteer->skills, true) : $volunteer->skills;
        $availability = is_string($volunteer->availability) ? json_decode($volunteer->availability, true) : $volunteer->availability;
        $causes = is_string($volunteer->causes) ? json_decode($volunteer->causes, true) : $volunteer->causes;

        $tasks = \App\Models\Task::where('status', 'Open')->get();
        $matches = [];

        foreach ($tasks as $task) {
            $taskSkills = is_string($task->required_skills) ? json_decode($task->required_skills, true) : $task->required_skills;

            $score = 0;
            $reasons = [];

            if ($skills && $taskSkills) {
                $volunteerSkillNames = array_column($skills, 'skill');
                $taskSkillNames = array_column($taskSkills, 'skill');
                $matched = array_intersect($volunteerSkillNames, $taskSkillNames);

                if (!empty($matched)) {
                    $score += count($matched) * 20; 
                    $reasons[] = "Skills match: " . implode(", ", $matched);
                }
            }

            if (!empty($availability)) {
                $score += 20;
                $reasons[] = "Volunteer has availability";
            }

            if (!empty($causes) && !empty($task->cause)) {
                if (in_array($task->cause, $causes)) {
                    $score += 20;
                    $reasons[] = "Cause matches: {$task->cause}";
                }
            }

            if (!empty($volunteer->location) && !empty($task->location) && $volunteer->location === $task->location) {
                $score += 10;
                $reasons[] = "Location matches: {$task->location}";
            }

            if ($score > 0) {
                $matches[] = [
                    'task' => $task,
                    'score' => min($score, 100), 
                    'reasons' => $reasons,
                ];
            }
        }

        return response()->json($matches);
    }


    public function show($id)
    {
        $user = User::findOrFail($id);
        $volunteer = Volunteer::where('user_id', $id)->first();

        return response()->json([
            'user' => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ],
            'skills'           => $volunteer?->skills ? json_decode($volunteer->skills, true) : [],
            'causes'           => $volunteer?->causes ? json_decode($volunteer->causes, true) : [],
            'availability'     => $volunteer?->availability,
            'experience_level' => $volunteer?->experience_level,
            'portfolio_url'    => $volunteer?->portfolio_url,
        ]);
    }

}
