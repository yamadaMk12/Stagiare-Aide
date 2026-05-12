import React from 'react';
import { Share2, Clock, MapPin, MoreHorizontal, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

const PostCard = ({ user, title, content, image, time, comments, category }) => {
  return (
    <Card className="mb-6 border-secondary-100 hover:border-primary-200 hover:shadow-soft-lg transition-default">
      <CardHeader className="flex flex-row items-start justify-between p-5 pb-3">
        <div className="flex items-center gap-3">
          <Avatar fallback={user.initials} src={user.avatar} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-secondary-900">{user.name}</span>
              <Badge variant="secondary" className="text-[10px] uppercase">{user.school}</Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary-500 mt-0.5">
              <Clock size={12} /> {time} 
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
        <Badge variant="primary" className="mb-3">{category}</Badge>
        {title && <h2 className="text-lg font-bold text-secondary-900 mb-2">{title}</h2>}
        <div className="text-secondary-700 leading-relaxed text-sm lg:text-base mb-4">
          {content}
        </div>
        
        {/* Optional Post Image */}
        {image && (
          <div className="mt-4 aspect-video w-full rounded-xl bg-secondary-50 flex items-center justify-center border border-secondary-100 overflow-hidden">
            {typeof image === 'string' ? (
              <img src={image} alt="post content" className="h-full w-full object-cover" />
            ) : (
              <div className="text-secondary-300 font-medium italic text-sm">Image illustrative du projet</div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-secondary-50 bg-secondary-50/30 px-5 py-3">
        <div className="flex items-center gap-4 text-xs font-medium text-secondary-500">
          <span className="hover:text-primary-600 cursor-pointer">{comments} Réponses</span>
          <button className="flex items-center gap-1 hover:text-primary-600 transition-colors">
            <Share2 size={14} /> Partager
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            Détails
          </Button>
          <Button variant="primary" size="sm" className="h-9 gap-2">
            Aider ce stagiaire <ExternalLink size={14} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
