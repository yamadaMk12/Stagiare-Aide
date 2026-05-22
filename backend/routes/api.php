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
use App\Http\Controllers\AbonnementController;

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

    // Abonnements (subscription)
    Route::get('/abonnement', [AbonnementController::class, 'index']);
    Route::post('/abonnement/subscribe', [AbonnementController::class, 'subscribe']);

    // Admin: manage subscriptions manually
    Route::get('/admin/abonnements', [AbonnementController::class, 'adminIndex']);
    Route::put('/admin/abonnements/{id}/validate', [AbonnementController::class, 'validateAbonnement']);
    Route::put('/admin/abonnements/{id}/reject', [AbonnementController::class, 'reject']);
});

Route::get('/filieres', [FiliereTechnoController::class, 'filieres']);
Route::get('/technologies', [FiliereTechnoController::class, 'technologies']);
Route::get('/posts', [PostController::class, 'index']);