<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;


class AuthController extends Controller
{
    public function register(Request $request){
        $request->validate([
            'name'=> 'required|string|max:255',
            'email'=> 'email|required|string|max:255|unique:users',
            'password'=> 'required|string|min:8|confirmed',

        ]);

        $user = User::create([
            'name'=>$request->name,
            'email'=>$request->email,
            'password'=>bcrypt($request->password),
        ]);
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'user'=> $user,
            'token'=> $token,
        ],201);
    }
}