# Mayo Klinic — Site web

Site vitrine + back-office d'administration pour la Mayo Klinic (N'Djamena, Tchad).
Next.js 15 (App Router) · Prisma 7 · MySQL/MariaDB · Tailwind CSS.

## Prérequis

- Node.js 18+ (testé sur Node 22)
- MySQL / MariaDB
- Un fichier `.env` à la racine :

```
DATABASE_URL="mysql://UTILISATEUR:MOT_DE_PASSE@127.0.0.1:3306/NOM_BASE"
# Compte admin initial (créé par le seed)
ADMIN_EMAIL="admin@mayoklinic.td"
ADMIN_PASSWORD="mot-de-passe-fort"
ADMIN_SESSION_SECRET="longue-chaine-aleatoire"
```

## Installation

```bash
npm install          # installe les dépendances + génère le client Prisma (postinstall)
npm run db:push      # crée les tables dans la base
npm run db:seed      # charge le contenu initial + crée le compte admin
npm run dev          # démarre en développement (http://localhost:3000)
```

## Build de production

Build standard :

```bash
npm run build
```

### Build en environnement limité (hébergement mutualisé / cPanel)

Sur un hébergement à ressources restreintes (peu de RAM, limite de processus
`nproc`), le build Next.js peut être tué (`Killed`, `pthread_create: Resource
temporarily unavailable`). Utiliser la commande suivante pour forcer un build
quasi mono-thread et plafonner la mémoire.

**Linux / bash (serveur) :**

```bash
NODE_ENV=production LOW_RESOURCE_BUILD=1 UV_THREADPOOL_SIZE=1 NODE_OPTIONS="--max-old-space-size=1024" npx yarn build
```

**Windows / PowerShell :**

```powershell
$env:NODE_ENV="production"; $env:LOW_RESOURCE_BUILD="1"; $env:UV_THREADPOOL_SIZE="1"; $env:NODE_OPTIONS="--max-old-space-size=1024"; npx yarn build
```

| Variable | Effet |
|----------|-------|
| `LOW_RESOURCE_BUILD=1` | limite Next.js à un seul worker (`cpus: 1`, `workerThreads: false`) |
| `UV_THREADPOOL_SIZE=1` | réduit le pool de threads libuv de 4 à 1 par processus |
| `NODE_OPTIONS=--max-old-space-size=1024` | plafonne la mémoire du build (ajuster : 512 / 768 / 1024…) |
| `NODE_ENV=production` | force un environnement standard (évite l'erreur `<Html>` au prérendu) |

> Astuce : si le build reste tué, **arrêter l'application Node** (cPanel → Setup
> Node.js App → Stop) pendant le build pour libérer des processus, puis la
> redémarrer ensuite. Le plus fiable reste de **builder en local** et d'envoyer
> le dossier `.next` sur le serveur.

## Déploiement (cPanel)

1. Régler l'application Node.js sur le mode **Production** (cPanel → Setup
   Node.js App) — indispensable pour éviter un `NODE_ENV` non standard qui casse
   le build (erreur `<Html> should not be imported outside of pages/_document`).
2. Sur le serveur :

```bash
git pull
npm install                 # régénère le client Prisma
npm run db:push             # applique les changements de schéma (si besoin)
rm -rf .next
LOW_RESOURCE_BUILD=1 npx yarn build   # ou la commande complète ci-dessus
```

3. Redémarrer l'application (cPanel → Restart).

> ⚠️ Ne pas mélanger un `.next` buildé en local avec un rebuild sur le serveur :
> toujours `rm -rf .next` avant de rebuilder ou d'uploader un nouveau `.next`.

## Scripts npm utiles

| Script | Rôle |
|--------|------|
| `npm run dev` | serveur de développement |
| `npm run build` | build de production |
| `npm run db:push` | synchronise le schéma Prisma avec la base |
| `npm run db:seed` | (ré)applique le contenu de référence + crée l'admin |
| `npm run db:reset` | ⚠️ vide la base puis re-seed (dev uniquement) |
| `npm run db:reset-admin` | réinitialise le mot de passe admin depuis `.env` |

## Administration

- Accès : `/admin/login`
- Identifiants : ceux du `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- Rôles : `ADMIN` (accès complet + gestion des comptes) · `EDITOR` (contenu)

Modules gérables depuis l'admin : rendez-vous, spécialités, médecins, blog,
témoignages, FAQ, newsletter, contenu (Hero + statistiques + À propos),
paramètres du site (contacts, horaires, réseaux) et utilisateurs.
