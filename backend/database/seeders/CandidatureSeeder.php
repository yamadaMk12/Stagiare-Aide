<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use App\Models\Candidature;
use Illuminate\Database\Seeder;

class CandidatureSeeder extends Seeder
{
    public function run(): void
    {
        $posts = Post::all();
        $helpers = User::where('role', 'formateur')->get();

        if ($posts->isEmpty() || $helpers->isEmpty()) {
            return;
        }

        foreach ($posts as $post) {
            // Each post gets 1 or 2 candidatures
            $selectedHelpers = $helpers->random(min(2, $helpers->count()));

            foreach ($selectedHelpers as $helper) {
                Candidature::create([
                    'post_id' => $post->id,
                    'candidat_id' => $helper->id,
                    'message' => 'Bonjour, je suis disponible pour vous aider sur ce projet. J\'ai les compétences nécessaires.',
                    'statut' => $post->statut === 'en_cours' ? 'accepte' : 'en_attente',
                ]);
            }
        }
    }
}
