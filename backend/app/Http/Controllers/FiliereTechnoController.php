<?php

namespace App\Http\Controllers;

use App\Models\Filiere;
use App\Models\Technology;

class FiliereTechnoController extends Controller
{
    public function filieres()
    {
        $filieres = Filiere::pluck('name');
        return response()->json(['filieres' => $filieres]);
    }

    public function technologies()
    {
        $technologies = Technology::select('id', 'name')->get();
        return response()->json(['technologies' => $technologies]);
    }
}