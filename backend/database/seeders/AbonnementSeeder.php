<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Abonnement;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AbonnementSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            // Give everyone a free plan by default
            Abonnement::create([
                'user_id' => $user->id,
                'plan' => 'gratuit',
                'date_debut' => Carbon::now()->subMonths(1),
                'date_fin' => null,
                'statut' => 'actif',
            ]);

            // Give the admin and some users a premium plan
            if ($user->role === 'admin' || rand(0, 1)) {
                Abonnement::create([
                    'user_id' => $user->id,
                    'plan' => 'premium',
                    'date_debut' => Carbon::now(),
                    'date_fin' => Carbon::now()->addYear(),
                    'statut' => 'actif',
                ]);
            }
        }
    }
}
