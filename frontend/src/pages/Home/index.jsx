import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Plus, Users, MessageSquare, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

const stats = [
  { label: 'Total Missions', value: '12', icon: TrendingUp, color: 'text-primary-600' },
  { label: 'Candidatures', value: '48', icon: Users, color: 'text-green-600' },
  { label: 'Messages', value: '126', icon: MessageSquare, color: 'text-blue-600' },
];

const Home = () => {
  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Bienvenue, Alex !</h1>
          <p className="text-secondary-500">Voici un aperçu de votre activité aujourd'hui.</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} /> Nouvelle Mission
        </Button>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={cn("rounded-xl bg-secondary-50 p-3", stat.color)}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-500">{stat.label}</p>
                <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Missions Récentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-secondary-50 p-4 hover:bg-secondary-50 transition-default cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                    {i === 1 ? 'UI' : i === 2 ? 'JS' : 'DB'}
                  </div>
                  <div>
                    <div className="font-semibold text-secondary-900">Aide Projet {i === 1 ? 'Design System' : 'Backend API'}</div>
                    <div className="text-xs text-secondary-500">Publié il y a 2h</div>
                  </div>
                </div>
                <Badge variant={i === 1 ? 'primary' : 'success'}>Actif</Badge>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-sm">Voir tout</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dernières Discussions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-secondary-500 py-8">Aucun nouveau message pour le moment.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Home;
