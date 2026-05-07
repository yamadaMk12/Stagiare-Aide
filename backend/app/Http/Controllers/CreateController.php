<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use Illuminate\Http\Request;

class CreateController extends Controller
{
public function store(Request $request)
{
    $request->validate([
        'post_id' => 'required|exists:posts,id',
        'message' => 'required|string|min:10',
    ]);

    $candidature = \App\Models\Candidature::create([
        'post_id'     => $request->post_id,
        'candidat_id' => $request->user()->id,
        'message'     => $request->message,
        'statut'      => 'en_attente',
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Candidature enregistrée !',
        'data'    => $candidature
    ], 201);
}
}

