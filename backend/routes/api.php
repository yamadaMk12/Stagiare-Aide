<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DeleteController;

Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

Route::middleware('auth:sanctum')->group(function () {


    Route::delete('/candidatures/{id}', [DeleteController::class, 'destroy']);
    
});