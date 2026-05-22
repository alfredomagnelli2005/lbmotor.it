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
