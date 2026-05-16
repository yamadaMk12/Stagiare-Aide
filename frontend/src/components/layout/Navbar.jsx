import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Bell, Menu, BookOpen, Briefcase, CreditCard, Layout, LogOut } from 'lucide-react';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import api from '../../lib/axios';

const navLinks = [
  { label: "Flux d'aide", icon: Layout, href: '/feed' },
  { label: 'Candidatures', icon: BookOpen, href: '/candidatures' },
  { label: 'Évaluations', icon: Briefcase, href: '/evaluations' },
  { label: 'Abonnement', icon: CreditCard, href: '/abonnement' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [searchQuery, setSearchQuery] = useState('');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-secondary-100 bg-white/80 backdrop-blur-md">
        <div className="container-custom flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link to="/feed" className="text-xl font-bold text-primary-600 tracking-tight cursor-pointer">
              StagiaireAide
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-secondary-500 hover:bg-secondary-50 hover:text-secondary-900 transition-default"
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden max-w-sm flex-1 px-8 xl:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={16} />
              <input
                type="text"
                placeholder="Rechercher une mission..."
                className="h-10 w-full rounded-xl bg-secondary-50 pl-10 pr-4 text-sm outline-none ring-primary-500 focus:ring-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative text-secondary-500 hidden sm:flex">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger-500 border-2 border-white" />
            </Button>
            
            <div className="h-8 w-px bg-secondary-100 mx-1 hidden sm:block" />
            
            <Link to="/profile" className="flex items-center gap-3 pl-1 cursor-pointer group">
              <div className="hidden text-right lg:block">
                <div className="text-sm font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                  {user.name || 'Étudiant'}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-secondary-500">Profil</div>
              </div>
              <Avatar 
                src={user.profil?.avatar_url} 
                fallback={user.name ? user.name[0] : 'U'} 
                size="md" 
              />
            </Link>

            <div className="h-8 w-px bg-secondary-100 mx-1 hidden lg:block" />

            <Button 
              variant="ghost" 
              size="sm" 
              className="text-secondary-400 hover:text-danger-500 hover:bg-danger-50 hidden lg:flex"
              onClick={handleLogout}
            >
              <LogOut size={20} />
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden text-secondary-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <LogOut size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-secondary-900/20 backdrop-blur-sm transition-opacity lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed right-0 top-0 z-50 h-full w-72 bg-white p-6 shadow-2xl transition-transform lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <span className="text-lg font-bold text-secondary-900">Menu</span>
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
              <Menu className="rotate-90" size={20} />
            </Button>
          </div>

          {/* Mobile Search */}
          <div className="relative mb-6 xl:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher..."
              className="h-10 w-full rounded-xl bg-secondary-50 pl-10 pr-4 text-sm outline-none ring-primary-500 focus:ring-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          {/* Navigation Links */}
          <div className="space-y-1 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-secondary-600 hover:bg-primary-50 hover:text-primary-600 transition-all"
              >
                <link.icon size={20} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-secondary-100 pt-6 mt-6 space-y-4">
            <div className="flex items-center gap-3 px-4">
              <Avatar 
                src={user.profil?.avatar_url} 
                fallback={user.name ? user.name[0] : 'U'} 
                size="md" 
              />
              <div>
                <div className="text-sm font-bold text-secondary-900">{user.name}</div>
                <div className="text-xs text-secondary-500">{user.email}</div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 text-danger-600 border-danger-100 hover:bg-danger-50"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
