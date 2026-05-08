<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfilController extends Controller
{
    /**
     * Update the authenticated user's competencies.
     */
    public function updateCompetences(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'competence_ids' => ['required', 'array'],
            'competence_ids.*' => ['exists:competences,id'],
        ]);

        $user->competences()->sync($validated['competence_ids']);

        return response()->json([
            'message' => 'Compétences mises à jour avec succès.',
            'competences' => $user->competences,
        ]);
    }
}
