'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/api';
import { LoginRequest } from '@kroom/shared-types';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2, Video } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password } as LoginRequest);
      setAuth(data.user, data.token);
      toast.success('Connexion réussie !');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Identifiants invalides');
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
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Connexion</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Heureux de vous revoir sur KRoom</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 block w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-zinc-900 dark:text-zinc-50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" title="Mot de passe" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Mot de passe</label>
                <button type="button" className="text-xs text-primary hover:underline">Mot de passe oublié ?</button>
              </div>
              <input
                id="password"
                type="password"
                required
                className="mt-1 block w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-zinc-900 dark:text-zinc-50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
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
                Connexion en cours...
              </span>
            ) : 'Se connecter'}
          </button>

          <div className="text-center text-sm pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-zinc-500 dark:text-zinc-400">Pas encore de compte ? </span>
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Créer un compte gratuitement
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
