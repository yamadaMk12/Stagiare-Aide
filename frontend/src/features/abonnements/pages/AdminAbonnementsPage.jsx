import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Check, X, Loader2, ShieldCheck } from 'lucide-react';
import {
  useAdminAbonnements,
  useValidateAbonnement,
  useRejectAbonnement,
} from '../hooks/useAbonnement';

/** Map a subscription status to a Badge variant + label. */
const STATUT_BADGE = {
  en_attente: { variant: 'warning', label: 'En attente' },
  actif: { variant: 'success', label: 'Actif' },
  expire: { variant: 'secondary', label: 'Expiré' },
  annule: { variant: 'danger', label: 'Annulé' },
};

const PLAN_LABEL = { gratuit: 'Free', premium: 'Premium', entreprise: 'Max' };
const CYCLE_LABEL = { mensuel: 'Mensuel', annuel: 'Annuel' };

const AdminAbonnementsPage = () => {
  // Read the logged-in user from localStorage (stored at login).
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = currentUser?.role === 'admin';

  const { data: abonnements, isLoading, isError } = useAdminAbonnements();
  const { mutate: validate, isPending: isValidating, variables: validatingId } = useValidateAbonnement();
  const { mutate: reject, isPending: isRejecting, variables: rejectingId } = useRejectAbonnement();

  // Guard: only admins may see this page.
  if (!isAdmin) {
    return <Navigate to="/feed" replace />;
  }

  return (
    <MainLayout>
      <div className="bg-secondary-50/50 min-h-[calc(100vh-64px)]">
        <div className="container-custom py-10">

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
              <ShieldCheck size={22} className="text-primary-600" /> Gestion des abonnements
            </h1>
            <p className="text-sm text-secondary-500">Validez ou rejetez les demandes d'abonnement.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Demandes & abonnements</CardTitle>
            </CardHeader>
            <CardContent>

              {isLoading && (
                <div className="flex items-center justify-center py-12 text-secondary-400">
                  <Loader2 size={24} className="animate-spin mr-2" /> Chargement...
                </div>
              )}

              {isError && (
                <p className="py-8 text-center text-sm text-red-500">Erreur lors du chargement.</p>
              )}

              {!isLoading && abonnements?.length === 0 && (
                <p className="py-12 text-center text-sm text-secondary-400">Aucun abonnement pour le moment.</p>
              )}

              {!isLoading && abonnements?.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-secondary-100 text-left text-xs uppercase text-secondary-400">
                        <th className="py-3 px-3 font-semibold">Utilisateur</th>
                        <th className="py-3 px-3 font-semibold">Plan</th>
                        <th className="py-3 px-3 font-semibold">Cycle</th>
                        <th className="py-3 px-3 font-semibold">Statut</th>
                        <th className="py-3 px-3 font-semibold">Début</th>
                        <th className="py-3 px-3 font-semibold">Fin</th>
                        <th className="py-3 px-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {abonnements.map((ab) => {
                        const badge = STATUT_BADGE[ab.statut] ?? { variant: 'secondary', label: ab.statut };
                        const isRowBusy =
                          (isValidating && validatingId === ab.id) || (isRejecting && rejectingId === ab.id);

                        return (
                          <tr key={ab.id} className="border-b border-secondary-50 hover:bg-secondary-50/50">
                            <td className="py-3 px-3">
                              <div className="font-semibold text-secondary-800">{ab.user?.name ?? '—'}</div>
                              <div className="text-xs text-secondary-400">{ab.user?.email}</div>
                            </td>
                            <td className="py-3 px-3 font-medium text-secondary-700">
                              {PLAN_LABEL[ab.plan] ?? ab.plan}
                            </td>
                            <td className="py-3 px-3 text-secondary-500">
                              {CYCLE_LABEL[ab.cycle] ?? '—'}
                            </td>
                            <td className="py-3 px-3">
                              <Badge variant={badge.variant}>{badge.label}</Badge>
                            </td>
                            <td className="py-3 px-3 text-secondary-500">{ab.date_debut ?? '—'}</td>
                            <td className="py-3 px-3 text-secondary-500">{ab.date_fin ?? '—'}</td>
                            <td className="py-3 px-3">
                              {ab.statut === 'en_attente' ? (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    className="gap-1"
                                    disabled={isRowBusy}
                                    onClick={() => validate(ab.id)}
                                  >
                                    {isValidating && validatingId === ab.id ? (
                                      <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                      <Check size={14} />
                                    )}
                                    Valider
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    className="gap-1"
                                    disabled={isRowBusy}
                                    onClick={() => reject(ab.id)}
                                  >
                                    <X size={14} /> Rejeter
                                  </Button>
                                </div>
                              ) : (
                                <span className="block text-right text-xs text-secondary-300">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            </CardContent>
          </Card>

        </div>
      </div>
    </MainLayout>
  );
};

export default AdminAbonnementsPage;
