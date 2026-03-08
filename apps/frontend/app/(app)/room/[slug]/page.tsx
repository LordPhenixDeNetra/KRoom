'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { RoomResponse, RoomTokenResponse } from '@kroom/shared-types';
import { Loader2, LogOut, Shield, Video, Mic, Users, MessageSquare } from 'lucide-react';
import { KRoomVideoConference } from '@/components/room/video-conference';
import { Chat } from '@/components/room/chat';

export default function RoomPage() {
  const { slug } = useParams() as { slug: string };
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [room, setRoom] = useState<RoomResponse | null>(null);
  const [tokenData, setTokenData] = useState<RoomTokenResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const loadRoomAndToken = async (joinPassword?: string) => {
    setLoading(true);
    setError('');
    try {
      // 1. Charger les infos du salon
      const { data: roomData } = await api.get(`/rooms/${slug}`);
      setRoom(roomData);

      // Si le salon est privé et qu'on n'a pas encore de password
      if (roomData.isPrivate && !joinPassword) {
        setShowPasswordInput(true);
        setLoading(false);
        return;
      }

      // 2. Obtenir le token LiveKit
      const { data: tokenResponse } = await api.post(`/rooms/${slug}/join`, {
        password: joinPassword
      });
      setTokenData(tokenResponse);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Impossible de rejoindre le salon');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadRoomAndToken();
  }, [slug, user, router]);

  const handleJoinWithPassword = (e: React.FormEvent) => {
    e.preventDefault();
    loadRoomAndToken(password);
  };

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

  if (showPasswordInput && !tokenData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 text-white">
        <div className="w-full max-w-md space-y-8 rounded-lg border border-white/10 bg-zinc-900 p-8 shadow-2xl">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-2xl font-bold">Salon privé</h1>
            <p className="mt-2 text-zinc-400">Ce salon est protégé. Veuillez entrer le mot de passe pour rejoindre.</p>
          </div>

          <form onSubmit={handleJoinWithPassword} className="mt-8 space-y-6">
            {error && <div className="rounded bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            
            <div>
              <input
                type="password"
                required
                className="block w-full rounded-md border border-white/10 bg-zinc-950 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe du salon"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="flex-1 rounded-md border border-white/10 px-4 py-2 text-sm font-medium hover:bg-white/5"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Vérification...' : 'Rejoindre'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (tokenData && room) {
    return (
      <KRoomVideoConference 
        token={tokenData.token} 
        serverUrl={tokenData.serverUrl} 
        roomId={room.id}
      />
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
