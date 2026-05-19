import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Textarea from '../../../components/ui/Textarea';
import Alert from '../../../components/ui/Alert';

const EvaluationForm = ({ onSubmit }) => {
  const [commentaire, setCommentaire] = useState('');
  const [note, setNote] = useState(0);
  const [hoverNote, setHoverNote] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentaire.trim() || note === 0) return;
    
    setIsSubmitting(true);
    
    // Simuler l'appel API
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onSubmit) onSubmit({ commentaire, note });
      setCommentaire('');
      setNote(0);
    }, 1000);
  };

  if (submitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <Alert variant="success" title="Évaluation envoyée">
            Merci d'avoir pris le temps d'évaluer cette collaboration. Votre retour est précieux.
          </Alert>
          <div className="mt-4 flex justify-end">
             <Button variant="outline" onClick={() => setSubmitted(false)}>
                Laisser une autre évaluation
             </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Évaluer la collaboration</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-900 block">
                Votre note
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={isSubmitting}
                    className={`p-1 transition-all rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'}`}
                    onClick={() => setNote(star)}
                    onMouseEnter={() => setHoverNote(star)}
                    onMouseLeave={() => setHoverNote(0)}
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${star <= (hoverNote || note) ? 'fill-amber-400 text-amber-400' : 'text-secondary-200'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="commentaire" className="text-sm font-medium text-secondary-900 block">
                Votre commentaire
              </label>
              <Textarea
                id="commentaire"
                placeholder="Partagez votre avis sur cette collaboration..."
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                disabled={isSubmitting}
                className="min-h-[150px] w-full"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t border-secondary-100 pt-6">
          <Button 
            type="button" 
            variant="ghost" 
            disabled={isSubmitting} 
            onClick={() => { setCommentaire(''); setNote(0); }}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !commentaire.trim() || note === 0}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer l\'évaluation'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EvaluationForm;
