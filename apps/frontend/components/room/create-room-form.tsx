'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { CreateRoomRequest } from '@kroom/shared-types';

export function CreateRoomForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/rooms', {
        name,
        description,
        isPrivate,
        password: isPrivate ? password : undefined,
      } as CreateRoomRequest);
      
      onSuccess();
      router.push(`/room/${data.slug}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création du salon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium">Nom du salon</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Mon super salon"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description (optionnelle)</label>
        <textarea
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="De quoi allons-nous parler ?"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPrivate"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
          className="rounded border-input"
        />
        <label htmlFor="isPrivate" className="text-sm font-medium">Salon privé</label>
      </div>

      {isPrivate && (
        <div>
          <label className="block text-sm font-medium">Mot de passe</label>
          <input
            type="password"
            required
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Création...' : 'Créer le salon'}
      </button>
    </form>
  );
}
