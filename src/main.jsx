import { Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useParams } from "react-router-dom";
import './pages/Inicio/App.css'
import Inicio from './pages/Inicio/index'
import Cadastro from './pages/cadastro/cadastro'
import Login from './pages/login/login'
import Cadrespon from './pages/cadrespon/cadrespon'
import CadastroMedico from './pages/cadmedico/cadmedico'
import CadBebe from './pages/cadbebe/cadbebe'
import Rotina from './pages/rotina/rotina'
import HomeClinica from './pages/homeclinica/homeclnca'
import Tipo from './pages/tipo/tipo'
import VideoCall from './pages/video/video'
import ChatComIA from './pages/chatcomia/chatcomia'
import Dicas from './pages/dicas/dicas'
import Consulta from './pages/consulta/consulta'
import CreateCall from './pages/criarconsulta/CreateCall'
import DicasClinica from './pages/dicasclinica/dicasclinica';
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
        <Route path='/tipo' element={<Tipo/>}/>
        <Route path='/homeclinica' element={<HomeClinica/>}/>
        <Route path="/video/:roomName" element={<VideoPage />} />
        <Route path='/chatcomia' element={<ChatComIA/>}/>
        <Route path='/dicas' element={<Dicas/>}/>
        <Route path='/consulta' element={<Consulta/>}/>
        <Route path='/criarconsulta' element={<CreateCall/>}/>  
        <Route path='/dicasclinica' element={<DicasClinica/>}/>
      </Routes>
    </Suspense>
  </BrowserRouter>
)
function VideoPage() {
  const params = useParams();
  const room = params.roomName;

  return (
    <VideoCall
      roomName={room}
      tokenEndpoint="https://backend-sosbaby.onrender.com/v1/sosbaby/call/token"
    />
  );
}