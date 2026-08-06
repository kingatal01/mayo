import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../lib/generated/prisma/client'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

const specialties = [
  { title: 'Ophtalmologie', description: 'Diagnostic et traitement des maladies oculaires : troubles de la vision, glaucome, cataracte, rétine et chirurgie réfractive.', color: 'bg-sky-50 text-sky-500 group-hover:bg-sky-500 group-hover:text-white' },
  { title: 'Dentiste', description: 'Soins dentaires complets : détartrage, caries, prothèses, orthodontie et chirurgie buccale pour toute la famille.', color: 'bg-yellow-50 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white' },
  { title: 'Cardiologie', description: 'Prise en charge des maladies du cœur et des vaisseaux : hypertension, insuffisance cardiaque, arythmies et prévention cardiovasculaire.', color: 'bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white' },
  { title: 'Neurologie', description: 'Traitement des maladies du système nerveux : épilepsie, migraines, Parkinson, sclérose en plaques et AVC.', color: 'bg-purple-50 text-purple-500 group-hover:bg-purple-500 group-hover:text-white' },
  { title: 'Pédiatrie', description: "Suivi médical de l'enfant de la naissance à l'adolescence : vaccinations, croissance, maladies infantiles et développement.", color: 'bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white' },
  { title: 'Gynécologie & Obstétrique', description: 'Santé féminine globale : suivi de grossesse, accouchement, contraception, ménopause et pathologies gynécologiques.', color: 'bg-pink-50 text-pink-500 group-hover:bg-pink-500 group-hover:text-white' },
  { title: 'Orthopédie', description: 'Chirurgie et rééducation des pathologies ostéo-articulaires : fractures, prothèses de hanche et genou, colonne vertébrale.', color: 'bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white' },
  { title: 'Rhumatologie', description: 'Diagnostic et traitement des maladies inflammatoires et dégénératives des articulations : arthrite, lupus, polyarthrite rhumatoïde.', color: 'bg-teal-50 text-teal-500 group-hover:bg-teal-500 group-hover:text-white' },
  { title: 'Diabétologie', description: 'Prise en charge du diabète de type 1 et 2 : insulinothérapie, équilibre glycémique, prévention des complications et éducation thérapeutique.', color: 'bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white' },
  { title: 'Nutrition', description: "Conseils nutritionnels personnalisés pour la gestion du poids, les pathologies chroniques, les troubles alimentaires et l'optimisation de la santé.", color: 'bg-lime-50 text-lime-500 group-hover:bg-lime-500 group-hover:text-white' },
  { title: 'Chirurgie Viscérale', description: "Interventions chirurgicales des organes de l'abdomen : appendicite, hernies, vésicule biliaire, côlon et chirurgie bariatrique.", color: 'bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white' },
  { title: 'Neurochirurgie', description: 'Chirurgie du cerveau, de la moelle épinière et du système nerveux périphérique : tumeurs, hernies discales, anévrysmes et traumatismes.', color: 'bg-violet-50 text-violet-500 group-hover:bg-violet-500 group-hover:text-white' },
  { title: 'Chirurgie Vasculaire', description: "Traitement des maladies des artères et veines : varices, artérite, anévrysme de l'aorte et thrombose veineuse profonde.", color: 'bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white' },
  { title: 'Médecine du Travail', description: 'Surveillance de la santé des salariés, prévention des risques professionnels, aptitude au poste et accompagnement des travailleurs.', color: 'bg-cyan-50 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white' },
  { title: 'Gastro-Entérologie', description: 'Exploration et traitement des maladies digestives : ulcères, coloscopie, maladie de Crohn, hépatite et reflux gastro-œsophagien.', color: 'bg-green-50 text-green-500 group-hover:bg-green-500 group-hover:text-white' },
  { title: 'MPR — Médecine Physique & Réadaptation', description: "Rééducation fonctionnelle après AVC, traumatismes, chirurgies orthopédiques et maladies neurologiques pour retrouver l'autonomie.", color: 'bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white' },
  { title: 'Urologie', description: "Soins des voies urinaires et de l'appareil génital masculin : lithiases rénales, prostate, infections urinaires et incontinence.", color: 'bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white' },
  { title: 'Hématologie', description: 'Diagnostic et traitement des maladies du sang et de la moelle osseuse : anémies, leucémies, lymphomes et troubles de la coagulation.', color: 'bg-red-50 text-red-500 group-hover:bg-red-600 group-hover:text-white' },
  { title: 'Expertise Médicale', description: "Évaluations médico-légales, expertises d'incapacité, certificats médicaux et bilans pour assurances, tribunaux et organismes sociaux.", color: 'bg-slate-50 text-slate-500 group-hover:bg-slate-500 group-hover:text-white' },
  { title: 'Urgences', description: 'Prise en charge immédiate 24h/24 et 7j/7 des situations médicales urgentes : traumatismes, douleurs aiguës, détresses respiratoires.', color: 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white' },
  { title: 'Oncologie', description: 'Diagnostic et traitement des cancers : chimiothérapie, immunothérapie, suivi oncologique et soins de support pour les patients atteints de cancer.', color: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' },
  { title: 'Imagerie Médicale', description: 'Radiologie conventionnelle, échographie, scanner (TDM), IRM et mammographie pour un diagnostic précis et rapide.', color: 'bg-gray-50 text-gray-500 group-hover:bg-gray-600 group-hover:text-white' },
  { title: 'Laboratoire & Biologie Médicale', description: 'Analyses biologiques complètes : bilan sanguin, sérologies, bactériologie, hormonologie et génétique médicale avec résultats rapides.', color: 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white' },
  { title: 'Chirurgie Maxillo-Faciale', description: 'Chirurgie reconstructrice et fonctionnelle du visage, des mâchoires et de la cavité buccale : tumeurs, traumatismes et malformations.', color: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white' },
  { title: 'Chirurgie Esthétique', description: 'Chirurgie plastique reconstructrice et esthétique : rhinoplastie, liposuccion, lifting, augmentation mammaire et médecine esthétique.', color: 'bg-fuchsia-50 text-fuchsia-500 group-hover:bg-fuchsia-500 group-hover:text-white' },
]

const doctors = [
  { name: 'Dr. Hamir Jun', specialty: 'Gastro-Entérologie', initials: 'HJ', color: 'from-blue-400 to-blue-600' },
  { name: 'Dr. Gideu Ds', specialty: 'Neurologie', initials: 'GD', color: 'from-purple-400 to-purple-600' },
  { name: 'Dr. Huduei Chy', specialty: 'Orthopédie', initials: 'HC', color: 'from-teal-400 to-teal-600' },
  { name: 'Dr. Marke Ah', specialty: 'Gynécologie & Obstétrique', initials: 'MA', color: 'from-pink-400 to-pink-600' },
  { name: 'Dr. David Sh', specialty: 'Cardiologie', initials: 'DS', color: 'from-green-400 to-green-600' },
  { name: 'Dr. Fajr Sadiq', specialty: 'Ophtalmologie', initials: 'FS', color: 'from-orange-400 to-orange-600' },
]

const blogPosts = [
  {
    title: '250 conseils médicaux essentiels à connaître',
    slug: '250-conseils-medicaux-essentiels',
    category: 'Conseils Santé',
    excerpt: 'Découvrez des centaines de conseils médicaux pratiques de nos médecins experts pour vous aider à maintenir un mode de vie sain et prévenir les maladies courantes.',
    color: 'from-blue-400 to-blue-600',
    readTime: '5 min de lecture',
    published: true,
    publishedAt: new Date('2024-03-15'),
  },
  {
    title: '100 astuces bien-être que nous devions partager',
    slug: '100-astuces-bien-etre',
    category: 'Bien-être',
    excerpt: 'Une sélection de conseils bien-être essentiels de nos professionnels de santé pour vous aider à mener une vie plus saine et épanouissante au quotidien.',
    color: 'from-teal-400 to-teal-600',
    readTime: '4 min de lecture',
    published: true,
    publishedAt: new Date('2024-03-08'),
  },
  {
    title: "L'importance des bilans de santé réguliers",
    slug: 'importance-bilans-sante-reguliers',
    category: 'Prévention',
    excerpt: "Découvrez pourquoi programmer des bilans de santé réguliers est l'une des décisions les plus importantes pour votre santé à long terme et la détection précoce des maladies.",
    color: 'from-purple-400 to-purple-600',
    readTime: '3 min de lecture',
    published: true,
    publishedAt: new Date('2024-02-28'),
  },
]

const testimonials = [
  { name: 'Aïcha Mahamat', role: "Directrice d'entreprise", text: "L'équipe médicale est absolument remarquable. Ils m'ont traitée avec un soin et un professionnalisme exceptionnels. Je suis profondément reconnaissante pour le service attentionné reçu tout au long de ma convalescence.", initials: 'AM', color: 'bg-blue-500', approved: true },
  { name: 'Ibrahim Oumar', role: 'Ingénieur', text: "Je suis patient ici depuis plusieurs années et je peux affirmer en toute confiance que c'est le meilleur établissement médical que j'aie jamais fréquenté. Les médecins sont compétents et le personnel toujours serviable.", initials: 'IO', color: 'bg-purple-500', approved: true },
  { name: 'Fatima Hassan', role: 'Enseignante', text: "Une expérience de soins exceptionnelle du début à la fin. La prise de rendez-vous était simple, l'attente minimale, et le médecin attentif et bienveillant. Je recommande vivement cette clinique à tous.", initials: 'FH', color: 'bg-green-500', approved: true },
  { name: 'Moussa Ali', role: "Chef d'entreprise", text: "Cette clinique a complètement changé ma vision des soins de santé. Le niveau d'attention et les soins personnalisés que j'ai reçus m'ont fait me sentir véritablement pris en charge. Un personnel exemplaire.", initials: 'MA', color: 'bg-pink-500', approved: true },
  { name: 'Mariam Adoum', role: 'Pharmacienne', text: "Dès mon arrivée, je me suis sentie accueillie et bien prise en charge. Les médecins ont pris le temps de tout expliquer clairement et ont répondu à toutes mes préoccupations. Un établissement vraiment centré sur le patient.", initials: 'MA', color: 'bg-yellow-500', approved: true },
  { name: 'Saleh Brahim', role: 'Fonctionnaire', text: "Service et soins remarquables ! Les professionnels de santé vont au-delà des attentes pour leurs patients. Je suis très reconnaissant pour la qualité du traitement reçu. Le meilleur établissement de la région.", initials: 'SB', color: 'bg-red-500', approved: true },
]

const faqs = [
  { question: 'Comment prendre rendez-vous dans votre clinique ?', answer: "Vous pouvez prendre rendez-vous directement en ligne via le formulaire de notre site, par téléphone au (235) 30031414 / 65173434, ou en vous présentant à notre accueil. Notre équipe confirmera votre rendez-vous dans les 24 heures et vous indiquera les documents à apporter." },
  { question: "Quels sont vos horaires d'ouverture ?", answer: "Notre clinique est ouverte du lundi au samedi de 8h00 à 18h00. Notre service d'urgence est disponible 24h/24 et 7j/7 pour toute situation médicale urgente. En dehors des heures d'ouverture, un médecin de garde reste joignable par téléphone." },
  { question: 'Quelles assurances et mutuelles acceptez-vous ?', answer: "Nous travaillons avec la plupart des organismes d'assurance maladie et mutuelles. Nous vous recommandons de vérifier la prise en charge auprès de votre assureur avant votre consultation. Notre service administratif peut également vous accompagner dans vos démarches de remboursement." },
  { question: "Quels services d'urgence proposez-vous ?", answer: "Notre service des urgences est disponible 24h/24 et 7j/7. Il prend en charge les traumatismes, douleurs aiguës, détresses respiratoires, et toutes autres urgences médicales. Une équipe de médecins qualifiés est présente en permanence pour vous apporter des soins immédiats." },
]

const settings = [
  { key: 'phone', value: '+235 300 31 414 / +235 651 173 3434' },
  { key: 'email', value: 'contact@mayoklinic.org' },
  { key: 'address', value: "Boulevard du Maréchal Idriss Déby Itno, Quartier Sabangali, N'Djamena, Tchad" },
  { key: 'latitude', value: '12.0969048' },
  { key: 'longitude', value: '15.0590096' },
  { key: 'hours', value: 'Lun–Ven : 08h30 – 16h30 · Sam : 08h30 – 13h00' },
  { key: 'emergency', value: '24h/24 et 7j/7' },
  { key: 'facebook', value: '' },
  { key: 'twitter', value: '' },
  { key: 'instagram', value: '' },
  // Section À propos
  { key: 'about_title', value: "Une clinique pensée pour l'excellence médicale" },
  { key: 'about_paragraph1', value: "La Mayo Klinic de Sabangali (N'Djamena, Tchad) est une structure hospitalière haut de gamme dotée d'un plateau technique avancé, dédiée aux urgences, aux soins critiques, aux interventions chirurgicales et aux consultations spécialisées." },
  { key: 'about_paragraph2', value: "Notre mission est simple : garantir à chaque patient un accès rapide, sûr et maîtrisé à des soins de qualité — que ce soit pour une urgence, un suivi chronique, un bilan médical d'entreprise ou une évacuation sanitaire internationale." },
  { key: 'about_image', value: '/image_face.jpeg' },
  { key: 'about_badge1_value', value: '24/7' },
  { key: 'about_badge1_label', value: 'Urgences & soins critiques' },
  { key: 'about_badge2_value', value: '15 min' },
  { key: 'about_badge2_label', value: "De la clinique à l'aéroport" },
]

const heroSlides = [
  {
    tag: 'Mayo Klinic — Sabangali, N\'Djamena',
    title: "La médecine d'excellence, au cœur de N'Djamena",
    description: "Structure hospitalière haut de gamme dotée d'un plateau technique avancé : urgences, soins critiques, chirurgie et consultations spécialisées, disponibles 24h/24 et 7j/7.",
    ctaLabel: 'Prendre rendez-vous',
    ctaHref: '#appointment',
    image: '/image_face.jpeg',
  },
  {
    tag: 'Urgences & soins critiques',
    title: 'Une prise en charge rapide, à toute heure',
    description: "Nos urgences sont ouvertes 24h/24 et 7j/7. Dès votre arrivée, votre situation est évaluée immédiatement pour vous orienter vers la prise en charge adaptée.",
    ctaLabel: 'Urgences 24/7',
    ctaHref: '#appointment',
    image: '/image1.jpeg',
  },
  {
    tag: 'Entreprises & institutions',
    title: 'Des solutions santé sur-mesure pour vos équipes',
    description: "Abonnements corporate, médecine du travail, cliniques mobiles et évacuation médicale (CaseVac/MedEvac) pour vos collaborateurs sur le terrain.",
    ctaLabel: 'Nos services',
    ctaHref: '#service',
    image: '/image_face.jpeg',
  },
]

const stats: { section: 'HERO' | 'ABOUT'; value: string; label: string }[] = [
  { section: 'HERO', value: '24/7', label: 'Urgences et régulation médicale' },
  { section: 'HERO', value: '15', label: 'Unités et plateaux techniques' },
  { section: 'HERO', value: '15 min', label: "Clinique → Aéroport international" },
  { section: 'HERO', value: '3', label: 'Trajectoires de sortie possibles' },
  { section: 'ABOUT', value: '24/7', label: 'Urgences sans interruption' },
  { section: 'ABOUT', value: '15', label: 'Unités et plateaux techniques' },
  { section: 'ABOUT', value: '15 min', label: "De la clinique à l'aéroport" },
  { section: 'ABOUT', value: '6+', label: 'Hôpitaux pivots partenaires' },
]

async function main() {
  for (const [i, s] of specialties.entries()) {
    await prisma.specialty.upsert({
      where: { title: s.title },
      update: { description: s.description, color: s.color, order: i },
      create: { ...s, order: i },
    })
  }
  console.log(`✔ ${specialties.length} spécialités`)

  if ((await prisma.doctor.count()) === 0) {
    await prisma.doctor.createMany({ data: doctors.map((d, i) => ({ ...d, order: i })) })
  }
  console.log(`✔ ${doctors.length} médecins`)

  for (const p of blogPosts) {
    await prisma.blogPost.upsert({ where: { slug: p.slug }, update: {}, create: p })
  }
  console.log(`✔ ${blogPosts.length} articles`)

  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({ data: testimonials })
  }
  console.log(`✔ ${testimonials.length} témoignages`)

  if ((await prisma.faq.count()) === 0) {
    await prisma.faq.createMany({ data: faqs.map((f, i) => ({ ...f, order: i })) })
  }
  console.log(`✔ ${faqs.length} FAQ`)

  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s })
  }
  console.log(`✔ ${settings.length} paramètres`)

  // Hero et statistiques : contenu canonique du client — on remplace à chaque seed.
  await prisma.heroSlide.deleteMany()
  await prisma.heroSlide.createMany({ data: heroSlides.map((s, i) => ({ ...s, order: i })) })
  console.log(`✔ ${heroSlides.length} slides Hero`)

  await prisma.stat.deleteMany()
  await prisma.stat.createMany({ data: stats.map((s, i) => ({ ...s, order: i })) })
  console.log(`✔ ${stats.length} statistiques`)

  // Utilisateur admin initial (identifiants depuis .env, avec repli).
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@mayoklinic.td').toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD || 'mayoklinic2026'
  if ((await prisma.user.count()) === 0) {
    await prisma.user.create({
      data: {
        name: 'Administrateur',
        email: adminEmail,
        passwordHash: await bcrypt.hash(adminPassword, 10),
        role: 'ADMIN',
      },
    })
    console.log(`✔ utilisateur admin créé (${adminEmail})`)
  } else {
    console.log('✔ utilisateurs déjà présents (admin non recréé)')
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
