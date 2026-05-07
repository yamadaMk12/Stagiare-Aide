<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use Illuminate\Http\Request;

class CandidatureController extends Controller
{
    /**
     * Update the status of a candidature (accepte / refuse).
     *
     * Only the stagiaire who submitted the candidature can change its status.
     * Once accepted or refused, the status cannot be changed again.
     */
    public function updateStatut(Request $request)
    {
        $request->validate([
            'candidature_id' => 'required|exists:candidatures,id',
            'statut'         => 'required|in:accepte,refuse',
        ]);

        $candidature = Candidature::find($request->candidature_id);

        // Only the owner of the candidature can change its status
        if ($candidature->candidat_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Action non autorisée.',
            ], 403);
        }

        // Prevent overriding a decision already made
        if ($candidature->statut !== 'en_attente') {
            return response()->json([
                'success' => false,
                'message' => 'Une décision a déjà été prise pour cette candidature.',
            ], 422);
        }

        $candidature->update([
            'statut' => $request->statut,
        ]);

        return response()->json([
            'success'     => true,
            'message'     => 'Statut de la candidature mis à jour avec succès !',
            'candidature' => $candidature->fresh(),
        ], 200);
    }
}
