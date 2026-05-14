import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../../layouts/AuthLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Alert from '../../../components/ui/Alert';
import { Mail, Lock, Loader2 } from 'lucide-react';
import api from '../../../lib/axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/login', {
        email,
        password,
      });

      // Save token and user info
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to feed
      navigate('/feed');
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Une erreur est survenue lors de la connexion. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-secondary-900">Se connecter</h2>
        <p className="mt-2 text-sm text-secondary-500">
          Bienvenue sur StagiaireAide. L'entraide commence ici.
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleLogin}>
        {error && (
          <Alert variant="danger" title="Erreur de connexion">
            {error}
          </Alert>
        )}

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
            <Input 
              className="pl-10" 
              placeholder="Adresse e-mail" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
            <Input 
              className="pl-10" 
              placeholder="Mot de passe" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500" />
            <span className="text-secondary-600">Se souvenir de moi</span>
          </label>
          <button type="button" className="font-semibold text-primary-600 hover:text-primary-500">
            Mot de passe oublié ?
          </button>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={18} /> Connexion...
            </span>
          ) : (
            'Se connecter'
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-secondary-500">
        Pas encore de compte ?{' '}
        <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700">
          Créer un compte
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
