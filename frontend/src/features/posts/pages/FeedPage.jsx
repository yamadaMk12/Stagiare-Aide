import React, { useState, useMemo } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import Avatar from '../../../components/ui/Avatar';
import { Plus, Filter, TrendingUp, Award, Search } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';

const mockPosts = [
  {
    id: 1,
    title: "Aide React & Tailwind",
    user: { name: 'Lucas Martin', school: 'Epitech Paris', initials: 'LM' },
    content: "Besoin d'un coup de main pour un projet React / Tailwind. Je galère sur le responsive du Navbar. Quelqu'un est dispo ce soir pour un appel ?",
    image: true,
    category: 'Développement Web',
    time: 'Il y a 15 min',
    comments: 4,
  },
  {
    id: 2,
    title: "Soutien Économie d'entreprise",
    user: { name: 'Sarah Benali', school: 'Sorbonne', initials: 'SB' },
    content: "Quelqu'un s'y connaît en économie de l'entreprise ? J'ai un devoir sur les structures de marché à rendre demain. 🙏",
    category: 'Économie',
    time: 'Il y a 1h',
    comments: 2,
  },
  {
    id: 3,
    title: "Relecture Rapport de Stage",
    user: { name: 'Julien Dupont', school: 'HEC', initials: 'JD' },
    content: "Recherche relecture pour mon rapport de stage sur l'analyse financière. 20 pages environ.",
    category: 'Finance',
    time: 'Il y a 3h',
    comments: 7,
  }
];

const FeedPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    return mockPosts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <MainLayout>
      <div className="bg-secondary-50/50 min-h-[calc(100vh-64px)]">
        <div className="container-custom py-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            {/* Main Content */}
            <main>
              {/* Top Filter Bar */}
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-secondary-900">Flux d'Entraide</h1>
                  <p className="text-sm text-secondary-500">Découvrez les missions où vous pouvez aider.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="w-full md:w-80 lg:w-96">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                  </div>
                </div>
              </div>

              {/* Feed List */}
              <div className="space-y-2">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <PostCard key={post.id} {...post} />
                  ))
                ) : (
                  <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-secondary-200">
                    <div className="mx-auto w-16 h-16 bg-secondary-50 rounded-full flex items-center justify-center mb-4">
                      <Search className="text-secondary-300" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-secondary-900">Aucun résultat</h3>
                    <p className="text-secondary-500 max-w-xs mx-auto mt-2">
                      Nous n'avons trouvé aucune demande correspondant à "{searchQuery}".
                    </p>
                    <Button 
                      variant="ghost" 
                      className="mt-4 text-primary-600"
                      onClick={() => setSearchQuery('')}
                    >
                      Effacer la recherche
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-8 text-center">
                <Button variant="ghost" className="text-secondary-500">Charger plus de missions</Button>
              </div>
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

              {/* Trending Skills / Topics */}
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
