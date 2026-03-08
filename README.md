# KRoom - Plateforme de Visioconférence Moderne

KRoom est une application de visioconférence et de collaboration en temps réel construite avec une architecture monorepo moderne, utilisant WebRTC pour les flux média.

## 🚀 Technologies

- **Frontend** : Next.js 14, Tailwind CSS, TanStack Query, Zustand, Framer Motion.
- **Backend** : Fastify (Node.js), Prisma (ORM), Socket.io, Zod.
- **Média (WebRTC)** : LiveKit (SFU), Coturn (STUN/TURN).
- **Base de données & Cache** : PostgreSQL, Redis.
- **Infrastructure** : Docker, Docker Compose.

## 📂 Structure du Projet

```
KRoom/
├── apps/
│   ├── backend/          # API Fastify & Logique métier
│   └── frontend/         # Application Next.js
├── packages/
│   └── shared-types/     # Schémas Zod et types partagés (TS)
├── infrastructure/       # Config Docker, Nginx, LiveKit
└── docker-compose.yml    # Orchestration des services
```

## 🛠️ Installation

1. **Cloner le dépôt**
   ```bash
   git clone <repository-url>
   cd KRoom
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement**
   Copiez le fichier `.env.example` en `.env` et ajustez les variables :
   ```bash
   cp .env.example .env
   ```

4. **Lancer l'infrastructure (Docker)**
   ```bash
   docker-compose up -d
   ```

5. **Lancer les applications en mode développement**
   ```bash
   # À la racine pour tout lancer
   npm run dev
   ```

## 📜 Scripts disponibles

- `npm run dev` : Lance tous les workspaces en mode développement.
- `npm run build` : Compile tous les packages.
- `npm run test` : Lance les tests sur tout le monorepo.
- `npm run lint` : Vérifie le style de code.

## 🔒 Licence

Ce projet est sous licence MIT.
