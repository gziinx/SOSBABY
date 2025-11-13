import { Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './pages/Inicio/App.css'
import Inicio from './pages/Inicio/index'
import Cadastro from './pages/cadastro/cadastro'
import Login from './pages/login/login'
import Cadrespon from './pages/cadrespon/cadrespon'
import CadastroMedico from './pages/cadmedico/cadmedico'
import CadBebe from './pages/cadbebe/cadbebe'
import Rotina from './pages/rotina/rotina'
import HomeClinica from './pages/homeclinica/homeclnca'
// Lazy load pages to isolate CSS per route
const Calendarioo = lazy(() => import('./pages/calendario/calendario'))
const Home = lazy(() => import('./pages/home/home'))

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Suspense fallback={<div />}> 
      <Routes>
        <Route path='/' element={<Inicio/>}/>
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/cadrespon" element={<Cadrespon/>}/>
        <Route path="/cadbebe" element={<CadBebe/>}/>
        <Route path='/cadmedico' element={<CadastroMedico/>}/>
        <Route path='/calendario' element={<Calendarioo/>}/>
        <Route path='/home' element={<Home/>}/> 
        <Route path='/rotina' element={<Rotina/>}/>
        <Route path='/homeclinica' element={<HomeClinica/>}/>
      </Routes>
    </Suspense>
  </BrowserRouter>
)
