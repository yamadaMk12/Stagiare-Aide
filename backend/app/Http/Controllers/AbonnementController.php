<?php

namespace App\Http\Controllers;

use App\Models\Abonnement;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AbonnementController extends Controller
{
    /** Number of demandes a free user is allowed to create. */
    private const FREE_POST_LIMIT = 3;

    /**
     * Return the current user's subscription state:
     * active plan, pending request, post count and remaining free posts.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $active = $user->abonnements()
            ->where('statut', 'actif')
            ->whereIn('plan', ['premium', 'entreprise'])
            ->latest()
            ->first();

        $pending = $user->abonnements()
            ->where('statut', 'en_attente')
            ->latest()
            ->first();

        $postsCount = $user->posts()->count();

        return response()->json([
            'plan'          => $active ? $active->plan : 'gratuit',
            'active'        => $active,
            'pending'       => $pending,
            'posts_count'   => $postsCount,
            'post_limit'    => self::FREE_POST_LIMIT,
            'is_unlimited'  => (bool) $active,
            'can_create'    => $active ? true : $postsCount < self::FREE_POST_LIMIT,
        ]);
    }

    /**
     * Submit a subscription request. It stays 'en_attente' until an
     * admin validates the payment manually.
     */
    public function subscribe(Request $request)
    {
        $request->validate([
            'plan'  => 'required|in:premium,entreprise',
            'cycle' => 'required|in:mensuel,annuel',
        ]);

        $user = $request->user();

        // Block a second request while one is already pending.
        $alreadyPending = $user->abonnements()->where('statut', 'en_attente')->exists();
        if ($alreadyPending) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà une demande d\'abonnement en attente de validation.',
            ], 422);
        }

        $abonnement = Abonnement::create([
            'user_id'    => $user->id,
            'plan'       => $request->plan,
            'cycle'      => $request->cycle,
            'date_debut' => Carbon::now()->toDateString(),
            'date_fin'   => null,
            'statut'     => 'en_attente',
        ]);

        return response()->json([
            'success'     => true,
            'message'     => 'Votre demande d\'abonnement a été envoyée. Elle sera validée après confirmation du paiement.',
            'abonnement'  => $abonnement,
        ], 201);
    }

    /**
     * List every subscription for the admin dashboard (pending first).
     */
    public function adminIndex(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        $abonnements = Abonnement::with('user:id,name,email')
            ->orderByRaw("FIELD(statut, 'en_attente', 'actif', 'expire', 'annule')")
            ->latest()
            ->get();

        return response()->json($abonnements);
    }

    /**
     * Validate a pending subscription: activate it for one month.
     */
    public function validateAbonnement(Request $request, int $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        $abonnement = Abonnement::findOrFail($id);

        // Yearly subscribers get a full year, monthly get one month.
        $dateFin = $abonnement->cycle === 'annuel'
            ? Carbon::now()->addYear()
            : Carbon::now()->addMonth();

        $abonnement->update([
            'statut'     => 'actif',
            'date_debut' => Carbon::now()->toDateString(),
            'date_fin'   => $dateFin->toDateString(),
        ]);

        return response()->json([
            'success'    => true,
            'message'    => 'Abonnement validé et activé.',
            'abonnement' => $abonnement->fresh(),
        ]);
    }

    /**
     * Reject / cancel a subscription request.
     */
    public function reject(Request $request, int $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        $abonnement = Abonnement::findOrFail($id);

        $abonnement->update(['statut' => 'annule']);

        return response()->json([
            'success'    => true,
            'message'    => 'Demande d\'abonnement rejetée.',
            'abonnement' => $abonnement->fresh(),
        ]);
    }
}
