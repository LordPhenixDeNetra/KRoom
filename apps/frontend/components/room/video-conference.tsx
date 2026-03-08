'use client';

import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  ControlBar,
  GridLayout,
  ParticipantTile,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import { useRouter } from 'next/navigation';
import { Chat } from './chat';
import { useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface KRoomVideoConferenceProps {
  token: string;
  serverUrl: string;
  roomId: string;
}

export function KRoomVideoConference({ token, serverUrl, roomId }: KRoomVideoConferenceProps) {
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={serverUrl}
      onDisconnected={() => router.push('/dashboard')}
      data-lk-theme="default"
      style={{ height: '100dvh' }}
      className="flex flex-col h-screen"
    >
      <div className="flex flex-1 overflow-hidden relative">
        {/* L'interface de conférence standard de LiveKit */}
        <div className="flex-1 relative overflow-hidden">
          <VideoConference />
          
          {/* Bouton flottant pour ouvrir le chat sans casser la barre de contrôle LiveKit */}
          <button 
            onClick={() => setShowChat(!showChat)}
            className={`fixed bottom-28 right-6 z-50 p-3 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 ${
              showChat ? 'bg-primary text-white' : 'bg-zinc-800 text-white'
            }`}
            title="Discussion"
          >
            <MessageSquare className="h-6 w-6" />
          </button>
        </div>

        {/* Panneau de discussion latéral */}
        {showChat && (
          <div className="w-80 h-full border-l border-white/10 animate-in slide-in-from-right duration-300">
            <Chat roomId={roomId} />
          </div>
        )}
      </div>
    </LiveKitRoom>
  );
}
