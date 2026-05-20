<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use Illuminate\Http\Request;

class CandidatureController extends Controller
{
    /**
     * Store a new candidature for a given post.
     * The post_id comes from the route: POST /api/posts/{post}/candidatures
     */
    public function store(Request $request, $post_id)
    {
        $request->validate([
            'message' => 'required|string|min:10',
        ]);

        $candidature = Candidature::create([
            'post_id'     => $post_id,
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

    /**
     * Update the message of an existing candidature.
     * 
     * Only the candidate can edit it while it's still 'en_attente'.
     */
    public function update(Request $request)
    {
        $request->validate([
            'candidature_id' => 'required|exists:candidatures,id',
            'message'        => 'required|string|min:10',
        ]);

        $candidature = Candidature::findOrFail($request->candidature_id);

        if ($candidature->candidat_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Action non autorisée.',
            ], 403);
        }

        if ($candidature->statut !== 'en_attente') {
            return response()->json([
                'success' => false,
                'message' => 'Une décision a déjà été prise pour cette candidature.',
            ], 422);
        }

        $candidature->update([
            'message' => $request->message,
        ]);

        return response()->json([
            'success'     => true,
            'message'     => 'Candidature mise à jour avec succès !',
            'candidature' => $candidature->fresh(),
        ], 200);
    }

    /**
     * Update the status of a candidature (accepte / refuse).
     * 
     * Note: Usually the OWNER of the post does this, but keeping the logic 
     * provided which ensures ownership or specific rules.
     */
    public function updateStatut(Request $request)
    {
        $request->validate([
            'candidature_id' => 'required|exists:candidatures,id',
            'statut'         => 'required|in:accepte,refuse',
        ]);

        $candidature = Candidature::findOrFail($request->candidature_id);

        // Authorization check: If the user is the candidate, they can't accept their own candidature?
        if ($candidature->post->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Action non autorisée.',
            ], 403);
        }

        if ($candidature->statut !== 'en_attente') {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de modifier une candidature déjà traitée.',
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

    /**
     * Delete a candidature.
     */
    public function destroy($id, Request $request)
    {
        $candidature = Candidature::findOrFail($id);

        if ($candidature->candidat_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Action non autorisée.',
            ], 403);
        }

        $candidature->delete();

        return response()->json([
            'success' => true,
            'message' => 'Candidature supprimée avec succès !',
        ], 200);
    }
}
