'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth.store';
import { ChatMessage } from '@kroom/shared-types';
import api from '@/lib/api';
import { Send, User } from 'lucide-react';

interface ChatProps {
  roomId: string;
}

export function Chat({ roomId }: ChatProps) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Charger l'historique
    const fetchHistory = async () => {
      try {
        const { data } = await api.get(`/rooms/${roomId}/messages`);
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch chat history:', err);
      }
    };
    fetchHistory();

    // 2. Setup Socket.io
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';
    const socket = io(socketUrl);
    socketRef.current = socket;

    socket.emit('join_room', roomId);

    socket.on('receive_message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !socketRef.current) return;

    socketRef.current.emit('send_message', {
      content: newMessage,
      roomId,
      userId: user.id,
    });

    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-l border-white/10">
      <div className="p-4 border-b border-white/10 flex items-center gap-2">
        <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Discussion</h3>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700"
      >
        {messages.map((msg, i) => {
          const isMe = msg.userId === user?.id;
          return (
            <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                {!isMe && <span className="text-[10px] font-bold text-primary uppercase">{msg.username}</span>}
                <span className="text-[10px] text-zinc-500">
                  {new Date(msg.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                isMe ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-200'
              }`}>
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez un message..."
          className="flex-1 bg-zinc-800 border-none rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
        />
        <button 
          type="submit"
          className="p-2 bg-primary rounded-md hover:bg-primary/90 transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
