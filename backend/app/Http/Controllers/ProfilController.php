<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProfilController extends Controller
{

    /**
     * Update the authenticated user's profile.
     */
    public function update(Request $request)
    {
        $user = $request->user();
        $profil = $user->profil;

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'filiere' => ['nullable', 'string', 'max:255'],
            'annee' => ['nullable', 'in:1,2,3'],
            'phone' => ['nullable', 'string', 'max:20'],
            'bio' => ['nullable', 'string'],
            'disponibilite' => ['sometimes', 'boolean'],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);

        // Update User info
        $user->update($request->only(['name', 'email']));

        // Handle Avatar Upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($profil->avatar) {
                Storage::disk('public')->delete($profil->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar'] = $path;
        }

        // Update Profil info
        $profil->update($validated);

        return response()->json([
            'message' => 'Profil mis à jour avec succès.',
            'user' => $user->load('profil'),
        ]);
    }
      
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
