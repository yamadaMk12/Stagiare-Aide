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
     * List received and sent candidatures.
     */

    // bach n3awdo nchargiw les coordonnes wnsayftohom 
public function index(Request $request)
    {
        $user = $request->user();

        // Ajout dyal 'post.user.profil' bach n9edrou njibou les infos dyal demandeur
        $received = Candidature::whereHas('post', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->with(['post.user', 'post.user.profil', 'candidat.profil'])->latest()->get();

        // Ajout dyal 'candidat.profil' bach n9edrou njibou les infos dyal helper
        $sent = Candidature::where('candidat_id', $user->id)
            ->with(['post.user.profil', 'candidat.profil'])
            ->latest()
            ->get();

        // Fonction bach t'formater les coordonnees
        $appendCoordonnees = function ($candidature) {
            if ($candidature->statut === 'accepte') {
                $candidature->coordonnees = [
                    'helper' => [
                        'name'      => $candidature->candidat->name ?? null,
                        'email'     => $candidature->candidat->email ?? null,
                        'telephone' => $candidature->candidat->profil->telephone ?? null,
                    ],
                    'demandeur' => [
                        'name'      => $candidature->post->user->name ?? null,
                        'email'     => $candidature->post->user->email ?? null,
                        'telephone' => $candidature->post->user->profil->telephone ?? null,
                    ],
                ];
            }
            return $candidature;
        };

        return response()->json([
            'success' => true,
            'received' => $received->map($appendCoordonnees),
            'sent' => $sent->map($appendCoordonnees),
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

        $response = [
            'success'     => true,
            'message'     => 'Statut de la candidature mis à jour avec succès !',
            'candidature' => $candidature->fresh(),
        ];
        $response['coordonnees'] = [
            'helper' => [
            'name'      => $candidature->candidat->name,
            'email'     => $candidature->candidat->email,
            'telephone' => $candidature->candidat->profil->telephone ?? null,
        ],
        'demandeur' => [
            'name'      => $candidature->post->user->name,
            'email'     => $candidature->post->user->email,
            'telephone' => $candidature->post->user->profil->telephone ?? null,
        ],
        ];
        
        return response()->json($response, 200);
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
