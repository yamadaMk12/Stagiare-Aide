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
        $profil = $user->profil ?: $user->profil()->create();

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'filiere' => ['nullable', 'string', 'max:255'],
            'annee' => ['nullable', 'in:1,2,3'],
            'phone' => ['nullable', 'string', 'max:20'],
            'bio' => ['nullable', 'string'],
            'disponibilite' => ['sometimes', 'boolean'],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
        ]);

        // Update User info
        $user->update($request->only(['name', 'email'])); // only z3ma 3tini rir name w email mn had request  

        // Handle Avatar Upload
        // hasfile wax had element wax kayn + wax howa file 
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($profil->avatar) {
                Storage::disk('public')->delete($profil->avatar); // kanm7iw tswira mn dossier likankhazno fih tasawar 
            }
            $path = $request->file('avatar')->store('avatars', 'public'); //genere wa7d l path liraddi it7aato fih tsawar hanya f local olo7o l database 
            $validated['avatar'] = $path;
        }

        // Update Profil info
        $profil->update($validated);

        return response()->json([
            'message' => 'Profil mis à jour avec succès.',
            'user' => $user->load('profil'), // load z3ma jib user w l profile dyaalo 
        ]);
    }
      
    public function updateCompetences(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'competence_ids' => ['present', 'array'],
            'competence_ids.*' => ['exists:competences,id'],
        ]);

        $user->competences()->sync($validated['competence_ids']); 
        // sync 3aandk table fih 1 2 3 jiti nta odrti sync 1 2 4 5  howa hnaya raddi raykhali 1 2  orayzid 4 5 w ymsa7 3

        return response()->json([
            'message' => 'Compétences mises à jour avec succès.',
            'competences' => $user->competences,
        ]);
    }
}
