// Dados de exemplo para a tela de Dicas
// Cada dica tem: id, category (Bebês | Mães | Pais), subcategories [..], image
import { bebeComendo, bebeDormindo, bebeBrincando, maeComBebe, mulherLendo, rotinaMatinal } from '../assets/images/index.js'
import { icBebe } from '../assets/icons/index.js'

export const TIPS = [
  // Bebês
  { id: 'b1', category: 'Bebês', title: 'Primeiras Papinhas', subcategories: ['Alimentação'], image: bebeComendo },
  { id: 'b2', category: 'Bebês', title: 'Cuidados do Recém-nascido', subcategories: ['Cuidado', 'Recém nascido'], image: maeComBebe },
  { id: 'b3', category: 'Bebês', title: 'Rotina de Sono Seguro', subcategories: ['Sono', 'Segurança'], image: bebeDormindo, icon: icBebe },
  { id: 'b4', category: 'Bebês', title: 'Higiene Sem Drama', subcategories: ['Higiene'], image: bebeBrincando },
  { id: 'b5', category: 'Bebês', title: 'Brincar e Estimular', subcategories: ['Brincadeiras', 'Estimulação'], image: bebeBrincando },
  { id: 'b6', category: 'Bebês', title: 'Calendário de Vacinas', subcategories: ['Vacinas'], image: rotinaMatinal },

  // Mães
  { id: 'm1', category: 'Mães', title: 'Bem-Estar no Puerpério', subcategories: ['Saúde', 'Bem-estar'], image: rotinaMatinal },
  { id: 'm2', category: 'Mães', title: 'Dicas de Amamentação', subcategories: ['Saúde', 'Amamentamento'], image: maeComBebe },
  { id: 'm3', category: 'Mães', title: 'Descanso que Funciona', subcategories: ['Descanso', 'Autocuidado'], image: mulherLendo },
  { id: 'm4', category: 'Mães', title: 'Volta ao Movimento', subcategories: ['Exercício'], image: rotinaMatinal },
  { id: 'm5', category: 'Mães', title: 'Alimentação da Mãe', subcategories: ['Alimentação'], image: mulherLendo },
  { id: 'm6', category: 'Mães', title: 'Sono e Rotina', subcategories: ['Sono'], image: mulherLendo },

  // Pais
  { id: 'p1', category: 'Pais', title: 'Segurança em Casa', subcategories: ['Segurança'], image: rotinaMatinal },
  { id: 'p2', category: 'Pais', title: 'Criando Vínculos', subcategories: ['Vínculo', 'Brincadeiras'], image: bebeBrincando },
  { id: 'p3', category: 'Pais', title: 'Rotina que Ajuda', subcategories: ['Rotina'], image: rotinaMatinal },
  { id: 'p4', category: 'Pais', title: 'Cuidando da Mente', subcategories: ['Saúde mental'], image: rotinaMatinal },
  { id: 'p5', category: 'Pais', title: 'Hora de Comer Juntos', subcategories: ['Alimentação'], image: bebeComendo },
  { id: 'p6', category: 'Pais', title: 'Noites Tranquilas', subcategories: ['Sono'], image: bebeDormindo },
]