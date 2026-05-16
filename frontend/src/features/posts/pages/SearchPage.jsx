import React from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import PostCard from '../components/PostCard';
import { Loader2, Search } from 'lucide-react';
import useSearchPosts from '../hooks/useSearchPosts';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data, isLoading, isError } = useSearchPosts(query);

  const posts = data?.data ?? [];

  return (
    <MainLayout>
      <div className="bg-secondary-50/50 min-h-[calc(100vh-64px)]">
        <div className="container-custom py-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                <Search size={24} />
              </div>
              <h1 className="text-2xl font-bold text-secondary-900">Résultats de recherche</h1>
            </div>
            <p className="text-sm text-secondary-500">
              {query ? (
                <>Résultats pour "<span className="font-semibold text-secondary-900">{query}</span>"</>
              ) : (
                "Entrez un mot-clé pour rechercher des missions."
              )}
            </p>
          </div>

          <main className="max-w-4xl">
            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center py-20 text-secondary-400">
                <Loader2 size={32} className="animate-spin mr-3" />
                <span className="text-sm">Recherche en cours...</span>
              </div>
            )}

            {/* Error state */}
            {isError && (
              <div className="py-12 text-center text-sm text-red-500">
                Une erreur est survenue lors de la recherche. Veuillez réessayer.
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !isError && query && posts.length === 0 && (
              <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-secondary-200">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-50 text-secondary-300 mb-4">
                  <Search size={32} />
                </div>
                <p className="text-lg font-semibold text-secondary-900 mb-1">Aucun résultat trouvé</p>
                <p className="text-sm text-secondary-500 max-w-xs mx-auto">
                  Nous n'avons trouvé aucune mission correspondant à "{query}". Essayez d'autres mots-clés.
                </p>
              </div>
            )}

            {/* No Query state */}
            {!isLoading && !query && (
              <div className="py-20 text-center text-secondary-400">
                <p className="text-sm">Veuillez saisir une recherche dans la barre ci-dessus.</p>
              </div>
            )}

            {/* Search Results */}
            {!isLoading && posts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-secondary-500 px-1">
                  <span>{posts.length} mission(s) trouvée(s)</span>
                </div>
                <div className="space-y-3">
                  {posts.map((post) => (
                    <PostCard key={post.id} {...post} />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </MainLayout>
  );
};

export default SearchPage;
