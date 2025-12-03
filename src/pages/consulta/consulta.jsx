import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./consulta.css";
import { FaVideo, FaUserMd } from "react-icons/fa";
import logo from '../../assets/logoo.png';

export default function JoinRoom() {
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function handleJoin(e) {
    e.preventDefault();
    
    if (!roomName.trim()) {
      alert("Por favor, digite o nome da sala.");
      return;
    }

    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      navigate(`/video/${roomName}`);
      setIsLoading(false);
    }, 800);
  }

  const handleCalendar = (e) => {
    e.preventDefault();
    navigate('/calendario');
  };
  
  const handleRotina = (e) => {
    e.preventDefault();
    navigate('/rotina');
  };
  
  const handlePerfil = () => {
    navigate('/perfil');
  };
  
  const handleHome = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <>
      <header>
        <nav className="nav">
          <div className="nav-left">
            <img src={logo} alt="SOS Baby" className="logu" />
          </div>
          <div className="nav-center">
            <a href="" onClick={handleHome}>Home</a>
            <a href="" onClick={handleCalendar}>Calendário</a>
            <a href="" onClick={(e) => e.preventDefault()}>Consultas</a>
            <a href="" onClick={handleRotina}>Rotina</a>
          </div>
          <div className="nav-right" onClick={handlePerfil}>
            <i data-lucide="bell" className="icon"></i>
            <i data-lucide="user" className="icon user-icon"></i>
          </div>
        </nav>
      </header>
      <div className="consultation-container">
      <div className="consultation-card">
        <div className="consultation-icon">
          <FaVideo />
        </div>
        <h1 className="consultation-title">Iniciar Consulta</h1>
        
        <form onSubmit={handleJoin}>
          <input
            type="text"
            placeholder="Digite o nome da sala"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="consultation-input"
            autoFocus
          />
          
          <button 
            type="submit" 
            className="consultation-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="button-loading">Carregando...</span>
            ) : (
              <span>Iniciar Consulta <FaUserMd style={{ marginLeft: '8px' }} /></span>
            )}
          </button>
        </form>
        
        <p className="consultation-note">
          Compartilhe o nome da sala com o paciente para que ele possa se juntar à consulta.
        </p>
      </div>
    </div>
    </>
  );
}
