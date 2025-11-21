import { useMemo } from 'react'
import { getIconFor } from '../../assets/icons/index.js'

export default function TipCard({ tip, isFavorite, onToggleFavorite }) {
  const badgeColor = useMemo(() => {
    if (tip.category === 'Bebês') return '#708EF1'
    if (tip.category === 'Mães') return '#B3A0F6'
    if (tip.category === 'Pais') return '#4A5BAE' // combinado com azul
    return '#708EF1'
  }, [tip.category])

  const overlayIcon = useMemo(() => {
    if (tip.icon) return tip.icon
    const primary = tip.subcategories?.[0] || ''
    return getIconFor(primary)
  }, [tip.subcategories, tip.icon])

  return (
    <div className="tip-card">
      <div className="thumb">
        <img className="bg" src={tip.image} alt={tip.subcategories.join(', ')} />
        <img className="icon-overlay" src={overlayIcon} alt="icone" />
        <span className="badge" style={{ background: badgeColor }}>{tip.category}</span>
      </div>
      <div className="info" style={{ background: badgeColor }}>
        <div className="title-row">
          <h4>{tip.title || 'Aproveite as oportunidades'}</h4>
          <button className={`fav-inline ${isFavorite ? 'on' : ''}`} onClick={() => onToggleFavorite(tip.id)} aria-label="Favoritar">
            {isFavorite ? '❤' : '🤍'}
          </button>
        </div>
        <div className="chips">
          {tip.subcategories.map(sc => (
            <span className="chip" key={sc}>{sc}</span>
          ))}
        </div>
      </div>
    </div>
  )
}