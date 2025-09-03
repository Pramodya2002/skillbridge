<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::withCount('applications')->get();

        return response()->json($tasks);
    }


    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
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
            'required_skills',
            'volunteers_needed',
            'status',
        ]));


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


}
