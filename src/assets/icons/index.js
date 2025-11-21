import icAlimentacao from './alimentacao-icone.png'
import icSono from './sono-icon.png'
import icLivro from './book-icon.png'
import icMaeBebe from './mae-e-bebe-icon.png'
import icBebe from './baby-icon.png'
import icPerfil from './perfil-icon.png'
import icHeart from './Heart.png'

// Ícone genérico de fallback
const icGeneric = icLivro

const MAP = [
  { key: 'alimenta', src: icAlimentacao },
  { key: 'sono', src: icSono },
  { key: 'descanso', src: icSono },
  { key: 'amament', src: icMaeBebe },
  { key: 'cuidado', src: icMaeBebe },
  { key: 'recém', src: icMaeBebe },
  { key: 'recem', src: icMaeBebe },
  { key: 'brinc', src: icBebe },
  { key: 'estimula', src: icBebe },
  { key: 'seguran', src: icLivro },
  { key: 'higiene', src: icLivro },
  { key: 'vacina', src: icLivro },
  { key: 'bem-estar', src: icLivro },
  { key: 'exerc', src: icLivro },
  { key: 'vínculo', src: icLivro },
  { key: 'vinculo', src: icLivro },
  { key: 'rotina', src: icLivro },
  { key: 'saúde', src: icLivro },
  { key: 'saude', src: icLivro },
  { key: 'mental', src: icLivro },
]

export { icLivro };

export function getIconFor(subcategory){
  const s = (subcategory||'').toLowerCase()
  const found = MAP.find(m => s.includes(m.key))
  return found ? found.src : icGeneric
}

export { icAlimentacao, icSono, icLivro as icGeneric, icMaeBebe, icBebe, icPerfil, icHeart }