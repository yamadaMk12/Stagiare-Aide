<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CandidatureController;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\CompetenceController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\FiliereTechnoController;
use App\Http\Controllers\EvaluationController;

Route::post('login', [AuthController::class, 'login']);
Route::post('register' , [AuthController::class , 'register']);
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/search', [PostController::class, 'search']);
Route::get('/posts/{post}', [PostController::class, 'show']);

Route::get('/stats/trending-technologies', [StatsController::class, 'getTrendingTechnologies']);
Route::get('/stats/top-helpers', [StatsController::class, 'getTopHelpers']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/stats/user', [StatsController::class, 'getUserStats']);
    Route::get('/user', function (Request $request) {
        return $request->user()->load(['profil', 'competences']);
    });
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('profile', [ProfilController::class, 'update']);
    Route::post('/profile/competences', [ProfilController::class, 'updateCompetences']);
    Route::get('/competences', [CompetenceController::class, 'index']);
    Route::get('/candidatures', [CandidatureController::class, 'index']);
    Route::post('/candidatures', [CandidatureController::class, 'store']);
    Route::put('/candidatures/{id}', [CandidatureController::class, 'update']);
    Route::post('/posts/{post_id}/candidatures', [CandidatureController::class, 'store']);
    Route::delete('/candidatures/{id}', [CandidatureController::class, 'destroy']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::post('/evaluations', [EvaluationController::class, 'store']);
});

Route::get('/filieres', [FiliereTechnoController::class, 'filieres']);
Route::get('/technologies', [FiliereTechnoController::class, 'technologies']);
Route::get('/posts', [PostController::class, 'index']);
Route::get('/evaluations/user/{id}', [EvaluationController::class, 'index']);