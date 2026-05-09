import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-secondary-100 bg-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <div className="mb-4 text-xl font-bold text-primary-600">StagiaireAide</div>
            <p className="max-w-xs text-sm text-secondary-500">
              La plateforme collaborative d'entraide pour les étudiants. 
              Réussissez vos projets ensemble.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-secondary-900">Plateforme</h4>
            <ul className="space-y-2 text-sm text-secondary-500">
              <li className="hover:text-primary-600 cursor-pointer">Aide</li>
              <li className="hover:text-primary-600 cursor-pointer">Missions</li>
              <li className="hover:text-primary-600 cursor-pointer">Tarifs</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-secondary-900">Légal</h4>
            <ul className="space-y-2 text-sm text-secondary-500">
              <li className="hover:text-primary-600 cursor-pointer">Confidentialité</li>
              <li className="hover:text-primary-600 cursor-pointer">CGU</li>
              <li className="hover:text-primary-600 cursor-pointer">Contact</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-secondary-50 pt-8 text-center text-sm text-secondary-400">
          © {new Date().getFullYear()} StagiaireAide. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
