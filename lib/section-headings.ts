// En-têtes des sections de la page d'accueil (surtitre / titre / sous-titre).
// Stockés en paramètres libres sous la forme `section_<clé>_<champ>` afin de
// rester éditables depuis Admin > Contenu sans migration de schéma.
//
// Ce fichier est importé par des composants client : il ne doit dépendre de
// rien de côté serveur. La lecture en BD vit dans `section-headings.server.ts`.

export type SectionHeading = {
  eyebrow: string
  title: string
  subtitle: string
}

export type SectionField = keyof SectionHeading

type SectionDefinition = {
  /** Libellé affiché dans l'admin */
  label: string
  /** Champs réellement utilisés par la section publique */
  fields: SectionField[]
  defaults: SectionHeading
}

export const SECTION_DEFINITIONS = {
  provide: {
    label: 'Ce que nous offrons',
    fields: ['eyebrow', 'title', 'subtitle'],
    defaults: {
      eyebrow: 'Nos Atouts',
      title: 'Ce que nous offrons pour votre santé',
      subtitle:
        'Nous proposons une gamme complète de services de santé conçus pour répondre à tous vos besoins médicaux avec qualité et bienveillance.',
    },
  },
  about: {
    label: 'À propos (surtitre)',
    fields: ['eyebrow'],
    defaults: { eyebrow: 'À Propos', title: '', subtitle: '' },
  },
  services: {
    label: 'Spécialités médicales',
    fields: ['eyebrow', 'title', 'subtitle'],
    defaults: {
      eyebrow: 'Ce que nous proposons',
      title: 'Nos Spécialités Médicales',
      subtitle:
        'Un large éventail de spécialités médicales pour répondre à tous vos besoins de santé avec expertise et bienveillance.',
    },
  },
  testimonials: {
    label: 'Témoignages',
    fields: ['eyebrow', 'title', 'subtitle'],
    defaults: {
      eyebrow: 'Témoignages',
      title: 'Ce que disent nos patients',
      subtitle: 'Des témoignages authentiques de patients ayant bénéficié de nos services de santé de qualité.',
    },
  },
  faq: {
    label: 'FAQ',
    fields: ['eyebrow', 'title', 'subtitle'],
    defaults: {
      eyebrow: 'FAQ',
      title: 'Toutes vos réponses en un seul endroit',
      subtitle:
        "Retrouvez les réponses aux questions les plus fréquentes sur notre clinique, notre équipe et nos services. Pour toute autre question, n'hésitez pas à nous contacter.",
    },
  },
  team: {
    label: 'Notre Équipe',
    fields: ['eyebrow', 'title', 'subtitle'],
    defaults: {
      eyebrow: 'Notre Équipe',
      title: 'Rencontrez nos Médecins',
      subtitle:
        'Notre équipe de professionnels médicaux expérimentés et dévoués est là pour vous offrir les meilleurs soins possibles.',
    },
  },
  recruitment: {
    label: 'Recrutement',
    fields: ['eyebrow', 'title', 'subtitle'],
    defaults: {
      eyebrow: 'Rejoignez-nous',
      title: 'Nous recrutons',
      subtitle:
        "Participez à une médecine d'excellence au Tchad. Découvrez nos postes ouverts et postulez en ligne.",
    },
  },
  blog: {
    label: 'Blog',
    fields: ['eyebrow', 'title', 'subtitle'],
    defaults: {
      eyebrow: 'Notre Blog',
      title: 'Dernières Actualités',
      subtitle:
        'Restez informé des dernières actualités médicales, conseils santé et recommandations bien-être de nos experts.',
    },
  },
  appointment: {
    label: 'Prendre rendez-vous',
    fields: ['eyebrow', 'title', 'subtitle'],
    defaults: {
      eyebrow: 'Réservation',
      title: 'Prendre Rendez-vous',
      subtitle: 'Remplissez le formulaire ci-dessous et notre équipe confirmera votre rendez-vous dans les 24 heures.',
    },
  },
} satisfies Record<string, SectionDefinition>

export type SectionKey = keyof typeof SECTION_DEFINITIONS
export type SectionHeadings = Record<SectionKey, SectionHeading>

export const SECTION_KEYS = Object.keys(SECTION_DEFINITIONS) as SectionKey[]

export const SECTION_SETTING_PREFIX = 'section_'

export function settingKey(section: SectionKey, field: SectionField): string {
  return `${SECTION_SETTING_PREFIX}${section}_${field}`
}

// Toutes les clés de paramètres réellement utilisées (champs déclarés seulement).
export const SECTION_SETTING_KEYS = SECTION_KEYS.flatMap((section) =>
  SECTION_DEFINITIONS[section].fields.map((field) => settingKey(section, field as SectionField)),
)

export function defaultSectionHeadings(): SectionHeadings {
  return Object.fromEntries(
    SECTION_KEYS.map((key) => [key, { ...SECTION_DEFINITIONS[key].defaults }]),
  ) as SectionHeadings
}

// Applique les valeurs stockées par-dessus les valeurs par défaut.
export function mergeSectionHeadings(values: Record<string, string>): SectionHeadings {
  const headings = defaultSectionHeadings()
  for (const section of SECTION_KEYS) {
    for (const field of SECTION_DEFINITIONS[section].fields as SectionField[]) {
      const stored = values[settingKey(section, field)]
      if (stored !== undefined && stored.trim()) headings[section][field] = stored
    }
  }
  return headings
}
