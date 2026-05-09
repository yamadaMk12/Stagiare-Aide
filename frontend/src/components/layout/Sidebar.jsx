import { BookOpen, MessageSquare, Briefcase, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: MessageSquare, label: 'Feed / Posts', active: false },
  { icon: BookOpen, label: 'Candidatures', active: false },
  { icon: Briefcase, label: 'Mes Évaluations', active: false },
  { icon: Settings, label: 'Paramètres', active: false },
];

const Sidebar = () => {
  return (
    <aside className="hidden h-[calc(100vh-64px)] w-64 flex-col border-r border-secondary-100 bg-white lg:flex">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-default",
                item.active 
                  ? "bg-primary-50 text-primary-600" 
                  : "text-secondary-500 hover:bg-secondary-50 hover:text-secondary-900"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="border-t border-secondary-100 p-4">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-danger-500 hover:bg-danger-50 transition-default">
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
