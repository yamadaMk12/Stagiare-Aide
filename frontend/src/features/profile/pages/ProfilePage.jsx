import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';
import Avatar from '../../../components/ui/Avatar';
import Alert from '../../../components/ui/Alert';
import { User, Mail, Phone, Book, GraduationCap, Loader2, Save, X } from 'lucide-react';
import api from '../../../lib/axios';

const ProfilePage = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.profil?.phone || '',
    bio: user.profil?.bio || '',
    filiere: user.profil?.filiere || '',
    annee: user.profil?.annee || '',
    disponibilite: user.profil?.disponibilite ?? true,
  });

  const [availableCompetences, setAvailableCompetences] = useState([]);
  const [userCompetences, setUserCompetences] = useState(user.competences || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfileData();
    fetchCompetences();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await api.get('/user');
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.profil?.phone || '',
        bio: userData.profil?.bio || '',
        filiere: userData.profil?.filiere || '',
        annee: userData.profil?.annee || '',
        disponibilite: userData.profil?.disponibilite ?? true,
      });
      setUserCompetences(userData.competences || []);
      setPreviewUrl(userData.profil?.avatar_url || '');
      
      setIsFetching(false);
    } catch (err) {
      console.error(err);
      setIsFetching(false);
    }
  };

  const fetchCompetences = async () => {
    try {
      const response = await api.get('/competences');
      setAvailableCompetences(response.data.competences);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user.profil?.avatar_url || '');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    const data = new FormData();
    // Append text fields
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });
    
    // Append avatar if selected
    if (selectedFile) {
      data.append('avatar', selectedFile);
    }

    try {
      const response = await api.post('/profile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
    } catch (err) {
      setMessage({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Erreur lors de la mise à jour.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncCompetences = async (competenceIds) => {
    try {
      const response = await api.post('/profile/competences', { competence_ids: competenceIds });
      setUserCompetences(response.data.competences);
      // Update local user object too
      const updatedUser = { ...user, competences: response.data.competences };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.error(err);
    }
  };

  const addCompetence = (competenceId) => {
    if (userCompetences.find(c => c.id === competenceId)) return;
    const newIds = [...userCompetences.map(c => c.id), competenceId];
    handleSyncCompetences(newIds);
  };

  const removeCompetence = (competenceId) => {
    const newIds = userCompetences.filter(c => c.id !== competenceId).map(c => c.id);
    handleSyncCompetences(newIds);
  };

  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-primary-600" size={32} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Mon Profil</h1>
          <p className="text-secondary-500">Gérez vos informations personnelles et vos compétences.</p>
        </div>

        {message.text && (
          <Alert variant={message.type} className="mb-6">
            {message.text}
          </Alert>
        )}

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Left Column - Avatar & Quick Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="relative group cursor-pointer mb-4">
                  <Avatar src={previewUrl} fallback={user.name?.[0]} size="xl" className="h-32 w-32" />
                  <label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <span className="text-white text-xs font-bold uppercase">Changer</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
                <h2 className="font-bold text-lg text-secondary-900">{user.name}</h2>
                <p className="text-xs text-secondary-500">{user.email}</p>
                
                <div className="w-full border-t border-secondary-50 mt-4 pt-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-medium text-secondary-600">Disponible pour aider</span>
                    <input 
                      type="checkbox" 
                      name="disponibilite"
                      checked={formData.disponibilite}
                      onChange={handleInputChange}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Competences Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Mes Compétences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {userCompetences.map(comp => (
                    <div key={comp.id} className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 px-2 py-1 rounded-lg text-xs font-medium">
                      {comp.name}
                      <button onClick={() => removeCompetence(comp.id)} className="hover:text-primary-900">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="pt-2 border-t border-secondary-50">
                  <Select 
                    className="text-xs h-8" 
                    onChange={(e) => addCompetence(parseInt(e.target.value))}
                    value=""
                  >
                    <option value="" disabled>Ajouter une compétence...</option>
                    {availableCompetences
                      .filter(c => !userCompetences.find(uc => uc.id === c.id))
                      .map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))
                    }
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Form */}
          <div className="space-y-6">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Informations Personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-secondary-700 flex items-center gap-2">
                        <User size={14} /> Nom complet
                      </label>
                      <Input name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-secondary-700 flex items-center gap-2">
                        <Mail size={14} /> Email
                      </label>
                      <Input name="email" value={formData.email} onChange={handleInputChange} type="email" required />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-secondary-700 flex items-center gap-2">
                        <Book size={14} /> Filière / Études
                      </label>
                      <Input name="filiere" value={formData.filiere} onChange={handleInputChange} placeholder="Ex: Informatique" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-secondary-700 flex items-center gap-2">
                        <GraduationCap size={14} /> Année d'études
                      </label>
                      <Select name="annee" value={formData.annee} onChange={handleInputChange}>
                        <option value="">Sélectionner...</option>
                        <option value="1">1ère année</option>
                        <option value="2">2ème année</option>
                        <option value="3">3ème année</option>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700 flex items-center gap-2">
                      <Phone size={14} /> Téléphone
                    </label>
                    <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+212 ..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Bio / Description</label>
                    <Textarea 
                      name="bio" 
                      value={formData.bio} 
                      onChange={handleInputChange} 
                      placeholder="Parlez-nous un peu de vous et de ce que vous pouvez apporter..." 
                      className="min-h-[120px]"
                    />
                  </div>
                </CardContent>
                <div className="p-6 pt-0 border-t border-secondary-50 flex justify-end">
                  <Button type="submit" disabled={isLoading} className="gap-2">
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Enregistrer les modifications
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
