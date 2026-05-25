import React, { useState } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import Button from '../../../components/ui/Button';
import { Check, Loader2, Clock, Star } from 'lucide-react';
import { useMyAbonnement, useSubscribe } from '../hooks/useAbonnement';

const WHATSAPP_NUMBER = '212618304016';
const YEARLY_DISCOUNT = 0.2; // 20% off when billed yearly

/**
 * Plans. `key` maps to the backend enum (gratuit / premium / entreprise).
 * `monthly` is the monthly price in MAD. The yearly price is derived (-20%).
 * `includes` shows the "Tout le plan X" line; `features` are the additions.
 */
const PLANS = [
  {
    key: 'gratuit',
    name: 'Free',
    monthly: 0,
    tagline: 'Pour commencer.',
    includes: null,
    features: ['Jusqu\'à 3 demandes / post'],
  },
  {
    key: 'premium',
    name: 'Premium',
    monthly: 49,
    featured: true,
    tagline: 'Pour publier sans limite.',
    includes: 'Free',
    features: ['Demandes / post illimitées', 'Profil public & évaluations', 'Priorité'],
  },
  {
    key: 'entreprise',
    name: 'Max',
    monthly: 99,
    tagline: 'Pour aller plus loin.',
    includes: 'Premium',
    features: ['Badge vérifié', 'Priorité n°1', 'Support 24h/24'],
  },
];

const yearlyPrice = (monthly) => Math.round(monthly * 12 * (1 - YEARLY_DISCOUNT));

const FAQ = [
  { q: 'Que comprend le plan gratuit ?', a: 'Tu peux publier jusqu\'à 3 demandes. Au-delà, il faut passer à un plan payant.' },
  { q: 'Comment se passe le paiement ?', a: 'En cliquant sur un plan, tu es redirigé vers WhatsApp pour finaliser le paiement. Un administrateur valide ensuite ton abonnement.' },
  { q: 'Quelle différence entre mensuel et annuel ?', a: 'L\'abonnement annuel te fait économiser 20% par rapport au tarif mensuel.' },
];

const AbonnementPage = () => {
  const [billing, setBilling] = useState('mensuel'); // 'mensuel' | 'annuel'

  const { data: abonnement, isLoading } = useMyAbonnement();
  const { mutate: subscribe, isPending } = useSubscribe();

  const currentPlan = abonnement?.plan ?? 'gratuit';
  const pending = abonnement?.pending;
  const postsCount = abonnement?.posts_count;

  /** Open WhatsApp with a message describing the chosen plan + cycle. */
  const openWhatsApp = (plan) => {
    const price = billing === 'annuel' ? yearlyPrice(plan.monthly) : plan.monthly;
    const period = billing === 'annuel' ? 'an' : 'mois';
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const who = user?.name ? `${user.name} (${user.email})` : 'un utilisateur';
    const message = `Bonjour, je suis ${who}. Je souhaite souscrire au plan ${plan.name} — facturation ${billing} : ${price} MAD/${period} sur StagiaireAide.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  /** Record the pending request, then redirect to WhatsApp for payment. */
  const handleSubscribe = (plan) => {
    subscribe(
      { plan: plan.key, cycle: billing },
      {
        onSuccess: () => openWhatsApp(plan),
        // Already-pending (422): still let the user message us to follow up.
        onError: (err) => {
          if (err?.response?.status === 422) openWhatsApp(plan);
        },
      }
    );
  };

  return (
    <MainLayout>
      <div className="bg-secondary-50/50 min-h-[calc(100vh-64px)]">
        <div className="container-custom py-14">

          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3">Abonnement</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-secondary-900 max-w-xl mx-auto mb-3">
              Publie autant de demandes que tu veux.
            </h1>
            <p className="text-secondary-500 max-w-md mx-auto">
              Le plan gratuit te permet de poster 3 demandes. Passe au payant pour des demandes illimitées.
            </p>
          </div>

          {/* Billing toggle */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center rounded-full border border-secondary-200 bg-white p-1">
              <button
                onClick={() => setBilling('mensuel')}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  billing === 'mensuel' ? 'bg-primary-600 text-white' : 'text-secondary-500 hover:text-secondary-700'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBilling('annuel')}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  billing === 'annuel' ? 'bg-primary-600 text-white' : 'text-secondary-500 hover:text-secondary-700'
                }`}
              >
                Annuel
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  billing === 'annuel' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'
                }`}>
                  -20%
                </span>
              </button>
            </div>
          </div>

          {/* Pending banner */}
          {pending && (
            <div className="max-w-2xl mx-auto mb-8 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              <Clock size={18} />
              Votre demande d'abonnement est en attente de validation par un administrateur.
            </div>
          )}

          {/* Plan cards */}
          <div className="grid gap-5 md:grid-cols-3 max-w-5xl mx-auto">
            {PLANS.map((plan) => {
              const isCurrent = currentPlan === plan.key;
              const isFree = plan.monthly === 0;
              const price = billing === 'annuel' ? yearlyPrice(plan.monthly) : plan.monthly;
              const period = billing === 'annuel' ? '/ an' : '/ mois';

              return (
                <div
                  key={plan.key}
                  className={`relative rounded-2xl border p-7 flex flex-col ${
                    plan.featured
                      ? 'border-primary-500 bg-primary-600 text-white shadow-soft-lg'
                      : 'border-secondary-100 bg-white'
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold text-white whitespace-nowrap">
                      <Star size={12} /> Populaire
                    </div>
                  )}

                  <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${plan.featured ? 'text-white/60' : 'text-secondary-400'}`}>
                    {plan.name}
                  </p>
                  <p className={`text-sm mb-4 ${plan.featured ? 'text-white/70' : 'text-secondary-500'}`}>
                    {plan.tagline}
                  </p>

                  <div className="mb-6">
                    <span className="text-3xl font-extrabold">{price}</span>
                    <span className={`text-sm font-bold ${plan.featured ? 'text-white/80' : 'text-secondary-500'}`}> MAD</span>
                    {!isFree && (
                      <span className={`text-sm font-medium ${plan.featured ? 'text-white/60' : 'text-secondary-400'}`}> {period}</span>
                    )}
                  </div>

                  <div className={`border-t pt-5 mb-6 space-y-3 flex-1 ${plan.featured ? 'border-white/15' : 'border-secondary-100'}`}>
                    {plan.includes && (
                      <p className={`text-xs font-semibold ${plan.featured ? 'text-white/80' : 'text-secondary-600'}`}>
                        Tout le plan {plan.includes}, et en plus :
                      </p>
                    )}
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm">
                        <Check size={16} className={plan.featured ? 'text-white' : 'text-primary-600'} />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action button */}
                  {isCurrent ? (
                    <Button variant={plan.featured ? 'secondary' : 'outline'} className="w-full" disabled>
                      {isFree && typeof postsCount === 'number'
                        ? `Plan actuel · ${postsCount}/3`
                        : 'Plan actuel'}
                    </Button>
                  ) : isFree ? (
                    <Button variant="outline" className="w-full" disabled>
                      Inclus par défaut
                    </Button>
                  ) : (
                    <Button
                      variant={plan.featured ? 'secondary' : 'primary'}
                      className="w-full gap-2"
                      disabled={isPending || !!pending}
                      onClick={() => handleSubscribe(plan)}
                    >
                      {isPending ? (
                        <><Loader2 size={16} className="animate-spin" /> Redirection...</>
                      ) : pending ? (
                        'Demande en attente'
                      ) : (
                        `Choisir ${plan.name}`
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Loading current plan */}
          {isLoading && (
            <p className="text-center text-xs text-secondary-400 mt-6 flex items-center justify-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Chargement de votre abonnement...
            </p>
          )}

          {/* FAQ */}
          <div className="max-w-xl mx-auto mt-16">
            <h2 className="text-lg font-extrabold text-center text-secondary-900 mb-6">Questions fréquentes</h2>
            <div className="space-y-5">
              {FAQ.map((item) => (
                <div key={item.q} className="border-b border-secondary-100 pb-4">
                  <p className="font-semibold text-secondary-800 mb-1">{item.q}</p>
                  <p className="text-sm text-secondary-500">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default AbonnementPage;
