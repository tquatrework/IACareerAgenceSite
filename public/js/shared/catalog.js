// Catalogue de travail : 30 cartes (specs.md §6.3). Partagé entre le serveur et le navigateur.
// Les cartes décrivent des types de solutions, pas des prestations déjà livrées.

export const FAMILIES = {
  presence: 'Présence & contenus',
  messagerie: 'Mails & organisation',
  relation: 'Relation client',
  pilotage: 'Pilotage & données',
  documents: 'Documents',
  assistants: 'Assistants',
  applications: 'Applications & connexions',
  audit: 'Audit & feuille de route',
}

// offer : fiche détaillée (/solutions/<offer>) ; audit renvoie vers /audit-transformation.
// clarify : point à préciser avant cadrage (affiché dans la synthèse du questionnaire).
// teamOnly : carte sans sens pour une activité exercée seul.
export const CARDS = [
  { id: 1, slug: 'site-web-ia', title: 'Site web développé avec l’IA', family: 'presence', offer: 'site-presence-en-ligne', summary: 'Création d’un site adapté à votre activité, avec un coût et une maintenance maîtrisés. Nous distinguons un site réalisé avec l’aide de l’IA d’un site qui intègre des fonctions d’IA.', clarify: 'Avez-vous déjà un site, un nom de domaine, des contenus à reprendre ?' },
  { id: 2, slug: 'visibilite-seo-geo', title: 'Visibilité SEO / GEO', family: 'presence', offer: 'site-presence-en-ligne', summary: 'Structurer le site et les contenus pour être trouvé dans les moteurs de recherche (SEO) et cité dans les réponses des moteurs d’IA (GEO).', clarify: 'Quel est votre site actuel et quelles recherches souhaitez-vous couvrir ?' },
  { id: 3, slug: 'mails-tri-reponses', title: 'Mails : tri et réponses préparées', family: 'messagerie', offer: 'messagerie-organisation', summary: 'Classement des messages, repérage des demandes importantes, actions à prévoir et brouillons de réponse que vous relisez avant envoi.', clarify: 'Quelle messagerie utilisez-vous et quels messages sont les plus fréquents ?' },
  { id: 4, slug: 'rendez-vous-notes-actions', title: 'Rendez-vous : notes et actions', family: 'messagerie', offer: 'messagerie-organisation', summary: 'Synthèse des échanges, engagements pris et prochaines actions, avec préparation du suivi.', clarify: 'Comment se déroulent vos rendez-vous (visio, téléphone, en personne) ?' },
  { id: 5, slug: 'relances-echeances', title: 'Relances et échéances', family: 'messagerie', offer: 'relation-client', summary: 'Suivi des devis, des factures, des documents attendus et des dates importantes, pour ne plus rien oublier.', clarify: 'Où sont aujourd’hui notées vos échéances et vos relances ?' },
  { id: 6, slug: 'crm-connecte-ia', title: 'CRM connecté à l’IA', family: 'relation', offer: 'relation-client', summary: 'Un CRM (outil de suivi des clients) dont les fiches et les synthèses d’échanges se mettent à jour à partir des outils que vous utilisez déjà.', clarify: 'Possédez-vous déjà un CRM ou des fichiers de suivi, et peut-on les relier ?' },
  { id: 7, slug: 'qualification-prospects', title: 'Qualification des prospects', family: 'relation', offer: 'relation-client', summary: 'Qualification des demandes entrantes et préparation des informations utiles au traitement commercial.', clarify: 'D’où viennent vos demandes entrantes et quels critères utilisez-vous pour les trier ?' },
  { id: 8, slug: 'devis-propositions', title: 'Devis et propositions', family: 'relation', offer: 'relation-client', summary: 'Préparation de documents commerciaux à partir de vos offres, de vos tarifs et d’informations validées par vous.', clarify: 'Vos offres et tarifs sont-ils formalisés et à jour ?' },
  { id: 9, slug: 'tableau-de-bord-activite', title: 'Tableau de bord de l’activité', family: 'pilotage', offer: 'pilotage-activite', summary: 'Regroupement des indicateurs utiles, synthèse et mise en évidence des points à examiner.', clarify: 'Quels chiffres suivez-vous et dans quels outils se trouvent-ils ?' },
  { id: 10, slug: 'rapports-periodiques', title: 'Rapports périodiques', family: 'pilotage', offer: 'pilotage-activite', summary: 'Préparation de bilans et de comptes rendus à partir des données de votre activité.', clarify: 'Quels rapports produisez-vous, à quel rythme et pour qui ?' },
  { id: 11, slug: 'publications-newsletters', title: 'Publications et newsletters', family: 'presence', offer: 'communication', summary: 'Aide à la communication à partir de vos références et des informations de votre entreprise.', clarify: 'Quels canaux utilisez-vous et à quelle fréquence souhaitez-vous publier ?' },
  { id: 12, slug: 'documents-commerciaux', title: 'Documents commerciaux', family: 'presence', offer: 'communication', summary: 'Présentations, fiches produits, catalogues et autres supports cohérents entre eux.', clarify: 'Disposez-vous d’une charte graphique et de supports existants ?' },
  { id: 13, slug: 'classement-documentaire', title: 'Classement documentaire', family: 'documents', offer: 'documents-administratif', summary: 'Organisation, nommage et recherche dans vos documents.', clarify: 'Où sont stockés vos documents et en quelle quantité ?' },
  { id: 14, slug: 'extraction-donnees', title: 'Extraction de données documentaires', family: 'documents', offer: 'documents-administratif', summary: 'Récupération d’informations dans des pièces (factures, courriers, formulaires) et préparation du remplissage d’outils ou de dossiers.', clarify: 'Quels types de documents, et dans quel outil les informations doivent-elles arriver ?' },
  { id: 15, slug: 'verification-dossiers', title: 'Vérification des dossiers', family: 'documents', offer: 'documents-administratif', summary: 'Contrôle de complétude et application de règles métier que vous avez explicitement définies.', clarify: 'Les règles de vérification sont-elles écrites ?' },
  { id: 16, slug: 'assistant-documentaire-rag', title: 'Assistant documentaire — RAG', family: 'assistants', offer: 'assistant-documentaire-rag', summary: 'Posez vos questions à un ensemble de documents : le RAG (recherche augmentée) répond en citant les sources utilisées.', clarify: 'Quels documents seraient concernés, et sont-ils accessibles sous forme numérique ?' },
  { id: 17, slug: 'support-client-chatbot', title: 'Support client — chatbot', family: 'assistants', offer: 'support-client-interne', summary: 'Réponses aux demandes récurrentes, qualification, et transmission à une personne lorsque c’est nécessaire.', clarify: 'Quelles sont les questions les plus fréquentes et sur quel canal arrivent-elles ?' },
  { id: 18, slug: 'accueil-telephonique-ia', title: 'Accueil téléphonique IA', family: 'assistants', offer: 'support-client-interne', summary: 'Orientation des appels, qualification, prise de rendez-vous et transfert vers un interlocuteur.', clarify: 'Quel volume d’appels et quels cas doivent toujours être transférés à une personne ?' },
  { id: 19, slug: 'prise-rendez-vous-suivi', title: 'Prise de rendez-vous et suivi', family: 'messagerie', offer: 'messagerie-organisation', summary: 'Gestion des disponibilités, confirmations et rappels.', clarify: 'Quel agenda utilisez-vous et quelles règles de disponibilité s’appliquent ?' },
  { id: 20, slug: 'agent-partage-equipe', title: 'Agent partagé par une équipe', family: 'assistants', offer: 'agent-equipe', teamOnly: true, summary: 'Un assistant commun, avec des instructions, des documents et des outils définis pour l’équipe.', clarify: 'Qui l’utiliserait, avec quels droits d’accès et sur quels documents ?' },
  { id: 21, slug: 'application-metier', title: 'Application métier sur mesure', family: 'applications', offer: 'applications-metier', summary: 'Un outil construit pour un processus particulier de votre entreprise.', clarify: 'Quel processus, quels utilisateurs, et que fait-on aujourd’hui à la place ?' },
  { id: 22, slug: 'portail-client-extranet', title: 'Portail client / extranet', family: 'applications', offer: 'applications-metier', summary: 'Un espace de suivi, de documents et d’échanges entre votre entreprise et ses interlocuteurs.', clarify: 'Qui s’y connecterait, et quelles informations pourraient y figurer ?' },
  { id: 23, slug: 'connexion-outils-mcp-api', title: 'Connexion aux outils internes — MCP / API', family: 'applications', offer: 'connexions-outils-internes', summary: 'Connecter assistants et agents aux fonctions autorisées de vos logiciels, via une API (interface d’un logiciel) ou MCP (standard de connexion pour assistants IA).', clarify: 'Quels logiciels, et offrent-ils une API ou un accès documenté ?' },
  { id: 24, slug: 'automatisation-logiciels', title: 'Automatisation entre logiciels', family: 'applications', offer: 'automatisation-processus', summary: 'Faire circuler l’information entre vos outils et réduire les ressaisies.', clarify: 'Quels logiciels sont concernés et quelles informations sont aujourd’hui ressaisies ?' },
  { id: 25, slug: 'centralisation-donnees', title: 'Centralisation et fiabilisation des données', family: 'pilotage', offer: 'donnees-pilotage', summary: 'Rapprochement des sources, traitement des doublons et informations cohérentes d’un outil à l’autre.', clarify: 'Quelles sources de données, et lesquelles font référence en cas de désaccord ?' },
  { id: 26, slug: 'assistant-rh-integration', title: 'Assistant interne RH / intégration', family: 'assistants', offer: 'support-client-interne', teamOnly: true, summary: 'Accès aux procédures et accompagnement administratif de l’arrivée de nouveaux collaborateurs.', clarify: 'Les procédures d’accueil sont-elles écrites et à jour ?' },
  { id: 27, slug: 'veille-synthese', title: 'Veille et synthèse ciblées', family: 'documents', offer: 'assistant-documentaire-rag', summary: 'Suivi de sources choisies, synthèses et alertes adaptées à un sujet.', clarify: 'Quel sujet, quelles sources, et à quel rythme souhaitez-vous être alerté ?' },
  { id: 28, slug: 'recherche-catalogue-produits', title: 'Recherche dans un catalogue de produits', family: 'documents', offer: 'assistant-documentaire-rag', summary: 'Identifier les produits qui répondent à un besoin, avec accès aux références et aux fiches techniques.', clarify: 'Combien de références, et sous quelle forme sont vos fiches produits ?' },
  { id: 29, slug: 'reprise-securisation-application', title: 'Reprise et sécurisation d’application', family: 'applications', offer: 'reprise-outils-existants', summary: 'Amélioration d’un outil existant, y compris lorsqu’il a été réalisé avec l’aide de l’IA.', clarify: 'Quel outil, qui l’a conçu, et dispose-t-on du code source ?' },
  { id: 30, slug: 'audit-feuille-de-route', title: 'Audit et feuille de route IA', family: 'audit', offer: null, summary: 'Analyse de maturité, identification des opportunités et organisation des prochaines étapes.', clarify: 'Quels usages existent déjà et quels objectifs poursuivez-vous ?' },
]

export function cardHref(card) {
  return card.offer ? `/solutions/${card.offer}` : '/audit-transformation'
}

export function findCard(id) {
  return CARDS.find((card) => card.id === id)
}
