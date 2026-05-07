<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CreateController;


Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/candidatures', [CreateController::class, 'store']);
    
});