import React from 'react';
import AuthLayout from '../../../layouts/AuthLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Mail, Lock, Github } from 'lucide-react';

const LoginPage = () => {
  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-secondary-900">Se connecter</h2>
        <p className="mt-2 text-sm text-secondary-500">
          Bienvenue sur StagiaireAide. L'entraide commence ici.
        </p>
      </div>

      <form className="mt-8 space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
            <Input className="pl-10" placeholder="Adresse e-mail" type="email" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
            <Input className="pl-10" placeholder="Mot de passe" type="password" required />
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

        <Button type="submit" className="w-full">
          Se connecter
        </Button>

        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-secondary-100"></div></div>
          <span className="relative bg-white px-2 text-xs text-secondary-400 uppercase">Ou continuer avec</span>
        </div>

        <Button variant="outline" className="w-full gap-2">
          <Github size={18} /> GitHub
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-secondary-500">
        Pas encore de compte ?{' '}
        <button className="font-semibold text-primary-600 hover:text-primary-500">
          Créer un compte
        </button>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
