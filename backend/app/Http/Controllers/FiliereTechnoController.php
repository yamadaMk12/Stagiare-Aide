<?php

namespace App\Http\Controllers;

use App\Models\Profil;
use App\Models\Technology;

class FiliereTechController extends Controller
{
    public function filieres()
    {
        $filieres = Profil::distinct()->pluck('filiere');
        return response()->json(['filieres' => $filieres]);
    }

    public function technologies()
    {
        $technologies = Technology::select('id', 'nom')->get();
        return response()->json(['technologies' => $technologies]);
    }
}