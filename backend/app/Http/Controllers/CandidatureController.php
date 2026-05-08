<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use Illuminate\Http\Request;

class CandidatureController extends Controller

{   /**
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
        ])
        
        return response()->json([
            'success'     => true,
            'message'     => 'Statut de la candidature mis à jour avec succès !',
            'candidature' => $candidature->fresh(),
        ], 200);
    }
             
}
