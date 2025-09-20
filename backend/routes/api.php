<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\VolunteerController;
use App\Http\Controllers\Api\TaskApplicationController;
use App\Http\Controllers\Api\ProfileController;



Route::middleware(\App\Http\Middleware\Cors::class)->group(function () {


    Route::post('/register', [RegisterController::class, 'register']);
    Route::post('/login', [LoginController::class, 'login']);
    Route::post('/logout', [LoginController::class, 'logout']);


    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::get('/tasks/{id}', [App\Http\Controllers\Api\TaskController::class, 'show']);
    Route::post('/tasks/{id}/apply', [App\Http\Controllers\Api\TaskController::class, 'apply']);


    Route::get('/volunteers/{id}/matched-tasks', [\App\Http\Controllers\Api\MatchingController::class, 'index']);
    Route::post('/task-applications', [TaskApplicationController::class, 'store'])->middleware(\App\Http\Middleware\Cors::class);


    Route::get('/volunteers/{id}/matched-tasks', [VolunteerController::class, 'matchedTasks']);
    Route::get('/volunteers/{id}/tasks', [TaskApplicationController::class, 'myTasks']);
    Route::get('/volunteers/{id}', [VolunteerController::class, 'show']);
    Route::get('/tasks/{id}/applications', [TaskApplicationController::class, 'byTask']);
    Route::post('/task-applications/{id}/update-status', [TaskApplicationController::class, 'updateStatus']);
});



Route::middleware('auth:api')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile/update', [ProfileController::class, 'update']);
});

