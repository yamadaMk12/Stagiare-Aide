<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CandidatureController;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\CompetenceController;


Route::post('login', [AuthController::class, 'login']);
Route::post('register' , [AuthController::class , 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('profile', [ProfilController::class, 'update']);
    Route::post('/profile/competences', [ProfilController::class, 'updateCompetences']);
    Route::get('/competences', [CompetenceController::class, 'index']);
    Route::post('/candidatures', [CandidatureController::class, 'store']);
    Route::delete('/candidatures/{id}', [CandidatureController::class, 'destroy']);
});