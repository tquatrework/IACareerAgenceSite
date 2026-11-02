# Routes

Aucune route n'est authentifiée : le site est public. Les seules routes qui écrivent sont `POST /contact` et `POST /api/devis` (protégées par champ piège, limite de débit de 5 envois / 10 min / IP et taille de corps maximale de 32 Ko). Aucune route d'administration n'existe ; les demandes sont lues directement dans le fichier `data/demandes.jsonl`.

| Méthode | Chemin | Description | Paramètres | Réponse |
|---|---|---|---|---|
| GET | `/` | Accueil : questionnaire, cartes, méthode, citation, réalisations, qualité | — | 200 HTML |
| GET | `/audit-transformation` | Audit & transformation | — | 200 HTML |
| GET | `/solutions-independants` | Packs pour indépendants | — | 200 HTML |
| GET | `/solutions-pme` | Familles de solutions PME | — | 200 HTML |
| GET | `/solutions` | Catalogue des 30 solutions | — | 200 HTML |
| GET | `/solutions/:slug` | Fiche d'un pack ou d'une famille | `slug` : slug d'offre | 200 HTML, 404 si inconnu |
| GET | `/qualite-confiance` | Qualité & confiance | — | 200 HTML |
| GET | `/realisations` | Toutes les réalisations (emplacements) | — | 200 HTML |
| GET | `/realisations/:slug` | Détail d'une réalisation (noindex) | `slug` : emplacement connu | 200 HTML, 404 |
| GET | `/contact` | Formulaire de devis | query facultatifs : `solution` (slug offre/carte), `objet` (`audit`/`solution`/`autre`), `from=questionnaire` | 200 HTML |
| POST | `/contact` | Envoi du formulaire sans JavaScript | formulaire urlencoded (voir champs ci-dessous) | 200 HTML confirmation ; 422 saisie conservée ; 429 ; 500 |
| POST | `/api/devis` | Envoi du formulaire (JavaScript) | JSON (voir champs) | 200 `{ok:true}` ; 422 `{ok:false,errors}` ; 400/413/429/500 `{ok:false,message}` |
| GET | `/mentions-legales` | Mentions légales et confidentialité | — | 200 HTML |
| GET | `/robots.txt`, `/sitemap.xml` | Référencement | — | 200 |
| GET | `/css/*`, `/js/*`, `/shared/*`, `/favicon.svg` | Fichiers statiques | — | 200 / 404 |

Champs du formulaire : `name`*, `email`*, `profile`* (`independant`/`equipe`/`autre`), `objet`* (`audit`/`solution`/`autre`), `message`* (≥ 10 car.), `organisation`, `phone`, `solution`, `quizSummary`, `website` (champ piège, doit rester vide).
