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
}
// ============================================================
// CONFIGURAZIONE CONTATTI AZIENDA
// ============================================================
export const COMPANY_INFO = {
  name: 'LB MOTORS DI BORRELLI ALESSANDRO PIO',
  address: 'Piazza Fausto e Luigi Gullo, 21 (CS)',
  phone: '+39 351 3016996',
  whatsapp: '+39 351 3016996',
  email: 'info@lbmotor.it',
  piva: '04003820786',
  orari: 'Lun–Ven 9:00–19:00 | Sab 9:00–13:00',
}
