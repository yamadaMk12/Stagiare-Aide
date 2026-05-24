<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EvaluationController extends Controller
{
    /**
     * Store a newly created evaluation in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'reviewed_id' => 'required|exists:users,id',
            'note' => 'required|integer|min:1|max:5',
            'commentaire' => 'nullable|string',
        ]);

        // Prevent self-evaluation
        if (Auth::id() === $request->reviewed_id) {
            return response()->json(['message' => 'You cannot evaluate yourself.'], 403);
        }

        // Create the evaluation
        $evaluation = Evaluation::create([
            'reviewer_id' => Auth::id(),
            'reviewed_id' => $request->reviewed_id,
            'post_id' => $request->post_id,
            'note' => $request->note,
            'commentaire' => $request->commentaire,
        ]);

        return response()->json($evaluation->load('reviewer'), 201);
    }

    /**
     * Display evaluations for a specific user.
     */
    public function index($userId)
    {
        $receivedEvaluations = Evaluation::with('reviewer.profil')
            ->where('reviewed_id', $userId)
            ->latest()
            ->get();

        $sentEvaluations = Evaluation::with('reviewed.profil')
            ->where('reviewer_id', $userId)
            ->latest()
            ->get();

        $averageRating = $receivedEvaluations->avg('note');

        return response()->json([
            'evaluations' => $receivedEvaluations,
            'sent_evaluations' => $sentEvaluations,
            'average_rating' => round($averageRating, 1),
            'total_evaluations' => $receivedEvaluations->count()
        ]);
    }
}
