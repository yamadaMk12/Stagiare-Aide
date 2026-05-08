<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use Illuminate\Http\Request;

class CandidatureController extends Controller
{
    public function destroy(Request $request)
    {
        $request->validate([
            'candidature_id' => 'required|exists:candidatures,id',
        ]);

        $candidature = Candidature::find($request->candidature_id);

        if ($candidature->candidat_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Action non autorisée.'
            ], 403);
        }
        $candidature->delete();

        return response()->json([
            'success' => true,
            'message' => 'Candidature supprimée avec succès !',
        ], 200);
    }
    
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