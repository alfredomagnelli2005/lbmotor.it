// ============================================================
// API: /api/cars
// GET  → ritorna tutte le auto (filtra per ?type=noleggio|vendita)
// POST → aggiunge una nuova auto
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(req: NextRequest) {
  try {
    const db = await getDb()
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') // 'noleggio' | 'vendita' | null (tutte)

    const query = type ? { type } : {}
    const cars = await db.collection('cars').find(query).sort({ createdAt: -1 }).toArray()

    // Converti _id di MongoDB in stringa
    const serialized = cars.map(car => ({ ...car, id: car._id.toString(), _id: undefined }))
    return NextResponse.json(serialized)

  } catch (error) {
    console.error('GET /api/cars error:', error)
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await getDb()
    const body = await req.json()

    const newCar = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection('cars').insertOne(newCar)
    return NextResponse.json({ id: result.insertedId.toString(), ...newCar }, { status: 201 })

  } catch (error) {
    console.error('POST /api/cars error:', error)
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 })
  }
}
