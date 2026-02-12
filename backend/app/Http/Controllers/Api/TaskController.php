<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use App\Services\GamificationService;
use App\Models\Volunteer;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
   public function index()
    {
        $user = auth('api')->user();

        if (!$user || $user->role !== 'nonprofit') {
            return response()->json([
                'error' => 'Unauthorized. Only nonprofit users can view their tasks.'
            ], 401);
        }

        $tasks = Task::withCount('applications')
                    ->where('nonprofit_id', $user->id)
                    ->latest()          
                    ->get();

        return response()->json([
            'data' => $tasks
        ]);
    }


    public function store(Request $request)
    {

        $user = auth('api')->user();
        
        if (!$user || $user->role !== 'nonprofit') {
            return response()->json([
                'error' => 'Unauthorized. Only nonprofit accounts can create tasks.'
            ], 401);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'cause' => 'nullable|string|max:255',
            'required_skills' => 'nullable|array', 
            'volunteers_needed' => 'nullable|integer|min:1',
            'status' => 'nullable|in:Open,Ongoing,Completed',
        ]);

        $task = Task::create($request->only([
            'title',
            'description',
            'location',
            'start_date',
            'end_date',
            'cause', 
            'required_skills',
            'volunteers_needed',
            'status',
        ]) + ['nonprofit_id' => $user->id]
    );


        return response()->json($task, 201);
    }

    public function show($id)
    {
        $task = Task::withCount('applications')->find($id);

        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        return response()->json($task);
    }

    public function apply(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $task = Task::find($id);

        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }
        
        $task->volunteers()->syncWithoutDetaching([$request->user_id]);

        if ($task->status === 'Open') {
            $task->status = 'Ongoing';
            $task->save();
        }

        return response()->json(['message' => 'Applied successfully'], 200);
    }


    public function publicIndex()
    {
        $tasks = Task::withCount('applications')
                    ->where('status', 'Open')  
                    ->latest()
                    ->get();

        return response()->json([
            'data' => $tasks
        ]);
    }


    public function markAsCompleted($taskId)
    {
        $user = auth('api')->user();

        if (!$user || $user->role !== 'nonprofit') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $task = Task::with('applications.volunteer.user')->findOrFail($taskId);

        if ($task->status !== 'Ongoing') {
            return response()->json([
                'error' => 'Only ongoing tasks can be completed'
            ], 400);
        }

        $task->status = 'Completed';
        $task->save();

        foreach ($task->applications as $application) {

            if ($application->status !== 'accepted') {
                continue;
            }

            $application->status = 'completed';
            $application->save();

            $volunteer = $application->volunteer;

            $skills = is_string($task->required_skills)
                ? json_decode($task->required_skills, true)
                : $task->required_skills;

            if ($skills) {
                foreach ($skills as $skill) {

                $skillName = $skill['skill'] ?? '';

                \Illuminate\Support\Facades\Log::info('Trying to award badge for skill', [
                    'raw_skill'     => $skillName,
                    'length'        => strlen($skillName),
                    'hex'           => bin2hex($skillName),
                    'trimmed'       => trim($skillName),
                    'first_char_hex'=> substr(bin2hex($skillName), 0, 4), 
                    'last_char_hex' => substr(bin2hex($skillName), -4), 
                    'task_id'       => $task->id,
                    'volunteer_id'  => $volunteer->id ?? 'unknown',
                    'application_id'=> $application->id ?? 'unknown',
                ]);
                    GamificationService::awardBadgeForSkill(
                        $volunteer,
                        $skill['skill']
                    );
                }
            }
        }

        return response()->json([
            'message' => 'Task and applications marked as completed. Badges awarded.'
        ]);
    }

    public function destroy($id)
    {
        $user = auth('api')->user();

        if (!$user || $user->role !== 'nonprofit') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $task = Task::where('id', $id)
            ->where('nonprofit_id', $user->id)
            ->first();

        if (!$task) {
            return response()->json(['error' => 'Task not found or access denied'], 404);
        }

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully'
        ]);
    }


}
