import { AccessToken } from 'livekit-server-sdk';

export const generateLiveKitToken = async (roomName: string, identity: string, name?: string) => {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity,
      name,
    }
  );

  at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true });

  return await at.toJwt();
};
