<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use Illuminate\Http\Request;

class CandidatureController extends Controller
{
    /**
     * Update the message of an existing demande.
     *
     * Only the stagiaire who submitted the candidature can edit it,
     * and only while its status is still 'en_attente'.
     * Once accepted or refused, it becomes read-only.
     */
    public function update(Request $request)
    {
        $request->validate([
            'candidature_id' => 'required|exists:candidatures,id',
            'message'        => 'required|string',
        ]);

        $candidature = Candidature::find($request->candidature_id);

        // Ensure the authenticated user owns this demande
        if ($candidature->candidat_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Action non autorisée.',
            ], 403);
        }

        // Editing is only allowed while the demande is still pending
        if ($candidature->statut !== 'en_attente') {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de modifier une candidature déjà traitée.',
            ], 422);
        }

        // Only the message can be changed — post and status are not touch
        $candidature->update([
            'message' => $request->message,
        ]);

        return response()->json([
            'success'     => true,
            'message'     => 'Candidature mise à jour avec succès !',
            'candidature' => $candidature->fresh(),
        ], 200);
    }
}
