<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use Illuminate\Http\Request;

class CandidatureController extends Controller
{
    /**
     * Store a new candidature.
     */
    public function store(Request $request)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'message' => 'required|string|min:10',
        ]);

        $candidature = Candidature::create([
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

    /**
     * List received and sent candidatures.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $received = Candidature::whereHas('post', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->with(['post', 'candidat.profil'])->latest()->get();

        $sent = Candidature::where('candidat_id', $user->id)
            ->with(['post.user.profil'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'received' => $received,
            'sent' => $sent,
        ], 200);
    }

    /**
     * Update the status of a candidature (accepte / refuse).
     * Route: PUT /api/candidatures/{id}
     */
    public function update($id, Request $request)
    {
        $request->validate([
            'statut' => 'required|in:accepte,refuse',
        ]);

        $candidature = Candidature::findOrFail($id);

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
