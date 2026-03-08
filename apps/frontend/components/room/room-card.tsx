'use client';

import { RoomResponse } from '@kroom/shared-types';
import { useRouter } from 'next/navigation';
import { Lock, Users, Calendar, ArrowRight } from 'lucide-react';

interface RoomCardProps {
  room: RoomResponse & { 
    owner: { username?: string; email: string };
    _count?: { participants: number };
  };
}

export function RoomCard({ room }: RoomCardProps) {
  const router = useRouter();
  const date = new Date(room.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  });

  return (
    <div 
      onClick={() => router.push(`/room/${room.slug}`)}
      className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 cursor-pointer overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="h-5 w-5 text-primary" />
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-primary transition-colors truncate max-w-[200px]">
              {room.name}
            </h3>
            {room.isPrivate && (
              <div className="flex items-center justify-center h-5 w-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" title="Salon privé">
                <Lock className="h-3 w-3" />
              </div>
            )}
          </div>
        </div>

        {room.description ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed h-10">
            {room.description}
          </p>
        ) : (
          <p className="text-sm italic text-zinc-400 dark:text-zinc-600 h-10">
            Pas de description fournie.
          </p>
        )}

        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            <Users className="h-3 w-3" />
            <span>{room._count?.participants || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            <Calendar className="h-3 w-3" />
            <span>{date}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-5">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
          {(room.owner.username || room.owner.email).substring(0, 2).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-tighter">Créateur</span>
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate max-w-[150px]">
            {room.owner.username || room.owner.email}
          </span>
        </div>
      </div>
    </div>
  );
}
