import React, { useState , useEffect } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import PostCard from '../components/PostCard';
import Avatar from '../../../components/ui/Avatar';
import { Plus, Filter, TrendingUp, Award } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import FilterBar from '../../../components/ui/FilterBar';

// const mockPosts = 
// [
//   {
//     id: 1,
//     user: { name: 'Lucas Martin', school: 'Epitech Paris', initials: 'LM' },
//     content: "Besoin d'un coup de main pour un projet React / Tailwind. Je galère sur le responsive du Navbar. Quelqu'un est dispo ce soir pour un appel ?",
//     image: true, // Placeholder to show the image area
//     category: 'Développement Web',
//     time: 'Il y a 15 min',
//     comments: 4,
//   },
//   {
//     id: 2,
//     user: { name: 'Sarah Benali', school: 'Sorbonne', initials: 'SB' },
//     content: "Quelqu'un s'y connaît en économie de l'entreprise ? J'ai un devoir sur les structures de marché à rendre demain. 🙏",
//     category: 'Économie',
//     time: 'Il y a 1h',
//     comments: 2,
//   },
//   {
//     id: 3,
//     user: { name: 'Julien Dupont', school: 'HEC', initials: 'JD' },
//     content: "Recherche relecture pour mon rapport de stage sur l'analyse financière. 20 pages environ.",
//     category: 'Finance',
//     time: 'Il y a 3h',
//     comments: 7,
//   }
// ];

const FeedPage = () => {
 
// ------------------------------------------------------ @fouad
const [posts , setPosts] = useState([]);
const [filieres , setFilieres]= useState([]);
const [technologies , setTechnologies]= useState([]);


useEffect(() => {
// njibo les posts 
  fetch('/api/post').then(res => res.json())
  .then(data => {
    setPosts(data.posts);
  })
  .catch(err => console.error('Erreur lors du chargement des posts:', err));

// njibo lfilieres 
  fetch('/api/filieres').then(res => res.json()).then(data => {
    setFilieres(data.filieres);
  }).catch(err => console.error('Erreur lors du chargement des filières:', err));
  
  // njibo technologies 
  fetch('/api/technologies').then(res => res.json()).then(data => {
    setTechnologies(data.technologies);
  }).catch(err => console.error('Erreur lors du chargement des technologies:', err));

}, []);
// ------------------------------------------------------- @endfouad
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
                  {/* -------------- FOUAD WORK -------------- */}   
                  <FilterBar 
                    filieres={filieres}
                    technologies={technologies}
                    onFilterChange={(filters) => fetch(`/api/posts?filiere=${filters.filiere}&technologie=${filters.technologie}`)
                      .then(res => res.json())
                      .then(data => setPosts(data.posts)) 
                      .catch(err => console.error('Erreur lors du filtrage:', err))
                    }
                  />              
                  {/* <Button variant="outline" size="sm" className="gap-2">
                    <Filter size={16} /> Filtres
                  </Button> */}
                  {/* -------------- END FOUAD WORK -------------- */}
                            {/* ------------------------- */}
                                    {/* --------- */}
                  
                  <Button variant="primary" size="sm" className="gap-2">
                    <Plus size={16} /> Demander de l'aide
                  </Button>
                </div>
              </div>

              {/* Feed List */}
              <div className="space-y-2">
                {posts.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button variant="ghost" className="text-secondary-500">Charger plus de missions</Button>
              </div>
            </main>

            {/* Sidebar */}
            <aside className="hidden lg:block space-y-6">
              {/* User Quick Info */}
              {/* ⭕⭕ had les donnes dyaal l user khass it9ado ⭕⭕ */}
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
              {/* ⭕⭕ hadd lmission tahoma m7tajin lkhdmaa dyalom   ⭕⭕ */}
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
              {/* ⭕⭕ ba9ii khassna wa7da traitement dyaal les tops okda f bacnend njibo pro stagiaire odak sa3a n affichiwhom  ⭕⭕ */}
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
