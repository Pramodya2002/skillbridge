<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Volunteer;
use App\Models\Task;

class MatchingController extends Controller
{
    // weights (tune later)
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

        $matches = $tasks->map(function ($task) use ($volunteer) {
            $score = 0;

            // Skills match (both arrays)
            $taskSkills = $task->required_skills ?? [];
            $volSkills = $volunteer->skills ?? [];
            if (!empty($taskSkills) && !empty($volSkills)) {
                $common = count(array_intersect($taskSkills, $volSkills));
                $score += ($common / max(count($taskSkills), 1)) * $this->weights['skills'];
            }

            // Causes match (if any cause matches)
            $volCauses = $volunteer->causes ?? [];
            // assume $task->cause if you store a cause per task (nullable), otherwise compare to nonprofit focus area
            if (!empty($volCauses) && property_exists($task, 'cause') && $task->cause) {
                if (in_array($task->cause, $volCauses)) {
                    $score += $this->weights['causes'];
                }
            }

            // Availability - simple rule: if volunteer has any availability set, award weight
            if (!empty($volunteer->availability)) {
                // improving this requires mapping availability to dates/time slots
                $score += $this->weights['availability'];
            }

            // Experience - if both present (you can add task.difficulty later)
            if (!empty($volunteer->experience_level) && !empty($task->difficulty)) {
                // you need to define ranking order: beginner < intermediate < expert
                $levels = ['beginner' => 1, 'intermediate' => 2, 'expert' => 3];
                $v = $levels[$volunteer->experience_level] ?? 0;
                $t = $levels[$task->difficulty] ?? 0;
                if ($v >= $t) {
                    $score += $this->weights['experience'];
                }
            }

            // Location (basic equality)
            if (!empty($volunteer->location) && !empty($task->location) && $volunteer->location === $task->location) {
                $score += $this->weights['location'];
            }

            return [
                'task' => $task,
                'score' => min(100, round($score))
            ];
        });

        $ordered = $matches->sortByDesc('score')->values();

        return response()->json($ordered);
    }
}
