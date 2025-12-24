<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
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


}
