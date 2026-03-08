'use client';

import {
  LiveKitRoom,
  VideoConference,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { useRouter } from 'next/navigation';

interface KRoomVideoConferenceProps {
  token: string;
  serverUrl: string;
}

export function KRoomVideoConference({ token, serverUrl }: KRoomVideoConferenceProps) {
  const router = useRouter();

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
      <VideoConference />
    </LiveKitRoom>
  );
}
