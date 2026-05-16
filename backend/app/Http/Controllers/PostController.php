<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $posts = Post::with(['user:id,name', 'user.profil:user_id,filiere', 'images', 'technologies'])
            ->where('statut', 'ouvert')
            ->when($request->filiere, function ($q, $v) {
                return $q->whereHas('user.profil', function ($q) use ($v) {
                    $q->where('filiere', $v);
                });
            })
            ->when($request->technologie, function ($q, $v) {
                return $q->whereHas('technologies', function ($q) use ($v) {
                    $q->where('name', $v);
                });
            })
            ->latest()
            ->paginate(15);

        return \App\Http\Resources\PostResource::collection($posts);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre'       => 'required|string|max:255',
            'description' => 'required|string',
            'prix'        => 'required|numeric|min:0',
            'statut'      => 'required|in:ouvert,en_cours,ferme',
            'images'      => 'nullable|array',
            'images.*'    => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'technologies'=> 'nullable|array',
            'technologies.*' => 'exists:technologies,id',
        ]);

        $post = Post::create([
            'user_id'     => $request->user()->id,
            'titre'       => $request->titre,
            'description' => $request->description,
            'prix'        => $request->prix,
            'statut'      => $request->statut,
        ]);

        // images upload
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('posts', 'public');
                $post->images()->create(['path' => $path]);
            }
        }

        // attach technologies (correct pivot usage)
        if ($request->has('technologies')) {
            $post->technologies()->attach($request->technologies);
        }

        return response()->json([
            'success' => true,
            'data' => $post->load(['images', 'technologies'])
        ], 201);
    }

    public function show(Post $post)
    {
        return new \App\Http\Resources\PostResource(
            $post->load(['user:id,name', 'user.profil:user_id,filiere', 'images', 'technologies'])
        );
    }

    public function search(Request $request)
    {
        $query = $request->get('q');

        $posts = Post::with(['user:id,name', 'user.profil:user_id,filiere', 'images', 'technologies'])
            ->where('statut', 'ouvert')
            ->where(function ($q) use ($query) {
                $q->where('titre', 'LIKE', "%{$query}%")
                  ->orWhere('description', 'LIKE', "%{$query}%");
            })
            ->latest()
            ->paginate(15);

        return \App\Http\Resources\PostResource::collection($posts);
    }
}