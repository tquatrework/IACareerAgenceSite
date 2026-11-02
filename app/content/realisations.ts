// Quatre emplacements prévus (specs.md §11). Aucune réalisation n’est encore documentée :
// ces entrées sont des pistes de projets internes, clairement présentées comme non livrées.

export const REALISATIONS = [
  { slug: 'gestion-des-mails', title: 'Gestion des mails', theme: 'Messagerie' },
  { slug: 'suivi-commercial', title: 'Suivi commercial', theme: 'Relation client' },
  { slug: 'assistant-documentaire', title: 'Assistant documentaire', theme: 'Documents' },
  { slug: 'tableau-de-bord', title: 'Tableau de bord', theme: 'Pilotage' },
].map((item) => ({
  ...item,
  nature: 'Projet interne IACareer',
  status: 'Piste de projet — fiche à venir',
  summary: 'Emplacement réservé à un outil conçu pour les besoins d’IACareer. Aucune réalisation n’est publiée à ce jour : la fiche sera renseignée lorsque le projet aura été mené et documenté.',
}))

export function findRealisation(slug: string) {
  return REALISATIONS.find((item) => item.slug === slug)
}

export const FICHE_SECTIONS = [
  'Nom et nature du projet',
  'Contexte et besoin initial',
  'Utilisateurs concernés',
  'Ce qui a été réalisé',
  'Outils et informations concernés',
  'Captures ou présentation de l’outil réel',
  'Place de l’IA et interventions humaines',
  'Résultats observés, avec leur contexte',
  'Limites et état d’avancement',
]
