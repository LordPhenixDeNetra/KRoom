'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/api';
import { RoomResponse } from '@kroom/shared-types';
import { RoomCard } from '@/components/room/room-card';
import { CreateRoomForm } from '@/components/room/create-room-form';
import { Plus, Search, RefreshCw, X, Video } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/rooms');
      setRooms(data);
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchRooms();
  }, [user, router]);

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Tableau de bord</h1>
            <p className="mt-1 text-zinc-500 dark:text-zinc-400">Gérez vos salons de visioconférence et collaborez en temps réel</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
            Nouveau Salon
          </button>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4 mb-10">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Rechercher par nom ou description..."
              className="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-11 pr-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchRooms}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 text-zinc-500 hover:text-primary hover:border-primary/50 transition-all active:scale-95"
            title="Rafraîchir"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <main>
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
              ))}
            </div>
          ) : filteredRooms.length > 0 ? (
            <motion.div 
              layout
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
            >
              <AnimatePresence>
                {filteredRooms.map((room) => (
                  <motion.div
                    key={room.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RoomCard room={room} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 p-20 text-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                <Video className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {searchQuery ? "Aucun salon ne correspond" : "Prêt à démarrer ?"}
              </h3>
              <p className="mt-3 text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                {searchQuery 
                  ? `Nous n'avons trouvé aucun salon pour "${searchQuery}". Essayez avec d'autres mots-clés.`
                  : "C'est un peu vide ici ! Créez votre premier salon de visioconférence et invitez vos collaborateurs."}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-8 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105"
                >
                  Créer mon premier salon
                </button>
              )}
            </motion.div>
          )}
        </main>
      </div>

      {/* Create Modal Overlay */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Nouveau Salon</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Configurez votre espace de collaboration</p>
                </div>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <CreateRoomForm onSuccess={() => setShowCreateModal(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
