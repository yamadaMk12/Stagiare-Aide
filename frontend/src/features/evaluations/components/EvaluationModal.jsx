import React, { useState } from 'react';
import { evaluationService } from '../services/evaluationService';

const EvaluationModal = ({ isOpen, onClose, postId, reviewedId, onSuccess }) => {
  const [note, setNote] = useState(0);
  const [hover, setHover] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (note === 0) {
      setError('Veuillez sélectionner une note.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      await evaluationService.createEvaluation({
        post_id: postId,
        reviewed_id: reviewedId,
        note,
        commentaire
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'évaluation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl transform transition-all">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Évaluer l'utilisateur</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-3xl transition-colors ${
                    star <= (hover || note) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => setNote(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(note)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commentaire (optionnel)
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none h-32"
              placeholder="Partagez votre expérience..."
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Envoi...' : 'Évaluer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluationModal;
