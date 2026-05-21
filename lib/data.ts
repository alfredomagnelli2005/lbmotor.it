// ============================================================
// LIB/DATA.TS — DATI MOCK
// ============================================================
// Sostituire questi dati con chiamate al database reale.
// Struttura consigliata: MongoDB o PostgreSQL.
// I campi corrispondono a quanto atteso dalle pagine del sito.
// ============================================================

export interface Car {
  id: string
  name: string
  brand: string
  model: string
  year: number
  price: number           // prezzo noleggio giornaliero o prezzo vendita
  image: string
  images: string[]
  fuel: string
  transmission: string
  seats: number
  km?: number             // solo per vendita
  color: string
  description: string
  available?: boolean     // solo per noleggio
  type: 'noleggio' | 'vendita'
  features: string[]
  // Vincoli contrattuali noleggio
  contractTerms?: {
    depositoPercentuale: number   // es. 30
    kmGiornalieriInclusi: number  // es. 200
    costoPerkm: number            // costo per km extra
    etaMinima: number             // anni
    patenteMinima: string         // es. "B"
    assicurazione: string         // descrizione copertura
    cancellazione: string         // politica cancellazione
  }
}

// ============================================================
// TODO: Sostituire con fetch dal database
// Esempio con MongoDB:
//   import { MongoClient } from 'mongodb'
//   const client = new MongoClient(process.env.MONGODB_URI!)
//   const db = client.db('autoprime')
//   const cars = await db.collection('cars').find({}).toArray()
//
// Esempio con Prisma + PostgreSQL:
//   import { prisma } from '@/lib/prisma'
//   const cars = await prisma.car.findMany()
// ============================================================

export const CARS_NOLEGGIO: Car[] = [
  {
    id: 'n1',
    name: 'BMW Serie 5 530d',
    brand: 'BMW',
    model: 'Serie 5 530d',
    year: 2023,
    price: 120,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    ],
    fuel: 'Diesel',
    transmission: 'Automatico',
    seats: 5,
    color: 'Nero Metallizzato',
    description: 'La BMW Serie 5 rappresenta il perfetto equilibrio tra sportività e comfort. Ideale per viaggi di lavoro e piacere, offre tecnologia all\'avanguardia e un comfort senza compromessi.',
    available: true,
    type: 'noleggio',
    features: ['Navigatore GPS', 'Sedili Riscaldati', 'Telecamera Posteriore', 'Cruise Control Adattivo', 'Bluetooth', 'USB-C'],
    contractTerms: {
      depositoPercentuale: 30,
      kmGiornalieriInclusi: 200,
      costoPerkm: 0.25,
      etaMinima: 25,
      patenteMinima: 'B',
      assicurazione: 'Kasko completa con franchigia €500',
      cancellazione: 'Cancellazione gratuita fino a 48h prima. Dopo: trattenuta 50% acconto.',
    }
  },
  {
    id: 'n2',
    name: 'Mercedes Classe E 220d',
    brand: 'Mercedes',
    model: 'Classe E 220d',
    year: 2023,
    price: 130,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80',
    ],
    fuel: 'Diesel',
    transmission: 'Automatico',
    seats: 5,
    color: 'Grigio Selenite',
    description: 'Eleganza senza compromessi. La Mercedes Classe E ridefinisce il concetto di berlina executive con interni lussuosi e tecnologia MBUX di ultima generazione.',
    available: true,
    type: 'noleggio',
    features: ['MBUX Display', 'Head-up Display', 'Parcheggio Autonomo', 'Massage Sedili', 'Tetto Panoramico', 'Ambient Light'],
    contractTerms: {
      depositoPercentuale: 30,
      kmGiornalieriInclusi: 200,
      costoPerkm: 0.28,
      etaMinima: 25,
      patenteMinima: 'B',
      assicurazione: 'Kasko completa con franchigia €500',
      cancellazione: 'Cancellazione gratuita fino a 48h prima. Dopo: trattenuta 50% acconto.',
    }
  },
  {
    id: 'n3',
    name: 'Audi Q5 40 TDI',
    brand: 'Audi',
    model: 'Q5 40 TDI',
    year: 2022,
    price: 140,
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    ],
    fuel: 'Diesel',
    transmission: 'Automatico',
    seats: 5,
    color: 'Bianco Glaciale',
    description: 'SUV premium con trazione integrale Quattro. Perfetto per ogni tipo di percorso, combina sportività, comfort e praticità in modo eccezionale.',
    available: false,
    type: 'noleggio',
    features: ['Quattro AWD', 'Virtual Cockpit', 'Matrix LED', 'Lane Assist', 'Portellone Elettrico', 'Tetto Apribile'],
    contractTerms: {
      depositoPercentuale: 30,
      kmGiornalieriInclusi: 250,
      costoPerkm: 0.30,
      etaMinima: 25,
      patenteMinima: 'B',
      assicurazione: 'Kasko completa con franchigia €750',
      cancellazione: 'Cancellazione gratuita fino a 72h prima. Dopo: trattenuta 50% acconto.',
    }
  },
  {
    id: 'n4',
    name: 'Porsche Cayenne 3.0 V6',
    brand: 'Porsche',
    model: 'Cayenne 3.0 V6',
    year: 2023,
    price: 280,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    ],
    fuel: 'Benzina',
    transmission: 'Automatico',
    seats: 5,
    color: 'Nero',
    description: 'Il SUV sportivo per eccellenza. La Porsche Cayenne unisce le prestazioni di una sportiva con la praticità di un SUV premium. Un\'esperienza di guida unica.',
    available: true,
    type: 'noleggio',
    features: ['Sport Chrono', 'PDCC', 'Bose Sound', 'Sport Design', 'Night Vision', 'Active Suspension'],
    contractTerms: {
      depositoPercentuale: 30,
      kmGiornalieriInclusi: 200,
      costoPerkm: 0.50,
      etaMinima: 28,
      patenteMinima: 'B',
      assicurazione: 'Kasko completa con franchigia €1000',
      cancellazione: 'Cancellazione gratuita fino a 72h prima. Dopo: trattenuta 100% acconto.',
    }
  },
]

export const CARS_VENDITA: Car[] = [
  {
    id: 'v1',
    name: 'Mercedes GLE 350d',
    brand: 'Mercedes',
    model: 'GLE 350d',
    year: 2021,
    price: 68000,
    image: 'https://images.unsplash.com/photo-1617469767987-a5b6df52e33c?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1617469767987-a5b6df52e33c?w=800&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80',
    ],
    fuel: 'Diesel',
    transmission: 'Automatico',
    seats: 7,
    km: 42000,
    color: 'Obsidian Black',
    description: 'Mercedes GLE in perfette condizioni, tagliandi Mercedes certificati. Sette posti, ideale per famiglie o uso professionale. Completo di ogni optional.',
    type: 'vendita',
    features: ['7 Posti', 'AMG Line', 'Tetto Panoramico', 'Burmester Sound', 'Telecamere 360°', 'Sedili Riscaldati/Ventilati'],
  },
  {
    id: 'v2',
    name: 'BMW X5 xDrive30d',
    brand: 'BMW',
    model: 'X5 xDrive30d',
    year: 2020,
    price: 55000,
    image: 'https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?w=800&q=80',
    ],
    fuel: 'Diesel',
    transmission: 'Automatico',
    seats: 5,
    km: 67000,
    color: 'Space Grey',
    description: 'BMW X5 in eccellente stato, sempre tenuta da privato con cura maniacale. Libro tagliandi BMW completo. Un SUV iconico con prestazioni straordinarie.',
    type: 'vendita',
    features: ['xDrive', 'M Sport', 'iDrive 7', 'Harman Kardon', 'Retrocamera HD', 'Adaptive LED'],
  },
  {
    id: 'v3',
    name: 'Audi A6 Avant 40 TDI',
    brand: 'Audi',
    model: 'A6 Avant 40 TDI',
    year: 2022,
    price: 48000,
    image: 'https://images.unsplash.com/photo-1611566026373-c6c8da0ea861?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1611566026373-c6c8da0ea861?w=800&q=80',
    ],
    fuel: 'Diesel',
    transmission: 'Automatico',
    seats: 5,
    km: 28000,
    color: 'Grigio Glaciale',
    description: 'Audi A6 Avant quasi nuova, chilometraggio basso. La station wagon premium per eccellenza: elegante, pratica e con tecnologia all\'avanguardia.',
    type: 'vendita',
    features: ['Virtual Cockpit Plus', 'S-Tronic', 'Matrix LED', 'Quattro', 'Tetto Panoramico', 'Bang & Olufsen'],
  },
]

// ============================================================
// AUTH — UTENTI ADMIN
// ============================================================
// TODO: Sostituire con autenticazione reale (NextAuth.js + DB)
// Esempio:
//   import NextAuth from 'next-auth'
//   import CredentialsProvider from 'next-auth/providers/credentials'
//   // Configurare authOptions con verifica hash password nel DB
// ============================================================
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'lbmotors2024', // TODO: hashare con bcrypt nel DB reale
}

// ============================================================
// CONFIGURAZIONE PAGAMENTI
// ============================================================
// TODO: Integrare Stripe per pagamenti reali
//   import Stripe from 'stripe'
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
// ============================================================
export const PAYMENT_CONFIG = {
  depositoPercentuale: 30,  // percentuale acconto
  currency: 'EUR',
}

// ============================================================
// CONFIGURAZIONE CONTATTI AZIENDA
// ============================================================
export const COMPANY_INFO = {
  name: 'LB Motors',
  address: 'Via Roma 123, 00100 Roma (RM)',
  phone: '+39 06 1234567',
  whatsapp: '+390612345678',
  email: 'info@lbmotors.it',
  piva: 'IT12345678901',
  orari: 'Lun–Ven 9:00–19:00 | Sab 9:00–13:00',
}
