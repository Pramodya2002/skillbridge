<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\VolunteerController;
use App\Http\Controllers\Api\TaskApplicationController;




Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout']);


Route::get('/tasks', [TaskController::class, 'index']);
Route::post('/tasks', [TaskController::class, 'store']);
Route::get('/tasks/{id}', [App\Http\Controllers\Api\TaskController::class, 'show']);
Route::post('/tasks/{id}/apply', [App\Http\Controllers\Api\TaskController::class, 'apply']);


Route::get('/volunteers/{id}/matched-tasks', [\App\Http\Controllers\Api\MatchingController::class, 'index']);
Route::post('/task-applications', [TaskApplicationController::class, 'store']);


Route::get('/volunteers/{id}/matched-tasks', [VolunteerController::class, 'matchedTasks']);
