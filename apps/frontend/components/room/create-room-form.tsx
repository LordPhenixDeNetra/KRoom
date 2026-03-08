'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { CreateRoomRequest } from '@kroom/shared-types';
import { toast } from 'sonner';
import { Loader2, Shield, Globe } from 'lucide-react';

export function CreateRoomForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/rooms', {
        name,
        description,
        isPrivate,
        password: isPrivate ? password : undefined,
      } as CreateRoomRequest);
      
      toast.success('Salon créé avec succès !');
      onSuccess();
      router.push(`/room/${data.slug}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création du salon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Nom du salon</label>
          <input
            type="text"
            required
            className="block w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Réunion d'équipe, Session de code..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Description (optionnelle)</label>
          <textarea
            rows={3}
            className="block w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Objectifs de la session, ordre du jour..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setIsPrivate(false)}
            className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${!isPrivate ? 'border-primary bg-primary/5 text-primary' : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'}`}
          >
            <Globe className="h-6 w-6" />
            <div className="text-center">
              <span className="block text-sm font-bold">Public</span>
              <span className="text-[10px] opacity-70">Ouvert à tous</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setIsPrivate(true)}
            className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${isPrivate ? 'border-primary bg-primary/5 text-primary' : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'}`}
          >
            <Shield className="h-6 w-6" />
            <div className="text-center">
              <span className="block text-sm font-bold">Privé</span>
              <span className="text-[10px] opacity-70">Avec mot de passe</span>
            </div>
          </button>
        </div>

        {isPrivate && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Mot de passe du salon</label>
            <input
              type="password"
              required
              className="block w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all active:scale-95"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Création en cours...
            </span>
          ) : 'Lancer le salon'}
        </button>
      </div>
    </form>
  );
}
