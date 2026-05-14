import React from 'react';
import { Share2, Clock, MapPin, MoreHorizontal, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

/**
 * Formats an ISO date string into a relative "X time ago" label.
 */
const formatRelativeTime = (isoDate) => {
  const diff = Math.floor((Date.now() - new Date(isoDate)) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
  return `Il y a ${Math.floor(diff / 86400)}j`;
};

const PostCard = ({ titre, contenu, technologies, prix, auteur, created_at, nb_candidatures, images }) => {
  const initials = auteur?.name
    ? auteur.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <Card className="mb-4 border-secondary-100 hover:border-primary-200 hover:shadow-soft-lg transition-default">
      <CardHeader className="flex flex-row items-start justify-between p-5 pb-3">
        <div className="flex items-center gap-3">
          <Avatar fallback={initials} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-secondary-900">{auteur?.name}</span>
              {auteur?.filiere && (
                <Badge variant="secondary" className="text-[10px] uppercase">{auteur.filiere}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary-500 mt-0.5">
              <Clock size={12} />
              {formatRelativeTime(created_at)}
              <span>•</span>
              <MapPin size={12} /> En ligne
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
          <MoreHorizontal size={18} />
        </Button>
      </CardHeader>

      <CardContent className="px-5 pb-4">
        {/* Category tags from technologies array */}
        <div className="flex flex-wrap gap-2 mb-3">
          {technologies?.map((tech) => (
            <Badge key={tech.id} variant="primary">{tech.name}</Badge>
          ))}
        </div>

        {/* Post title */}
        <h2 className="font-bold text-secondary-900 text-base mb-1">{titre}</h2>

        {/* Images */}
        {images && images.length > 0 && images[0]?.url && (
          <div className="mb-4 overflow-hidden rounded-xl border border-secondary-100 bg-secondary-50">
            <img 
              src={images[0].url} 
              alt={titre} 
              className="w-full h-auto object-cover max-h-[400px] hover:scale-[1.02] transition-transform duration-500"
              onError={(e) => {
                e.target.parentElement.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Post body */}
        <p className="text-secondary-700 leading-relaxed text-sm lg:text-base">{contenu}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-secondary-50 bg-secondary-50/30 px-5 py-3">
        <div className="flex items-center gap-4 text-xs font-medium text-secondary-500">
          <span className="hover:text-primary-600 cursor-pointer">
            {nb_candidatures ?? 0} Réponses
          </span>
          <button className="flex items-center gap-1 hover:text-primary-600 transition-colors">
            <Share2 size={14} /> Partager
          </button>
        </div>
        <div className="flex items-center gap-2">
          {prix != null && (
            <span className="text-sm font-bold text-primary-600">{prix} €</span>
          )}
          <Button variant="outline" size="sm" className="h-9">Détails</Button>
          <Button variant="primary" size="sm" className="h-9 gap-2">
            Aider ce stagiaire <ExternalLink size={14} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
