import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './pages/inicio'
import Cadastro from './pages/cadastro/cadastro'
import Login from './pages/login/login'
import Cadrespon from './pages/cadrespon/cadrespon'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Inicio/>}/>
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/cadrespon" element={<Cadrespon/>}/>
    </Routes>
    </BrowserRouter>
  </StrictMode>
)
