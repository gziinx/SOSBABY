import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './pages/Inicio/App.css'
import Inicio from './pages/Inicio/index'
import Cadastro from './pages/cadastro/cadastro'
import Login from './pages/login/login'
import Cadrespon from './pages/cadrespon/cadrespon'
import CadastroMedico from './pages/cadmedico/cadmedico'
import CadBebe from './pages/cadbebe/cadbebe'
import Calendario from './pages/calendario/calendario'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Inicio/>}/>
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/cadrespon" element={<Cadrespon/>}/>
      <Route path="/cadbebe" element={<CadBebe/>}/>
      <Route path='/cadmedico'element={<CadastroMedico/>}/>
      <Route path='/calendario' element={<Calendario/>}/>
    </Routes>
    </BrowserRouter>
  </StrictMode>
)
