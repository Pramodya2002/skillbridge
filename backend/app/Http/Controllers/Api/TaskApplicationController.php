<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TaskApplication;
use App\Models\Volunteer;

class TaskApplicationController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'volunteer_id' => 'required|exists:volunteers,id',
            'task_id' => 'required|exists:tasks,id',
        ]);

        $exists = TaskApplication::where('volunteer_id',$data['volunteer_id'])
            ->where('task_id',$data['task_id'])->first();

        if ($exists) {
            return response()->json(['message'=>'Already applied'], 409);
        }

        $app = TaskApplication::create([
            'volunteer_id' => $data['volunteer_id'],
            'task_id' => $data['task_id'],
        ]);

        return response()->json($app, 201);
    }

    public function myTasks($volunteerId)
    {
        $applications = \App\Models\TaskApplication::with('task')
            ->where('volunteer_id', $volunteerId)
            ->get();

        return response()->json($applications);
    }

}

