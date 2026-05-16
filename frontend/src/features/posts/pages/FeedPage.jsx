import React from 'react';
import MainLayout from '../../../layouts/MainLayout';
import PostCard from '../components/PostCard';
import Avatar from '../../../components/ui/Avatar';
import { Plus, Filter, TrendingUp, Award, Loader2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import usePosts from '../hooks/usePosts';
import { useUserStats, useTrendingTechnologies, useTopHelpers } from '../../../hooks/useStats';

const FeedPage = () => {
  const { data, isLoading: isPostsLoading, isError: isPostsError } = usePosts();
  const { data: userStats, isLoading: isUserStatsLoading } = useUserStats();
  const { data: trendingTechs, isLoading: isTechsLoading } = useTrendingTechnologies();
  const { data: topHelpers, isLoading: isHelpersLoading } = useTopHelpers();

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
              {isPostsLoading && (
                <div className="flex items-center justify-center py-20 text-secondary-400">
                  <Loader2 size={32} className="animate-spin mr-3" />
                  <span className="text-sm">Chargement des demandes...</span>
                </div>
              )}

              {/* Error state */}
              {isPostsError && (
                <div className="py-12 text-center text-sm text-red-500">
                  Une erreur est survenue. Veuillez réessayer plus tard.
                </div>
              )}

              {/* Empty state */}
              {!isPostsLoading && !isPostsError && posts.length === 0 && (
                <div className="py-20 text-center text-secondary-400">
                  <p className="text-lg font-semibold mb-1">Aucune demande disponible</p>
                  <p className="text-sm">Soyez le premier à poster une demande d'aide !</p>
                </div>
              )}

              {/* Feed List */}
              {!isPostsLoading && posts.length > 0 && (
                <div className="space-y-2">
                  {posts.map((post) => (
                    <PostCard key={post.id} {...post} />
                  ))}
                </div>
              )}

              {/* Load more */}
              {!isPostsLoading && posts.length > 0 && (
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
                  {isUserStatsLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="animate-spin text-primary-500" /></div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <Avatar 
                        src={userStats?.user?.profil?.avatar_url} 
                        fallback={userStats?.user?.name?.[0] || 'U'} 
                        size="xl" 
                        className="mb-4" 
                      />
                      <h3 className="font-bold text-secondary-900">{userStats?.user?.name}</h3>
                      <p className="text-xs text-secondary-500 mb-4">
                        {userStats?.user?.profil?.filiere || 'Étudiant'} • {userStats?.user?.profil?.ville || 'France'}
                      </p>
                      <div className="grid grid-cols-2 w-full gap-2 border-t border-secondary-50 pt-4">
                        <div className="text-center border-r border-secondary-50">
                          <div className="text-lg font-bold text-primary-600">{userStats?.aides || 0}</div>
                          <div className="text-[10px] uppercase text-secondary-400 font-medium">Aides</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary-600">{userStats?.demandes || 0}</div>
                          <div className="text-[10px] uppercase text-secondary-400 font-medium">Demandes</div>
                        </div>
                      </div>
                    </div>
                  )}
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
                  {isTechsLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="animate-spin text-primary-200" size={16} /></div>
                  ) : (
                    trendingTechs?.map((tech) => (
                      <div key={tech.id} className="flex items-center justify-between group cursor-pointer">
                        <span className="text-sm text-secondary-600 group-hover:text-primary-600">#{tech.name}</span>
                        <span className="text-[10px] text-secondary-400">{tech.posts_count} missions</span>
                      </div>
                    ))
                  )}
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
                  {isHelpersLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="animate-spin text-amber-200" size={16} /></div>
                  ) : (
                    topHelpers?.map((helper) => (
                      <div key={helper.id} className="flex items-center gap-3">
                        <Avatar 
                          src={helper.profil?.avatar_url} 
                          fallback={helper.name[0]} 
                          size="sm" 
                        />
                        <div className="flex-1">
                          <div className="text-xs font-bold text-secondary-900">{helper.name}</div>
                          <div className="text-[10px] text-secondary-500">{helper.candidatures_count} missions réussies</div>
                        </div>
                      </div>
                    ))
                  )}
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
