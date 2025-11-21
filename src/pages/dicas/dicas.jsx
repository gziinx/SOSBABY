import { useEffect, useMemo, useState } from 'react'
import TipCard from '../../components/card/TipCard.jsx'
import { TIPS } from '../../data/tipsData.js'
import { icLivro } from '../../assets/icons/index.js'
import styled from 'styled-components';
import { DicasStyle as GlobalDicasStyle } from '../../styles/GglobalStyles.js'
const COLOR_BABY = '#708EF1'
const COLOR_MOM = '#B3A0F6'
const COLOR_DAD = '#4A5BAE' // combinado com o azul do bebê
const TITLE_COLOR = '#081C60'

const CATEGORIES = ['Bebês', 'Mães', 'Pais']

function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem('favorites')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  useEffect(() => {
    try { localStorage.setItem('favorites', JSON.stringify(favorites)) } catch {}
  }, [favorites])

  const toggle = (id) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }
  return { favorites, toggle }
}

export default function Dicas(){
  const [query, setQuery] = useState('')
  const [onlyFavs, setOnlyFavs] = useState(false)
  const [limitByCat, setLimitByCat] = useState(() => ({ Bebês: 3, 'Mães': 3, 'Pais': 3 }))
  const { favorites, toggle } = useFavorites()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return TIPS.filter(t => {
      if (onlyFavs && !favorites.includes(t.id)) return false
      if (!q) return true
      return t.subcategories.some(sc => sc.toLowerCase().includes(q))
    })
  }, [query, onlyFavs, favorites])

  const tipsByCategory = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      acc[cat] = filtered.filter(t => t.category === cat)
      return acc
    }, {})
  }, [filtered])

  const colorByCat = (cat) => {
    if (cat === 'Bebês') return COLOR_BABY
    if (cat === 'Mães') return COLOR_MOM
    return COLOR_DAD
  }

  const handleMore = (cat) => setLimitByCat(prev => ({ ...prev, [cat]: prev[cat] + 3 }))

  const DicasContainer = styled.div`
    ${GlobalDicasStyle}
  `;

  return (
    <>
      <GlobalDicasStyle />
      <DicasContainer className="dicas-page container pad">
      <div className="search-hero">
        <h1 className="hero-title" style={{ color: TITLE_COLOR }}>Encontre Dicas</h1>
        <p className="hero-sub">específicas aqui!</p>
        <div className="search-row">
          <div className="input-wrap">
            <input
              type="text"
              placeholder="Pesquisar por subcategorias (ex: Sono, Segurança)"
              value={query}
              onChange={(e)=> setQuery(e.target.value)}
            />
            <span className="search-icon">🔎</span>
          </div>
          <button className="icon-btn" title="Filtro" aria-label="Filtro">
            <img src={icLivro} alt="Filtro" />
          </button>
          <button className={`fav-btn ${onlyFavs ? 'on': ''}`} onClick={()=> setOnlyFavs(v=>!v)}>
            <span className="star">★</span> Favoritos
          </button>
        </div>
      </div>

      {CATEGORIES.map(cat => {
        const items = tipsByCategory[cat] || []
        const show = items.slice(0, limitByCat[cat])
        return (
          <div className="category-block" key={cat}>
            <div className="category-title" style={{ color: TITLE_COLOR }}>
              <h2 style={{ fontFamily: 'Krona One' }}>Para {cat}</h2>
              <span className="category-emoji">{cat === 'Bebês' ? '😊' : cat === 'Mães' ? '🤍' : '💙'}</span>
            </div>

            <div className="tips-grid">
              {show.map(tip => (
                <TipCard
                  key={tip.id}
                  tip={tip}
                  isFavorite={favorites.includes(tip.id)}
                  onToggleFavorite={toggle}
                />
              ))}
            </div>

            {items.length > show.length && (
              <div className="more-wrap">
                <button className="more-btn" style={{ borderColor: colorByCat(cat), color: TITLE_COLOR }} onClick={() => handleMore(cat)}>
                  Mostre mais
                </button>
              </div>
            )}
          </div>
        )
      })}
    </DicasContainer>
    </>
  )
}