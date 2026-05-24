import React, { useState, useEffect } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';
import { Star, Loader2 } from 'lucide-react';
import { evaluationService } from '../services/evaluationService';

const EvaluationsPage = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [evaluationsData, setEvaluationsData] = useState({ evaluations: [], sent_evaluations: [], average_rating: 0, total_evaluations: 0 });
  const [activeTab, setActiveTab] = useState('received');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        if (user.id) {
          const data = await evaluationService.getUserEvaluations(user.id);
          setEvaluationsData(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvaluations();
  }, [user.id]);

  return (
    <MainLayout>
      <div className="bg-secondary-50/50 min-h-[calc(100vh-64px)] py-8">
        <div className="container-custom max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Mes Évaluations</h1>
            <p className="text-secondary-500 mt-1">
              Consultez les avis et notes laissés par les membres avec qui vous avez collaboré.
            </p>
          </div>

          <div className="flex border-b border-secondary-200 mb-6 gap-6">
            <button
              onClick={() => setActiveTab('received')}
              className={`pb-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'received'
                  ? 'border-primary-600 text-primary-600 font-bold'
                  : 'border-transparent text-secondary-500 hover:text-secondary-900'
              }`}
            >
              Avis Reçus ({evaluationsData.evaluations.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`pb-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'sent'
                  ? 'border-primary-600 text-primary-600 font-bold'
                  : 'border-transparent text-secondary-500 hover:text-secondary-900'
              }`}
            >
              Avis Envoyés ({evaluationsData.sent_evaluations?.length || 0})
            </button>
          </div>

          <Card>
            {activeTab === 'received' && (
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Avis Reçus</CardTitle>
                <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl text-yellow-700">
                  <Star className="text-yellow-500 fill-yellow-500" size={24} />
                  <span className="font-bold text-2xl">{evaluationsData.average_rating}</span>
                  <span className="text-yellow-600/80 text-sm font-medium">({evaluationsData.total_evaluations} avis)</span>
                </div>
                </div>
              </CardHeader>
            )}
            <CardContent className={activeTab === 'sent' ? 'pt-6' : ''}>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-primary-600" size={32} />
                </div>
              ) : activeTab === 'received' ? (
                evaluationsData.evaluations.length === 0 ? (
                  <p className="text-secondary-500 text-center py-12 text-lg">Aucune évaluation reçue pour le moment.</p>
                ) : (
                  <div className="space-y-4">
                    {evaluationsData.evaluations.map((evalItem) => (
                    <div key={evalItem.id} className="p-6 bg-white border border-secondary-100 rounded-2xl hover:shadow-soft-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar 
                            src={evalItem.reviewer?.profil?.avatar_url} 
                            fallback={evalItem.reviewer?.name?.[0]?.toUpperCase() || '?'} 
                            size="md" 
                          />
                          <div>
                            <span className="font-bold text-secondary-900 block">{evalItem.reviewer?.name}</span>
                            <span className="text-xs text-secondary-400">
                              {new Date(evalItem.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric', month: 'long', year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} className={i < evalItem.note ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                          ))}
                        </div>
                      </div>
                      {evalItem.commentaire && (
                        <div className="bg-secondary-50/50 rounded-xl p-4 text-sm text-secondary-700 leading-relaxed border border-secondary-50">
                          {evalItem.commentaire}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                )
              ) : (
                evaluationsData.sent_evaluations?.length === 0 ? (
                  <p className="text-secondary-500 text-center py-12 text-lg">Aucune évaluation envoyée pour le moment.</p>
                ) : (
                  <div className="space-y-4">
                    {evaluationsData.sent_evaluations?.map((evalItem) => (
                      <div key={evalItem.id} className="p-6 bg-white border border-secondary-100 rounded-2xl hover:shadow-soft-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar 
                              src={evalItem.reviewed?.profil?.avatar_url} 
                              fallback={evalItem.reviewed?.name?.[0]?.toUpperCase() || '?'} 
                              size="md" 
                            />
                            <div>
                              <span className="text-xs text-secondary-500 block mb-0.5">Évalué:</span>
                              <span className="font-bold text-secondary-900 block">{evalItem.reviewed?.name}</span>
                              <span className="text-xs text-secondary-400">
                                {new Date(evalItem.created_at).toLocaleDateString('fr-FR', {
                                  day: 'numeric', month: 'long', year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1 text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={18} className={i < evalItem.note ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                            ))}
                          </div>
                        </div>
                        {evalItem.commentaire && (
                          <div className="bg-secondary-50/50 rounded-xl p-4 text-sm text-secondary-700 leading-relaxed border border-secondary-50">
                            {evalItem.commentaire}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default EvaluationsPage;
