<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Volunteer;
use App\Models\Nonprofit;
use App\Models\Hr;


class ProfileController extends Controller
{
    /**
     * Get logged in user's profile
     */
    public function show(Request $request)
    {
        $user = $request->user(); 

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user->role === 'volunteer') {
            $volunteer = Volunteer::where('user_id', $user->id)->first();

            $badges = $volunteer 
            ? $volunteer->badges()
                ->select('badges.id', 'badges.name', 'badges.skill', 'volunteer_badges.awarded_at as earned_at')
                ->get()
            : collect();

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => optional($volunteer)->phone,
                ],
                'roleData' => $volunteer ? $volunteer->only([
                    'skills',
                    'causes',
                    'availability',
                    'max_hours_per_week',
                    'portfolio_url',
                    'company_name',
                ]) : new \stdClass(),
                'badges' => $badges,
            ]);
        }

        if ($user->role === 'nonprofit') {
            $nonprofit = Nonprofit::where('user_id', $user->id)->first();

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'roleData' => $nonprofit ? $nonprofit->only([
                    'org_name',
                    'mission',
                    'focus_area',
                    'website',
                    'contact_name',
                    'contact_email',
                 ]) : new \stdClass(),
            ]);
        }

        if ($user->role === 'hr') {
            $hr = Hr::where('user_id', $user->id)->first();

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => optional($hr)->phone ?? null,
                ],
                'roleData' => $hr ? $hr->only([
                    'company_name',
                    'department',
                    'position',
                    'company_website',
                    'employee_count',
                ]) : new \stdClass(),
            ]);
        }

        return response()->json(['message' => 'Role not supported'], 400);
    }

    public function update(Request $request)
    {
        $user = $request->user(); 

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $commonRules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
        ];

        if ($user->role === 'volunteer') {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email,' . $user->id,
                'skills' => 'nullable|array',
                'causes' => 'nullable|array',
                'availability' => 'nullable|array',
                'max_hours_per_week' => 'nullable|integer',
                'portfolio' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:20',
                'company_name' => 'nullable|string|max:255',
            ]);

            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);

            $volunteer = Volunteer::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'phone' => $validated['phone'] !== '' ? $validated['phone'] : null,
                    'skills' => $validated['skills'] ?? [],
                    'causes' => $validated['causes'] ?? [],
                    'availability' => $validated['availability'] ?? [],
                    'max_hours_per_week' => $validated['max_hours_per_week'] ?? null,
                    'portfolio_url' => $validated['portfolio'] ?? null,
                    'company_name' => $validated['company_name'] ?? null,
                ]
            );

            return response()->json([
                'message' => 'Profile updated successfully',
                'user' => $user->fresh(),
                'roleData' => $volunteer,
            ]);
        }

        if ($user->role === 'nonprofit') {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email,' . $user->id,
                'org_name' => 'nullable|string|max:255',
                'mission' => 'nullable|string|max:500',
                'focus_area' => 'nullable|string|max:255',
                'website' => 'nullable|string|max:255',
                'contact_name' => 'nullable|string|max:255',
                'contact_email' => 'nullable|string|max:255',
            ]);

            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);

            $nonprofit = Nonprofit::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'org_name' => $validated['org_name'] ?? null,
                    'mission' => $validated['mission'] ?? null,
                    'focus_area' => $validated['focus_area'] ?? null,
                    'website' => $validated['website'] ?? null,
                    'contact_name' => $validated['contact_name'] ?? null,
                    'contact_email' => $validated['contact_email'] ?? null,
                ]
            );

            return response()->json([
                'message' => 'Profile updated successfully',
                'user' => $user->fresh(),
                'roleData' => $validated,
            ]);
        }

        if ($user->role === 'hr') {
            $validated = $request->validate(array_merge($commonRules, [
                'phone' => 'nullable|string|max:20',
                'company_name' => 'required|string|max:255',
                'department' => 'required|string|max:255',
                'position' => 'required|string|max:255',
                'company_website' => 'nullable|url|max:255',
                'employee_count' => 'nullable|integer|min:0',
            ]));

            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);

            $hr = Hr::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'company_name' => $validated['company_name'],
                    'department' => $validated['department'],
                    'position' => $validated['position'],
                    'company_website' => $validated['company_website'] ?? null,
                    'employee_count' => $validated['employee_count'] ?? 0,
                ]
            );

            return response()->json([
                'message' => 'Profile updated successfully',
                'user' => $user->fresh(),
                'roleData' => $hr->toArray(),
            ]);
        }


        return response()->json(['message' => 'Profile update not implemented for this role'], 400);
    }
}
