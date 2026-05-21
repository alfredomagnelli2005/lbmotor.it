'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Car } from '@/lib/data'
import { Fuel, Users, Gauge, Calendar, ArrowRight, CheckCircle, XCircle } from 'lucide-react'

interface CarCardProps {
  car: Car
  type: 'noleggio' | 'vendita'
}

export default function CarCard({ car, type }: CarCardProps) {
  return (
    <Link href={`/${type}/${car.id}`}>
      <div className="car-card glass rounded-sm overflow-hidden cursor-pointer h-full flex flex-col"
        style={{border: '1px solid rgba(255,255,255,0.06)'}}>
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{}}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
          <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(8,8,14,0.7) 0%, transparent 60%)'}} />
          
          {/* Price badge */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-sm" style={{background: 'rgba(8,8,14,0.85)', border: '1px solid rgba(26,111,212,0.4)'}}>
            <span className="text-xs font-semibold" style={{color: '#1a6fd4', letterSpacing: '0.05em'}}>
              {type === 'noleggio' ? `€${car.price}/gg` : `€${car.price.toLocaleString('it-IT')}`}
            </span>
          </div>

          {/* Availability badge (noleggio only) */}
          {type === 'noleggio' && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-sm"
              style={{background: car.available ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${car.available ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`}}>
              {car.available ? <CheckCircle size={12} color="#22c55e" /> : <XCircle size={12} color="#ef4444" />}
              <span className="text-xs font-medium" style={{color: car.available ? '#22c55e' : '#ef4444'}}>
                {car.available ? 'Disponibile' : 'Non disponibile'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="mb-1">
            <span className="text-xs uppercase tracking-widest" style={{color: '#1a6fd4', fontSize: '0.65rem', letterSpacing: '0.15em'}}>{car.brand}</span>
          </div>
          <h3 className="text-xl mb-4" style={{fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#f0f0f5'}}>{car.model}</h3>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              {icon: Calendar, label: String(car.year)},
              {icon: Users, label: `${car.seats} posti`},
              {icon: Fuel, label: car.fuel},
              {icon: Gauge, label: type === 'vendita' && car.km ? `${car.km.toLocaleString('it-IT')} km` : car.transmission},
            ].map(({icon: Icon, label}) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={13} style={{color: '#1a6fd4', flexShrink: 0}} />
                <span className="text-xs" style={{color: '#8888aa'}}>{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between pt-4" style={{borderTop: '1px solid rgba(255,255,255,0.06)'}}>
            <span className="text-xs uppercase tracking-widest" style={{color: '#555570', fontSize: '0.65rem'}}>
              {type === 'noleggio' ? 'Scopri & Prenota' : 'Scopri & Contatta'}
            </span>
            <div className="w-8 h-8 rounded-sm flex items-center justify-center transition-all duration-300 group"
              style={{border: '1px solid rgba(26,111,212,0.3)', color: '#1a6fd4'}}>
              <ArrowRight size={15} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
