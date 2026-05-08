<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ProfilController;
use App\Http\Controllers\CompetenceController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/profile', [ProfilController::class, 'update']);
    Route::post('/profile/competences', [ProfilController::class, 'updateCompetences']);
    Route::get('/competences', [CompetenceController::class, 'index']);
});
