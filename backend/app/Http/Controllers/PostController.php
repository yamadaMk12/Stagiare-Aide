<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        return response()->json(
            Post::with(['user:id,name', 'user.profil:user_id,filiere'])
                ->where('statut', 'ouvert')
                ->latest()
                ->paginate(15)
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre'       => 'required|string|max:255',
            'description' => 'required|string',
            'prix'        => 'required|numeric|min:0',
            'statut'      => 'required|in:ouvert,en_cours,ferme',
        ]);

        $post = Post::create([
            'user_id'     => $request->user()->id,
            'titre'       => $request->titre,
            'description' => $request->description,
            'prix'        => $request->prix,
            'statut'      => $request->statut,
        ]);

        return response()->json(['success' => true, 'data' => $post], 201);
    }
}