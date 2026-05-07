<?php

namespace Database\Seeders;

use App\Models\Technology;
use Illuminate\Database\Seeder;

class TechnologySeeder extends Seeder
{
    public function run(): void
    {
        $technologies = [
            'Laravel',
            'React',
            'Vue.js',
            'Tailwind CSS',
            'Bootstrap',
            'PostgreSQL',
            'MySQL',
            'Redis',
            'AWS',
            'Firebase',
        ];

        foreach ($technologies as $name) {
            Technology::create(['name' => $name]);
        }
    }
}
