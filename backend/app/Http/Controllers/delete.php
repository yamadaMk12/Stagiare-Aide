<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use Illuminate\Support\Facades\Auth;

class delete extends Controller
{
    public function destroy($id)
    {
        $candidature = Candidature::find($id);

        if (!$candidature) {
            return response()->json(['message' => 'Introuvable'], 404);
        }

        if ($candidature->candidat_id !== Auth::id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $candidature->delete();

        return response()->json(['success' => true, 'message' => 'Supprimé !']);
    }
}