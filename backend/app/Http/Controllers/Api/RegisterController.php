<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Volunteer;
use App\Models\Nonprofit;
use App\Models\Hr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'role' => 'required|in:volunteer,nonprofit,hr',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'role' => $request->role,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

          switch ($request->role) {
            case 'volunteer':
                Volunteer::create([
                    'user_id' => $user->id,
                    'skills' => json_encode($request->skills ?? []),
                    'availability' => $request->availability,
                    'causes' => json_encode($request->causes ?? []),
                    'experience_level' => $request->experience,
                    'portfolio_url' => $request->portfolio,
                ]);
                break;

            case 'nonprofit':
                Nonprofit::create([
                    'user_id' => $user->id,
                    'org_name' => $request->orgName,
                    'mission' => $request->mission,
                    'focus_area' => $request->focusAreas,
                    'website' => $request->website,
                    'contact_name' => $request->contactName,
                    'contact_email' => $request->contactEmail,
                ]);
                break;

            case 'hr':
                Hr::create([
                    'user_id' => $user->id,
                    'company_name' => $request->company,
                    'department' => $request->department,
                    'position' => $request->position,
                    'company_website' => $request->companyWebsite,
                    'employee_count' => $request->employeeCount,
                ]);
                break;
        }

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
    }
}