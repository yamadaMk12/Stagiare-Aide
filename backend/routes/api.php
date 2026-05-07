<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfilController;


Route::post('login', [AuthController::class, 'login']);
Route::post('register' , [AuthController::class , 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/profile', [ProfilController::class, 'update']); 
    Route::post('/logout', [AuthController::class, 'logout']);
});