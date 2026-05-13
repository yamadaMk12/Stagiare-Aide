<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    // explication syntax: --------------------------------------@fouad
    // chof lindex katjiblk les posts b 2 dyaal les methodes ya2ima tjiblk gaaaa3 les post ofhaad l7aala rankono jbna les post bla filtrage 
    // l7ala tanya hyaa njibo les posts wlakin bl filtrage 
    // so 3iwad 7naya njibo gaa3 les posts bmethodes  oles post bl filtrage b methodes akhra 7naa kanjibo les posts bmesthode w7da olikisahl 3lin aslaan lkhdma f react 
    // -------------------------------------------------------@endfouad

    public function index(Request $request)
    {
        return response()->json(
        Post::with(['user:id,name', 'user.profil:user_id,filiere']) 
            ->where('statut', 'ouvert')
            ->when($request->filiere, fn($q, $v) => $q->whereHas('user.profil', fn($q) => $q->where('filiere', $v)))
            ->when($request->technologie, fn($q, $v) => $q->whereHas('technologies', fn($q) => $q->where('nom', $v)))            
            ->latest()
            ->paginate(15)
    );
    }
    
    // explication syntax: --------------------------------------@fouad
    // dik id,name z3maa jiblya id w name mn user b7aal fax kadiir select id , name from .... 
    // bnisba l user.profile hadi katsawi join tanya likadir f request maalan nta drti select ... from post join user on ... join profile on .... 7it profile may9darx itjoni m3aa post nixan khassk tjoini user m3aa lpost odak sa3a tjoinih m3aa profile   
    // when awl elemnt tmaa howa condition ida kan true raymxi ldak arrowfunction (fn) $q howa query builder dyal post w $v howa lvalue li jaya mn request yani filiere aw technologie
    // wherhas katsawi where X exists( select ...... ) hnaya jat b ma3na khasni post li 3andu user profil dyalou fih filiere li dyalo $v 
    // latest katdir order by created_at desc  ------------------@endfouad
    
    public function store(Request $request)
    {
        $request->validate([
            'titre'       => 'required|string|max:255',
            'description' => 'required|string',
            'prix'        => 'required|numeric|min:0',
            'statut'      => 'required|in:ouvert,en_cours,ferme',
        ]);

        $post = Post::create([
            'user_id'     => $request->user()->id,
            'titre'       => $request->titre,
            'description' => $request->description,
            'prix'        => $request->prix,
            'statut'      => $request->statut,
        ]);
        // ranzido f pivote table bach ndiro relation lbin lpost oles technologies dyaalo
        $post->technologies()->attach($request->technologies_ids);

        return response()->json(['success' => true, 'data' => $post], 201);
    }
}