import React from 'react';
import MainLayout from '../../../layouts/MainLayout';
import PostCard from '../components/PostCard';
import Avatar from '../../../components/ui/Avatar';
import { Plus, Filter, TrendingUp, Award, Loader2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import usePosts from '../hooks/usePosts';

const FeedPage = () => {
  const { data, isLoading, isError } = usePosts();

  // The Laravel paginator wraps items inside `data.data`
  const posts = data?.data ?? [];

  return (
    <MainLayout>
      <div className="bg-secondary-50/50 min-h-[calc(100vh-64px)]">
        <div className="container-custom py-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

            {/* Main Content */}
            <main>
              {/* Top Filter Bar */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-secondary-900">Flux d'Entraide</h1>
                  <p className="text-sm text-secondary-500">Découvrez les missions où vous pouvez aider.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter size={16} /> Filtres
                  </Button>
                  <Button variant="primary" size="sm" className="gap-2">
                    <Plus size={16} /> Demander de l'aide
                  </Button>
                </div>
              </div>

              {/* Loading state */}
              {isLoading && (
                <div className="flex items-center justify-center py-20 text-secondary-400">
                  <Loader2 size={32} className="animate-spin mr-3" />
                  <span className="text-sm">Chargement des demandes...</span>
                </div>
              )}

              {/* Error state */}
              {isError && (
                <div className="py-12 text-center text-sm text-red-500">
                  Une erreur est survenue. Veuillez réessayer plus tard.
                </div>
              )}

              {/* Empty state */}
              {!isLoading && !isError && posts.length === 0 && (
                <div className="py-20 text-center text-secondary-400">
                  <p className="text-lg font-semibold mb-1">Aucune demande disponible</p>
                  <p className="text-sm">Soyez le premier à poster une demande d'aide !</p>
                </div>
              )}

              {/* Feed List */}
              {!isLoading && posts.length > 0 && (
                <div className="space-y-2">
                  {posts.map((post) => (
                    <PostCard key={post.id} {...post} />
                  ))}
                </div>
              )}

              {/* Load more */}
              {!isLoading && posts.length > 0 && (
                <div className="mt-8 text-center">
                  <Button variant="ghost" className="text-secondary-500">Charger plus de missions</Button>
                </div>
              )}
            </main>

            {/* Sidebar */}
            <aside className="hidden lg:block space-y-6">
              {/* User Quick Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar fallback="AL" size="xl" className="mb-4" />
                    <h3 className="font-bold text-secondary-900">Alexandre</h3>
                    <p className="text-xs text-secondary-500 mb-4">Étudiant en Master • 42 Lyon</p>
                    <div className="grid grid-cols-2 w-full gap-2 border-t border-secondary-50 pt-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary-600">12</div>
                        <div className="text-[10px] uppercase text-secondary-400">Aides</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary-600">5</div>
                        <div className="text-[10px] uppercase text-secondary-400">Demandes</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trending Skills */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary-600" /> Sujets du moment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['React', 'Droit Civil', 'Analyse Financière', 'Python', 'Marketing'].map((tag) => (
                    <div key={tag} className="flex items-center justify-between group cursor-pointer">
                      <span className="text-sm text-secondary-600 group-hover:text-primary-600">#{tag}</span>
                      <span className="text-[10px] text-secondary-400">12 missions</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Top Helpers */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Award size={16} className="text-amber-500" /> Meilleurs Entraideurs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Avatar fallback={`H${i}`} size="sm" />
                      <div className="flex-1">
                        <div className="text-xs font-bold text-secondary-900">Stagiaire Pro {i}</div>
                        <div className="text-[10px] text-secondary-500">{20 - i * 3} missions réussies</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </aside>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FeedPage;
