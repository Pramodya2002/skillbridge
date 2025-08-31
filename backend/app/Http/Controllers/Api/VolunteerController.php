<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\User;

class VolunteerController extends Controller
{
   public function matchedTasks($id)
    {
        $volunteer = \App\Models\Volunteer::where('user_id', $id)->firstOrFail();

        $volunteerSkills = json_decode($volunteer->skills ?? '[]', true);

        $tasks = Task::all();
        $matches = [];

        foreach ($tasks as $task) {
            $taskSkills = $task->required_skills ?? [];
            if (!is_array($taskSkills)) {
                $taskSkills = json_decode($taskSkills, true) ?? [];
            }

            $common = array_intersect($volunteerSkills, $taskSkills);
            $score = count($taskSkills) > 0 ? round((count($common) / count($taskSkills)) * 100) : 0;

            if ($score > 0) {
                $matches[] = [
                    'task' => $task,
                    'score' => $score
                ];
            }
        }

        return response()->json($matches);
    }

}
