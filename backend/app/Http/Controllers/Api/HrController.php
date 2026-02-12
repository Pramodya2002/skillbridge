<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\TaskApplication;
use App\Models\VolunteerBadge;

class HrController extends Controller
{
    public function getEmployeeEngagement(Request $request)
    {
        $hr = $request->user();
        $hrProfile = $hr->hr;

        if (!$hrProfile || !$hrProfile->company_name) {
            return response()->json([
                'error' => 'No company name set for this HR account. Please update your profile.'
            ], 400);
        }

        $hrCompany = $hrProfile->company_name;

        $employees = User::where('role', 'volunteer')
            ->whereHas('volunteer', function ($q) use ($hrCompany) {
                $q->where('company_name', $hrCompany);
            })
            ->with(['volunteer' => function ($q) {
                $q->withCount(['taskApplications as completed_tasks' => function ($q) {
                    $q->where('status', 'completed');
                }])
                  ->with(['taskApplications' => function ($q) {
                      $q->where('status', 'completed');
                  }])
                  ->withCount(['badges']);
            }])
            ->get();

        $result = $employees->map(function ($user) {
            $volunteer = $user->volunteer;

            $completedTasks = $volunteer->completed_tasks ?? 0;
            $hours = $volunteer->taskApplications->sum('hours') ?? 0;
            $distinctSkills = $volunteer->taskApplications
                ->where('status', 'completed')
                ->flatMap(fn($app) => $app->task->required_skills ?? [])
                ->unique('skill')
                ->count();
            $badges = $volunteer->badges_count ?? 0;

            $score = ($completedTasks * 2) + ($hours * 1) + ($distinctSkills * 3) + ($badges * 5);

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'completed_tasks' => $completedTasks,
                'total_hours' => $hours,
                'distinct_skills' => $distinctSkills,
                'badges' => $badges,
                'engagement_score' => $score,
            ];
        });

        return response()->json($result);
    }

   public function getAllApplications(Request $request)
    {
        $hr = $request->user();
        $hrProfile = $hr->hr;

        if (!$hrProfile || !$hrProfile->company_name) {
            return response()->json([
                'error' => 'No company name set for this HR account. Please update your profile.'
            ], 400);
        }

        $hrCompany = $hrProfile->company_name;

        $applications = TaskApplication::with(['volunteer.user', 'task'])
            ->whereHas('volunteer', function ($q) use ($hrCompany) {
                $q->where('company_name', $hrCompany);
            })
            ->whereIn('status', ['applied', 'accepted', 'rejected'])
            ->orderBy('created_at', 'desc')
            ->take(50)
            ->get()
            ->map(function ($app) {
                return [
                    'id' => $app->id,
                    'volunteer_name' => $app->volunteer->user->name ?? 'Unknown',
                    'volunteer_email' => $app->volunteer->user->email ?? '—',
                    'task_title' => $app->task->title,
                    'task_id' => $app->task_id,
                    'status' => $app->status,
                    'applied_at' => $app->created_at->format('Y-m-d H:i'),
                    'match_score' => $app->match_score ?? null,
                ];
            });

        return response()->json($applications);
    }
}