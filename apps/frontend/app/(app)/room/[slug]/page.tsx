'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { RoomResponse, RoomTokenResponse } from '@kroom/shared-types';
import { Loader2, Mic, Video, LogOut, Users, Shield } from 'lucide-react';

export default function RoomPage() {
  const { slug } = useParams() as { slug: string };
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [room, setRoom] = useState<RoomResponse | null>(null);
  const [tokenData, setTokenData] = useState<RoomTokenResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadRoomAndToken = async () => {
      try {
        // 1. Charger les infos du salon
        const { data: roomData } = await api.get(`/rooms/${slug}`);
        setRoom(roomData);

        // 2. Obtenir le token LiveKit
        // Note: Pour un salon privé, il faudrait gérer le mot de passe ici
        const { data: tokenResponse } = await api.post(`/rooms/${slug}/join`);
        setTokenData(tokenResponse);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Impossible de rejoindre le salon');
      } finally {
        setLoading(false);
      }
    };

    loadRoomAndToken();
  }, [slug, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Préparation de votre entrée dans le salon...</p>
      </div>
    );
  }

  if (error || !room || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-2xl font-bold text-destructive">Oups !</h1>
        <p className="mt-2 text-muted-foreground">{error || 'Accès refusé ou salon introuvable'}</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-white">
      {/* Room Header */}
      <header className="flex items-center justify-between border-b border-white/10 bg-zinc-900/50 px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold leading-none">{room.name}</h1>
            <span className="text-xs text-zinc-400">En direct • {slug}</span>
          </div>
          {room.isPrivate && (
            <div className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold text-yellow-500 uppercase">
              <Shield className="h-3 w-3" />
              Privé
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-medium hover:bg-destructive/90 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Quitter
          </button>
        </div>
      </header>

      {/* Main Video Area (Placeholder for Phase 4) */}
      <main className="flex-1 p-6">
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-zinc-900 shadow-2xl flex items-center justify-center border border-white/5">
          <div className="text-center space-y-6">
            <div className="mx-auto h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-pulse">
              <Video className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Prêt à rejoindre ?</h2>
              <p className="text-zinc-400 max-w-md mx-auto">
                Le module vidéo LiveKit est en cours d'initialisation. 
                Phase 4: Connexion WebRTC en cours...
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <button className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors">
                <Mic className="h-6 w-6" />
              </button>
              <button className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors">
                <Video className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-8 p-4 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-mono max-w-sm mx-auto overflow-hidden text-ellipsis">
              Token JWT obtenu avec succès
            </div>
          </div>
        </div>
      </main>

      {/* Participants Sidebar (Placeholder) */}
      <aside className="fixed right-6 top-24 bottom-24 w-64 hidden xl:block">
        <div className="h-full rounded-xl border border-white/5 bg-zinc-900/50 p-4 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Participants</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
                {user.username?.substring(0, 2).toUpperCase() || 'MO'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.username || user.email}</span>
                <span className="text-[10px] text-primary font-bold uppercase">Vous</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
