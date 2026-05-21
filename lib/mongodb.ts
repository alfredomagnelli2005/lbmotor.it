// ============================================================
// lib/mongodb.ts — Connessione MongoDB
// ============================================================
// Installa la dipendenza con: npm install mongodb
// Poi crea il file .env.local con:
//   MONGODB_URI=mongodb://localhost:27017/lbmotors
// ============================================================

import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI as string
const dbName = 'lbmotors'

if (!uri) {
  throw new Error('Aggiungi MONGODB_URI nel file .env.local')
}

// In sviluppo, riusa la connessione tra hot-reloads
let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db(dbName)
}

export default clientPromise
