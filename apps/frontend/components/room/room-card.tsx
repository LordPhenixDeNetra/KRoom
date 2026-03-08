'use client';

import { RoomResponse } from '@kroom/shared-types';
import { useRouter } from 'next/navigation';
import { Lock, Users, Calendar } from 'lucide-react';

interface RoomCardProps {
  room: RoomResponse & { 
    owner: { username?: string; email: string };
    _count?: { participants: number };
  };
}

export function RoomCard({ room }: RoomCardProps) {
  const router = useRouter();
  const date = new Date(room.createdAt).toLocaleDateString('fr-FR');

  return (
    <div 
      onClick={() => router.push(`/room/${room.slug}`)}
      className="group relative flex flex-col justify-between rounded-lg border bg-card p-5 shadow transition-all hover:border-primary/50 hover:shadow-md cursor-pointer"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {room.name}
          </h3>
          {room.isPrivate && (
            <Lock className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        {room.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {room.description}
          </p>
        )}

        <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{room._count?.participants || 0} participants</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Créé le {date}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t pt-4">
        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary uppercase">
          {(room.owner.username || room.owner.email).substring(0, 2)}
        </div>
        <span className="text-xs font-medium text-foreground">
          par {room.owner.username || room.owner.email}
        </span>
      </div>
    </div>
  );
}
