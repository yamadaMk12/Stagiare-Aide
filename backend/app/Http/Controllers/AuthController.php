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


    public function login(Request $request){
        $request->validate([
            'email'=> 'email|required|string|max:255',
            'password'=>'required|min:8',
        ]);

        if(!Auth::attempt($request->only('email','password'))){
            return response()->json([
                'message'=>'Invalid login details'
            ],401);
        };
        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'user' => $user,
            'token'=> $token,
        ]);
    }
    // on a suppriemer juste token dyal lelement dyalna 
    public function logout(Request $request)
    {
    // hna kayna lkhdma dyal sunctum katjib token mn react okatverifier wax kayn (->user()) odak sa3a katms7o 
    $request->user()->currentAccessToken()->delete();

    
    return response()->json([
        'message' => 'Deconnecter avec succees'
    ]);
}




}
