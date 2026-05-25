import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Upload, X, Loader2, Sparkles } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Button from '../../../components/ui/Button';
import { useTechnologies } from '../../../hooks/useStats';
import useCreatePost from '../hooks/useCreatePost';

const CreatePostModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [clientError, setClientError] = useState('');

  const fileInputRef = useRef(null);

  // Fetch technologies using our newly defined hook
  const { data: technologies, isLoading: isTechsLoading } = useTechnologies();

  // Create post mutation hook
  const { mutate, isPending, error: serverError, reset: resetMutation } = useCreatePost();

  const handleTechToggle = (techId) => {
    setSelectedTechs((prev) =>
      prev.includes(techId)
        ? prev.filter((id) => id !== techId)
        : [...prev, techId]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setClientError("L'image ne doit pas dépasser 2 Mo.");
        return;
      }
      setClientError('');
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setClientError('');
    resetMutation();

    if (!title.trim()) {
      setClientError('Le titre est requis.');
      return;
    }
    if (!description.trim()) {
      setClientError('La description est requise.');
      return;
    }
    if (parseFloat(price) < 0 || isNaN(parseFloat(price))) {
      setClientError('Le budget doit être supérieur ou égal à 0.');
      return;
    }

    // Build FormData to support file upload
    const formData = new FormData();
    formData.append('titre', title.trim());
    formData.append('description', description.trim());
    formData.append('prix', parseFloat(price).toString());
    formData.append('statut', 'ouvert');

    selectedTechs.forEach((techId) => {
      formData.append('technologies[]', techId);
    });

    if (imageFile) {
      formData.append('images[]', imageFile);
    }

    mutate(formData, {
      onSuccess: () => {
        // Reset states and close modal
        setTitle('');
        setDescription('');
        setPrice('0');
        setSelectedTechs([]);
        setImageFile(null);
        setImagePreview(null);
        onClose();
      },
    });
  };

  // Get validation errors from server if any
  const validationErrors = serverError?.response?.data?.errors;
  const genericErrorMessage = serverError?.response?.data?.message;

  // 403 = free post limit reached -> prompt the user to subscribe
  const isLimitError = serverError?.response?.status === 403;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Créer une demande d'aide"
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Title Input */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-secondary-800">
            Quel est votre besoin ? <span className="text-red-500">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Aide pour un projet React / Spring Boot"
            maxLength={255}
            disabled={isPending}
            className="w-full border-secondary-200"
          />
          {validationErrors?.titre && (
            <p className="text-xs text-red-500">{validationErrors.titre[0]}</p>
          )}
        </div>

        {/* Description Textarea */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-secondary-800">
            Description détaillée <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Expliquez en détail ce que vous essayez d'accomplir, les erreurs rencontrées et le type d'aide recherché..."
            rows={5}
            disabled={isPending}
            className="w-full border-secondary-200 resize-none"
          />
          {validationErrors?.description && (
            <p className="text-xs text-red-500">{validationErrors.description[0]}</p>
          )}
        </div>

        {/* Budget Input */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-secondary-800">
            Budget / Rémunération (€) <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-xl shadow-sm">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              disabled={isPending}
              className="w-full border-secondary-200 pr-12"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <span className="text-secondary-400 sm:text-sm">€</span>
            </div>
          </div>
          <p className="text-[11px] text-secondary-400">
            Indiquez 0 si c'est une demande d'entraide gratuite.
          </p>
          {validationErrors?.prix && (
            <p className="text-xs text-red-500">{validationErrors.prix[0]}</p>
          )}
        </div>

        {/* Technology Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-secondary-800 block">
            Technologies concernées
          </label>
          {isTechsLoading ? (
            <div className="flex items-center gap-2 text-xs text-secondary-400 py-1">
              <Loader2 size={14} className="animate-spin" />
              Chargement des technologies...
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1 border border-secondary-100 rounded-xl bg-secondary-50/50">
              {technologies?.map((tech) => {
                const isSelected = selectedTechs.includes(tech.id);
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => handleTechToggle(tech.id)}
                    disabled={isPending}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                      isSelected
                        ? 'bg-primary-500 text-white border-primary-500 shadow-sm shadow-primary-200 scale-105'
                        : 'bg-white text-secondary-600 border-secondary-200 hover:border-primary-300 hover:text-primary-600'
                    }`}
                  >
                    {tech.name}
                  </button>
                );
              })}
            </div>
          )}
          {validationErrors?.technologies && (
            <p className="text-xs text-red-500">{validationErrors.technologies[0]}</p>
          )}
        </div>

        {/* Image Upload Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-secondary-800 block">
            Ajouter une capture d'écran ou image
          </label>
          
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            disabled={isPending}
          />

          {!imagePreview ? (
            <div
              onClick={() => !isPending && fileInputRef.current?.click()}
              className={`border-2 border-dashed border-secondary-200 rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-primary-400 hover:bg-primary-50/10 ${
                isPending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="mx-auto h-8 w-8 text-secondary-400 mb-2" />
              <p className="text-xs font-semibold text-secondary-700">
                Cliquez pour importer une image
              </p>
              <p className="text-[10px] text-secondary-400 mt-1">
                PNG, JPG ou GIF jusqu'à 2 Mo
              </p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-secondary-100 bg-secondary-50 max-h-56 flex items-center justify-center p-2 group">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="max-h-48 object-contain rounded-xl"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isPending}
                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors"
                title="Supprimer l'image"
              >
                <X size={16} />
              </button>
            </div>
          )}
          {validationErrors?.images && (
            <p className="text-xs text-red-500">{validationErrors.images[0]}</p>
          )}
        </div>

        {/* Error Alerts */}
        {clientError && (
          <div className="bg-red-50 text-red-600 text-xs rounded-xl p-3 border border-red-100 font-medium">
            {clientError}
          </div>
        )}

        {/* Free limit reached: show an upgrade prompt instead of a plain error */}
        {isLimitError && (
          <div className="rounded-xl border border-primary-100 bg-primary-50 p-4">
            <div className="flex items-start gap-3">
              <Sparkles size={18} className="mt-0.5 text-primary-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-secondary-800">Limite gratuite atteinte</p>
                <p className="text-xs text-secondary-600 mt-0.5">{genericErrorMessage}</p>
                <Link
                  to="/abonnement"
                  onClick={onClose}
                  className="mt-2 inline-block text-xs font-bold text-primary-600 hover:text-primary-700"
                >
                  Voir les abonnements →
                </Link>
              </div>
            </div>
          </div>
        )}

        {genericErrorMessage && !validationErrors && !isLimitError && (
          <div className="bg-red-50 text-red-600 text-xs rounded-xl p-3 border border-red-100 font-medium">
            {genericErrorMessage}
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-secondary-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="min-w-[140px] gap-2"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Publication...
              </>
            ) : (
              'Publier la demande'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePostModal;
