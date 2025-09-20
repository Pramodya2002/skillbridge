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

        $request->headers->set('Accept', 'application/json');

        $volunteer = \App\Models\Volunteer::where('user_id', $request->user_id)->firstOrFail();


        $data = $request->validate([
            'task_id' => 'required|exists:tasks,id',
        ]);

        $data['volunteer_id'] = $volunteer->id;


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

    public function myTasks($userId)
    {
        $volunteer = Volunteer::where('user_id', $userId)->firstOrFail();

        $applications = \App\Models\TaskApplication::with('task')
            ->where('volunteer_id', $volunteer->id)
            ->get();

        return response()->json($applications);
    }

    public function byTask($taskId)
    {
        $applications = TaskApplication::with('volunteer.user')
            ->where('task_id', $taskId)
            ->get();

        return response()->json($applications);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:applied,accepted,rejected'
        ]);

        $application = TaskApplication::findOrFail($id);
        $application->status = $request->status;
        $application->save();

        $task = $application->task;

        if ($request->status === 'accepted') {
            if ($task->status === 'Open') {
                $task->status = 'Ongoing';
            }

            $acceptedCount = $task->applications()->where('status', 'accepted')->count();
            if ($acceptedCount >= $task->volunteers_needed) {
                $task->status = 'Ongoing'; 
            }

            $task->save();
        }

        return response()->json(['message' => 'Application updated', 'application' => $application, 'task' => $task]);
    }


}

