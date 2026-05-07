<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Profil;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);
        $admin->profil()->create([
            'phone' => '0123456789',
            'bio' => 'I am the administrator.',
        ]);

        // Student 1
        $student1 = User::create([
            'name' => 'Etudiant Un',
            'email' => 'student1@example.com',
            'password' => Hash::make('password'),
            'role' => 'etudiant',
        ]);
        $student1->profil()->create([
            'filiere' => 'Informatique',
            'annee' => '2',
            'phone' => '0666112233',
            'bio' => 'Etudiant en 2ème année informatique.',
            'disponibilite' => true,
        ]);

        // Formateur 1
        $formateur1 = User::create([
            'name' => 'Formateur Un',
            'email' => 'formateur1@example.com',
            'password' => Hash::make('password'),
            'role' => 'formateur',
        ]);
        $formateur1->profil()->create([
            'filiere' => 'Design',
            'phone' => '0777554433',
            'bio' => 'Formateur expert en design UI/UX.',
            'disponibilite' => false,
        ]);
    }
}
