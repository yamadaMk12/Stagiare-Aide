<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CandidatureController;
use App\Http\Controllers\delete;

Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/candidatures', [CandidatureController::class, 'store']);
    Route::delete('/candidatures/{id}', [delete::class, 'destroy']);

});