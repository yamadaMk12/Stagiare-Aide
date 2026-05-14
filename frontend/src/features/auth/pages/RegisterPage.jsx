import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../../layouts/AuthLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Alert from '../../../components/ui/Alert';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import api from '../../../lib/axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/register', formData);

      // Save token and user info
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to feed
      navigate('/feed');
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-secondary-900">Rejoindre StagiaireAide</h2>
        <p className="mt-2 text-sm text-secondary-500">
          La plateforme d'entraide entre étudiants de tout le Maroc.
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleRegister}>
        {error && (
          <Alert variant="danger" title="Erreur d'inscription">
            {error}
          </Alert>
        )}

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
            <Input 
              className="pl-10" 
              placeholder="Nom complet" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text" 
              required 
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
            <Input 
              className="pl-10" 
              placeholder="Adresse e-mail académique" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
              <Input 
                className="pl-10" 
                placeholder="Mot de passe" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password" 
                required 
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
              <Input 
                className="pl-10" 
                placeholder="Confirmer" 
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                type="password" 
                required 
              />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs text-secondary-500">
          <input type="checkbox" className="mt-0.5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500" required />
          <span>
            J'accepte les <Link to="/terms" className="font-semibold text-primary-600 hover:underline cursor-pointer">Conditions d'utilisation</Link> et la <Link to="/privacy" className="font-semibold text-primary-600 hover:underline cursor-pointer">Politique de confidentialité</Link>.
          </span>
        </div>

        <Button type="submit" className="w-full h-11" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={18} /> Inscription...
            </span>
          ) : (
            'Créer mon compte'
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-secondary-500">
        Déjà membre ?{' '}
        <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
