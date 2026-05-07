<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use App\Models\Evaluation;
use App\Models\Candidature;
use Illuminate\Database\Seeder;

class EvaluationSeeder extends Seeder
{
    public function run(): void
    {
        $posts = Post::where('statut', 'en_cours')->get();

        foreach ($posts as $post) {
            $acceptedCandidature = Candidature::where('post_id', $post->id)
                ->where('statut', 'accepte')
                ->first();

            if ($acceptedCandidature) {
                // The student reviews the helper
                Evaluation::create([
                    'reviewer_id' => $post->user_id,
                    'reviewed_id' => $acceptedCandidature->candidat_id,
                    'post_id' => $post->id,
                    'note' => 5,
                    'commentaire' => 'Excellent travail, très rapide et compétent.',
                ]);

                // The helper reviews the student (optional, but let's add it)
                Evaluation::create([
                    'reviewer_id' => $acceptedCandidature->candidat_id,
                    'reviewed_id' => $post->user_id,
                    'post_id' => $post->id,
                    'note' => 4,
                    'commentaire' => 'Bonne communication, projet intéressant.',
                ]);
            }
        }
    }
}
