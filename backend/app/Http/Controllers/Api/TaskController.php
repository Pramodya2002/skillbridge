<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    public function index()
    {
        return Task::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'required_skills' => 'nullable|string|max:255',
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
}
