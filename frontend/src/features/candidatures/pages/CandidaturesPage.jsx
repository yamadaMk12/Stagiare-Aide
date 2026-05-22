import React, { useState } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useCandidatures, useUpdateCandidatureStatut } from '../hooks/useCandidatures';
import { Card, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Avatar from '../../../components/ui/Avatar';
import EmptyState from '../../../components/ui/EmptyState';
import Alert from '../../../components/ui/Alert';
import Spinner from '../../../components/ui/Spinner';
import { Check, X, Inbox, Send, MessageSquare, Briefcase, Calendar, Clock } from 'lucide-react';

const formatRelativeTime = (isoDate) => {
  const diff = Math.floor((Date.now() - new Date(isoDate)) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
  return `Il y a ${Math.floor(diff / 86400)}j`;
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 604800) {
    return formatRelativeTime(isoDate);
  }
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const CandidaturesPage = () => {
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  const { data, isLoading, isError, error } = useCandidatures();
  const updateStatutMutation = useUpdateCandidatureStatut();

  const handleDecision = async (id, statut) => {
    try {
      await updateStatutMutation.mutateAsync({ id, statut });
    } catch (err) {
      console.error("Decision error:", err);
    }
  };

  const receivedList = data?.received || [];
  const sentList = data?.sent || [];

  // Count pending received candidatures for a notification badge
  const pendingReceivedCount = receivedList.filter(c => c.statut === 'en_attente').length;

  const renderStatusBadge = (statut) => {
    switch (statut) {
      case 'accepte':
        return <Badge variant="success">Acceptée</Badge>;
      case 'refuse':
        return <Badge variant="danger">Refusée</Badge>;
      case 'en_attente':
      default:
        return <Badge variant="warning">En attente</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="bg-secondary-50/50 min-h-[calc(100vh-64px)] py-8">
        <div className="container-custom max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Candidatures</h1>
            <p className="text-secondary-500 mt-1">
              Gérez les demandes d'aide reçues et suivez le statut de vos candidatures envoyées.
            </p>
          </div>

          {/* Alert messages for mutation results */}
          {updateStatutMutation.isError && (
            <Alert variant="danger" className="mb-6">
              {updateStatutMutation.error?.response?.data?.message || "Une erreur est survenue lors de l'enregistrement de votre décision."}
            </Alert>
          )}

          {updateStatutMutation.isSuccess && (
            <Alert variant="success" className="mb-6">
              Votre décision a été enregistrée avec succès !
            </Alert>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-secondary-200 mb-6 gap-6">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'received'
                  ? 'border-primary-600 text-primary-600 font-bold'
                  : 'border-transparent text-secondary-500 hover:text-secondary-900'
              }`}
            >
              <Inbox size={18} />
              Candidatures reçues
              {pendingReceivedCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-primary-100 text-primary-600 animate-pulse">
                  {pendingReceivedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('sent')}
              className={`flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'sent'
                  ? 'border-primary-600 text-primary-600 font-bold'
                  : 'border-transparent text-secondary-500 hover:text-secondary-900'
              }`}
            >
              <Send size={18} />
              Mes candidatures envoyées
              {sentList.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-secondary-100 text-secondary-600">
                  {sentList.length}
                </span>
              )}
            </button>
          </div>

          {/* Main Area */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-secondary-400 gap-3">
              <Spinner size="lg" />
              <span className="text-sm font-medium">Chargement de vos candidatures...</span>
            </div>
          ) : isError ? (
            <Alert variant="danger" className="my-6">
              {error?.response?.data?.message || "Une erreur est survenue lors de la récupération des candidatures. Veuillez réessayer."}
            </Alert>
          ) : activeTab === 'received' ? (
            /* TAB: RECEIVED CANDIDATURES */
            receivedList.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="Aucune candidature reçue"
                description="Vous n'avez pas encore reçu de candidatures sur vos demandes d'aide. Créez des missions pour attirer des candidats !"
              />
            ) : (
              <div className="space-y-4">
                {receivedList.map((candidature) => {
                  const initials = candidature.candidat?.name
                    ? candidature.candidat.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                    : '??';
                  
                  const isActionLoading = updateStatutMutation.isLoading && 
                    updateStatutMutation.variables?.id === candidature.id;

                  return (
                    <Card key={candidature.id} className="overflow-hidden border-secondary-100 hover:shadow-soft-md transition-default bg-white">
                      <CardContent className="p-6">
                        {/* Post details */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-secondary-50">
                          <div className="flex items-center gap-2 text-secondary-500 text-xs font-medium">
                            <Briefcase size={14} className="text-secondary-400" />
                            <span>Sur votre mission :</span>
                            <span className="font-bold text-secondary-900 hover:text-primary-600 transition-colors cursor-pointer">
                              {candidature.post?.titre}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {renderStatusBadge(candidature.statut)}
                          </div>
                        </div>

                        {/* Candidate info & Message */}
                        <div className="grid gap-6 md:grid-cols-[200px_1fr]">
                          <div className="flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-secondary-100 pb-4 md:pb-0 md:pr-6">
                            <Avatar
                              src={candidature.candidat?.profil?.avatar_url}
                              fallback={initials}
                              size="lg"
                              className="mb-3 h-16 w-16"
                            />
                            <span className="font-bold text-secondary-900 text-sm">
                              {candidature.candidat?.name}
                            </span>
                            {candidature.candidat?.profil?.filiere && (
                              <Badge variant="secondary" className="mt-1 text-[10px] uppercase">
                                {candidature.candidat.profil.filiere}
                              </Badge>
                            )}
                            <div className="flex items-center gap-1 text-[10px] text-secondary-400 mt-3">
                              <Calendar size={12} />
                              <span>Postulé {formatDate(candidature.created_at)}</span>
                            </div>
                          </div>

                          <div className="flex flex-col justify-between">
                            <div className="bg-secondary-50/50 rounded-xl p-4 border border-secondary-100">
                              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-secondary-600">
                                <MessageSquare size={14} />
                                <span>Message de motivation</span>
                              </div>
                              <p className="text-secondary-700 text-sm leading-relaxed whitespace-pre-line">
                                {candidature.message || "Aucun message fourni."}
                              </p>
                            </div>

                            {/* Buttons actions */}
                            {candidature.statut === 'en_attente' && (
                              <div className="flex items-center justify-end gap-3 mt-6">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDecision(candidature.id, 'refuse')}
                                  disabled={isActionLoading}
                                  className="h-9 gap-1.5 text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                                >
                                  {isActionLoading && updateStatutMutation.variables?.statut === 'refuse' ? (
                                    <Spinner size="sm" className="border-red-600" />
                                  ) : (
                                    <X size={15} />
                                  )}
                                  Refuser
                                </Button>

                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleDecision(candidature.id, 'accepte')}
                                  disabled={isActionLoading}
                                  className="h-9 gap-1.5 bg-green-600 hover:bg-green-700 text-white border-transparent hover:shadow-soft-lg cursor-pointer"
                                >
                                  {isActionLoading && updateStatutMutation.variables?.statut === 'accepte' ? (
                                    <Spinner size="sm" className="border-white" />
                                  ) : (
                                    <Check size={15} />
                                  )}
                                  Accepter
                                </Button>
                              </div>
                            )}
                            {candidature.statut === 'accepte' && candidature.coordonnees && (
                                  <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
                                    <p className="text-xs font-bold text-green-700 mb-3">Coordonnées partagées</p>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-[10px] uppercase text-secondary-400 font-bold mb-1">Helper</p>
                                        <p className="text-sm font-semibold text-secondary-900">{candidature.coordonnees.helper.name}</p>
                                        <p className="text-xs text-secondary-500">{candidature.coordonnees.helper.email}</p>
                                        <p className="text-xs text-secondary-500">{candidature.coordonnees.helper.telephone}</p>
                                      </div>
                                      <div>
                                        <p className="text-[10px] uppercase text-secondary-400 font-bold mb-1">Demandeur</p>
                                        <p className="text-sm font-semibold text-secondary-900">{candidature.coordonnees.demandeur.name}</p>
                                        <p className="text-xs text-secondary-500">{candidature.coordonnees.demandeur.email}</p>
                                        <p className="text-xs text-secondary-500">{candidature.coordonnees.demandeur.telephone}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )
          ) : (
            /* TAB: SENT CANDIDATURES */
            sentList.length === 0 ? (
              <EmptyState
                icon={Send}
                title="Aucune candidature envoyée"
                description="Vous n'avez pas encore postulé aux missions des autres membres. Explorez le flux d'aide pour trouver des opportunités !"
              />
            ) : (
              <div className="space-y-4">
                {sentList.map((candidature) => {
                  const author = candidature.post?.user;
                  const initials = author?.name
                    ? author.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                    : '??';

                  return (
                    <Card key={candidature.id} className="overflow-hidden border-secondary-100 hover:shadow-soft-md transition-default bg-white">
                      <CardContent className="p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-secondary-50">
                          <h3 className="font-bold text-secondary-900 text-base">
                            {candidature.post?.titre}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-secondary-400 flex items-center gap-1">
                              <Clock size={12} />
                              Envoyé {formatDate(candidature.created_at)}
                            </span>
                            {renderStatusBadge(candidature.statut)}
                          </div>
                        </div>

                        {/* Owner details & Motivations */}
                        <div className="grid gap-6 md:grid-cols-[200px_1fr]">
                          <div className="flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-secondary-100 pb-4 md:pb-0 md:pr-6 justify-center">
                            <span className="text-[10px] uppercase font-bold text-secondary-400 tracking-wider mb-2">Auteur de l'offre</span>
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={author?.profil?.avatar_url}
                                fallback={initials}
                                size="md"
                              />
                              <div className="text-left">
                                <div className="font-bold text-secondary-900 text-xs">
                                  {author?.name}
                                </div>
                                <div className="text-[9px] text-secondary-500 uppercase">
                                  {author?.profil?.filiere || "Étudiant"}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="bg-secondary-50/50 rounded-xl p-4 border border-secondary-100">
                              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-secondary-600">
                                <MessageSquare size={14} />
                                <span>Votre message de candidature</span>
                              </div>
                              <p className="text-secondary-700 text-sm leading-relaxed whitespace-pre-line">
                                {candidature.message}
                              </p>
                            </div>
                            {candidature.statut === 'accepte' && candidature.coordonnees && (
                                <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
                                  <p className="text-xs font-bold text-green-700 mb-3">Coordonnées partagées</p>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-[10px] uppercase text-secondary-400 font-bold mb-1">Helper</p>
                                      <p className="text-sm font-semibold text-secondary-900">{candidature.coordonnees.helper.name}</p>
                                      <p className="text-xs text-secondary-500">{candidature.coordonnees.helper.email}</p>
                                      <p className="text-xs text-secondary-500">{candidature.coordonnees.helper.telephone || 'Non renseigné'}</p>
                                    </div>
                                    <div>
                                      <p className="text-[10px] uppercase text-secondary-400 font-bold mb-1">Demandeur</p>
                                      <p className="text-sm font-semibold text-secondary-900">{candidature.coordonnees.demandeur.name}</p>
                                      <p className="text-xs text-secondary-500">{candidature.coordonnees.demandeur.email}</p>
                                      <p className="text-xs text-secondary-500">{candidature.coordonnees.demandeur.telephone || 'Non renseigné'}</p>
                                    </div>
                                  </div>
                                </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CandidaturesPage;
