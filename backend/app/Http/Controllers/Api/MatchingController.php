<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Volunteer;
use App\Models\Task;

class MatchingController extends Controller
{
    private $weights = [
        'skills' => 50,
        'causes' => 20,
        'availability' => 15,
        'experience' => 10,
        'location' => 5,
    ];

    public function index($volunteerId)
    {
        $volunteer = Volunteer::findOrFail($volunteerId);
        $tasks = Task::where('status', 'Open')->get();

        $levels = ['beginner' => 1, 'intermediate' => 2, 'expert' => 3];
        $matches = $tasks->map(function ($task) use ($volunteer, $levels) {
            $score = 0;
            $reasons = [];

            $taskSkills = json_decode($task->required_skills, true) ?? [];
            $volSkills = $volunteer->skills ?? [];

            foreach ($taskSkills as $ts) {
                foreach ($volSkills as $vs) {
                    if ($vs['skill'] === $ts['skill']) {
                        if (($levels[$vs['level']] ?? 0) >= ($levels[$ts['level']] ?? 0)) {
                            $score += 25; 
                            $reasons[] = "Skill: {$vs['skill']} ({$vs['level']})";
                        }
                    }
                }
            }

            if ($task->cause && in_array($task->cause, $volunteer->causes ?? [])) {
                $score += 20;
                $reasons[] = "Cause: {$task->cause}";
            }

            if (!empty($volunteer->availability) && $task->start_date && $task->end_date) {
                $score += 20;
                $reasons[] = "Availability matches task period";
            }

            if (!empty($volunteer->location) && $volunteer->location === $task->location) {
                $score += 10;
                $reasons[] = "Location: {$task->location}";
            }

            return [
                'task' => $task,
                'score' => min(100, $score),
                'reasons' => $reasons
            ];
        });

        return response()->json($matches->sortByDesc('score')->values());
    }
}