<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use App\Models\Technology;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'etudiant')->get();
        $technologies = Technology::all();

        if ($users->isEmpty()) {
            return;
        }

        $posts = [
            [
                'titre' => 'Besoin d\'aide pour un projet Laravel',
                'description' => 'Je bloque sur les relations Eloquent et les politiques d\'accès. J\'ai besoin de quelqu\'un pour m\'expliquer comment structurer mes modèles.',
                'prix' => 150.00,
                'statut' => 'ouvert',
            ],
            [
                'titre' => 'Correction bug React',
                'description' => 'Un problème de rendu infini avec useEffect dans un composant de dashboard complexe.',
                'prix' => 100.00,
                'statut' => 'en_cours',
            ],
            [
                'titre' => 'Intégration maquette Figma',
                'description' => 'Besoin d\'intégrer une page de landing responsive avec Tailwind CSS.',
                'prix' => 200.00,
                'statut' => 'ouvert',
            ],
        ];

        foreach ($posts as $postData) {
            $user = $users->random();
            $post = Post::create(array_merge($postData, ['user_id' => $user->id]));

            // Add images
            $post->images()->createMany([
                ['path' => 'posts/sample1.jpg'],
                ['path' => 'posts/sample2.jpg'],
            ]);

            // Add technologies
            if ($technologies->isNotEmpty()) {
                $post->technologies()->attach(
                    $technologies->random(rand(1, 3))->pluck('id')->toArray()
                );
            }
        }
    }
}
