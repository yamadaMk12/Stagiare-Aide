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
}