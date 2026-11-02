import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const PROFILES = {
  independant: 'Indépendant',
  equipe: 'Entreprise avec équipe',
  autre: 'Autre',
} as const

export const OBJECTS = {
  audit: 'Audit',
  solution: 'Solution précise',
  autre: 'Autre demande',
} as const

export const devisValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(120),
    email: vine.string().trim().email().maxLength(254),
    organisation: vine.string().trim().maxLength(150).optional(),
    phone: vine
      .string()
      .trim()
      .regex(/^[+()\d\s.-]{6,30}$/)
      .optional(),
    profile: vine.enum(Object.keys(PROFILES) as (keyof typeof PROFILES)[]),
    objet: vine.enum(Object.keys(OBJECTS) as (keyof typeof OBJECTS)[]),
    solution: vine.string().trim().maxLength(120).optional(),
    message: vine.string().trim().minLength(10).maxLength(5000),
    quizSummary: vine.string().trim().maxLength(2000).optional(),
  })
)

devisValidator.messagesProvider = new SimpleMessagesProvider({
  'name.required': 'Indiquez votre nom.',
  'name.minLength': 'Indiquez votre nom.',
  'name.maxLength': 'Ce nom est trop long.',
  'email.required': 'Indiquez votre adresse email.',
  'email.email': 'Cette adresse email semble incomplète.',
  'email.maxLength': 'Cette adresse email est trop longue.',
  'phone.regex': 'Ce numéro de téléphone semble incorrect.',
  'profile.required': 'Choisissez votre profil.',
  'profile.enum': 'Choisissez votre profil.',
  'objet.required': 'Choisissez l’objet de votre demande.',
  'objet.enum': 'Choisissez l’objet de votre demande.',
  'message.required': 'Décrivez votre besoin en quelques mots (10 caractères minimum).',
  'message.minLength': 'Décrivez votre besoin en quelques mots (10 caractères minimum).',
  'message.maxLength': 'Ce message est trop long (5 000 caractères maximum).',
  'quizSummary.maxLength': 'Ce résumé est trop long (2 000 caractères maximum).',
  'organisation.maxLength': 'Ce nom d’organisation est trop long.',
  'solution.maxLength': 'Cette valeur est trop longue.',
  'string': 'Cette valeur est incorrecte.',
})
