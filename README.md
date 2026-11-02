# agence.iacareer.fr

Site de l'agence IA d'IACareer, conforme à [specs.md](specs.md). **AdonisJS 6** (TypeScript, Edge), Node.js ≥ 20.

## Développement

```
npm install
cp .env.example .env     # puis renseigner APP_KEY : node ace generate:key
npm run dev              # http://localhost:3333
npm test                 # tests unitaires et fonctionnels (Japa)
npm run typecheck
```

## Structure

- `start/routes.ts` : routes (détail dans [docs/routes.md](docs/routes.md)). `start/limiter.ts` : limite de débit.
- `app/controllers/`, `app/services/`, `app/validators/` : fiches, formulaire de devis (VineJS), enregistrement.
- `app/content/` : packs, familles de solutions et emplacements de réalisations.
- `resources/views/` : vues Edge (`components/` pour les éléments réutilisés).
- `public/` : CSS et JavaScript du navigateur. `public/js/shared/` contient le catalogue des 30 cartes et le moteur du questionnaire, écrits en JavaScript pour être servis tels quels ; le serveur les réutilise via `app/shared/`.

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `APP_KEY` | Clé de l'application (`node ace generate:key`) |
| `PORT`, `HOST` | Port et interface d'écoute |
| `LIMITER_STORE` | `memory` (par défaut) |
| `DEVIS_FILE` | Fichier des demandes de devis, JSON Lines (défaut : `storage/demandes.jsonl`) |
| `TRUSTED_PROXIES` | Adresses des reverse proxys de confiance, séparées par des virgules (ex. `127.0.0.1`). Nécessaire derrière nginx/Caddy pour que la limite de débit utilise l'IP réelle du visiteur |

## Déploiement

```
npm run build
cd build
npm ci --omit=dev
# créer build/.env (NODE_ENV=production, APP_KEY, PORT, HOST=127.0.0.1, TRUSTED_PROXIES=127.0.0.1…)
node bin/server.js       # à lancer comme service (pm2 ou systemd), comme les autres applications AdonisJS
```

Puis un bloc nginx/Caddy pour `agence.iacareer.fr` qui redirige vers le port choisi. Le dossier `storage/` (demandes de devis) doit être persistant entre deux déploiements et sauvegardé.

## Limites connues

- Les demandes de devis sont enregistrées dans un fichier ; **l'envoi vers contact@iacareer.fr reste à décider**.
- La limite de 10 demandes par heure et par IP est tenue en mémoire : elle repart de zéro au redémarrage et n'est pas partagée entre instances.

## Restant à fournir (specs §15)

Logo officiel, prix et délais, quatre réalisations, partenaires et experts, mentions légales complètes (marquées « À compléter » sur la page).
