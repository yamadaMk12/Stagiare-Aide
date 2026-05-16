<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use App\Models\Technology;
use App\Models\Candidature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function getUserStats(Request $request)
    {
        $user = $request->user();

        // Demandes: Number of posts created by the user
        $demandesCount = Post::where('user_id', $user->id)->count();

        // Aides: Number of accepted candidatures by the user
        $aidesCount = Candidature::where('candidat_id', $user->id)
            ->where('statut', 'accepte')
            ->count();

        return response()->json([
            'demandes' => $demandesCount,
            'aides' => $aidesCount,
            'user' => $user->load('profil')
        ]);
    }

    public function getTrendingTechnologies()
    {
        $technologies = Technology::withCount(['posts' => function($query) {
                $query->where('statut', '!=', 'ferme');
            }])
            ->orderBy('posts_count', 'desc')
            ->limit(5)
            ->get();

        return response()->json($technologies);
    }

    public function getTopHelpers()
    {
        $topHelpers = User::withCount(['candidatures' => function($query) {
                $query->where('statut', 'accepte');
            }])
            ->with('profil')
            ->orderBy('candidatures_count', 'desc')
            ->limit(3)
            ->get();

        return response()->json($topHelpers);
    }
}
