# agence.iacareer.fr

Site de l'agence IA d'IACareer, conforme à [specs.md](specs.md). Node.js ≥ 20, aucune dépendance.

```
npm start        # http://127.0.0.1:3000 (PORT et HOST modifiables, voir .env.example)
npm test
```

- `shared/` : catalogue des 30 cartes et moteur du questionnaire (utilisés par le serveur et le navigateur).
- `src/` : serveur, pages rendues côté serveur, validation du devis. `public/` : CSS et JavaScript.
- Les demandes de devis sont enregistrées dans `DEVIS_FILE` (par défaut `data/demandes.jsonl`). **À décider** : envoi vers contact@iacareer.fr.
- Routes : [docs/routes.md](docs/routes.md).

## Restant à fournir (specs §15)
Logo officiel, prix/délais, quatre réalisations, partenaires et experts, mentions légales complètes (marquées « À compléter » sur la page).
