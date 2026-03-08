'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/api';
import { LoginRequest } from '@kroom/shared-types';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2, Video, User, Mail, Lock } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', { email, password, username } as LoginRequest & { username: string });
      setAuth(data.user, data.token);
      toast.success('Compte créé avec succès !');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 rounded-2xl border bg-white dark:bg-zinc-900 p-8 shadow-xl"
      >
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
            <Video className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Inscription</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Commencez l'aventure KRoom dès maintenant</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nom d'utilisateur</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  id="username"
                  type="text"
                  required
                  className="block w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 pl-10 pr-4 py-3 text-zinc-900 dark:text-zinc-50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all sm:text-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Jean Dupont"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 pl-10 pr-4 py-3 text-zinc-900 dark:text-zinc-50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" title="Mot de passe" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Mot de passe</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  id="password"
                  type="password"
                  required
                  className="block w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 pl-10 pr-4 py-3 text-zinc-900 dark:text-zinc-50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Inscription en cours...
              </span>
            ) : 'Créer mon compte'}
          </button>

          <div className="text-center text-sm pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-zinc-500 dark:text-zinc-400">Déjà un compte ? </span>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Se connecter
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
