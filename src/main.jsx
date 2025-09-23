import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './pages/inicio'
import Cadastro from './pages/cadastro/cadastro'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Inicio/>}/>
      <Route path="/cadastro" element={<Cadastro />} />
    </Routes>
    </BrowserRouter>
  </StrictMode>
)
