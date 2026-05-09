import React from 'react';
import { Search, Bell, Menu, BookOpen, Briefcase, CreditCard, Layout } from 'lucide-react';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';

const navLinks = [
  { label: "Flux d'aide", icon: Layout, href: '/feed' },
  { label: 'Candidatures', icon: BookOpen, href: '/candidatures' },
  { label: 'Évaluations', icon: Briefcase, href: '/evaluations' },
  { label: 'Abonnement', icon: CreditCard, href: '/abonnement' },
];

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-secondary-100 bg-white/80 backdrop-blur-md">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <div className="text-xl font-bold text-primary-600 tracking-tight cursor-pointer">
            StagiaireAide
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <button
                key={link.label}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-secondary-500 hover:bg-secondary-50 hover:text-secondary-900 transition-default"
              >
                <link.icon size={18} />
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden max-w-sm flex-1 px-8 xl:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher une mission..."
              className="h-10 w-full rounded-xl bg-secondary-50 pl-10 pr-4 text-sm outline-none ring-primary-500 focus:ring-2"
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative text-secondary-500">
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger-500 border-2 border-white" />
          </Button>
          
          <div className="h-8 w-px bg-secondary-100 mx-1" />
          
          <div className="flex items-center gap-3 pl-1 cursor-pointer group">
            <div className="hidden text-right lg:block">
              <div className="text-sm font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">Alexandre</div>
              <div className="text-[10px] uppercase tracking-wider text-secondary-500">Profil</div>
            </div>
            <Avatar fallback="AL" size="md" />
          </div>

          <Button variant="ghost" size="sm" className="lg:hidden">
            <Menu size={20} />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
