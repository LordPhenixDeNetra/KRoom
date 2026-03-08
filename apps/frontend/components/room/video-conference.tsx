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
    >
      <div className="flex h-full overflow-hidden">
        <div className="flex-1 flex flex-col relative">
          <VideoConferenceInner />
          <RoomAudioRenderer />
          
          {/* Custom Control Bar with Chat Toggle */}
          <div className="lk-control-bar flex items-center justify-center gap-2 p-2 bg-zinc-900 border-t border-white/10">
            <ControlBar variation="minimal" />
            <button 
              onClick={() => setShowChat(!showChat)}
              className={`p-2 rounded-md transition-colors ${showChat ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
              title="Discussion"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>
        </div>

        {showChat && (
          <div className="w-80 h-full animate-in slide-in-from-right duration-300">
            <Chat roomId={roomId} />
          </div>
        )}
      </div>
    </LiveKitRoom>
  );
}

function VideoConferenceInner() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <GridLayout tracks={tracks} className="flex-1">
      <ParticipantTile />
    </GridLayout>
  );
}
