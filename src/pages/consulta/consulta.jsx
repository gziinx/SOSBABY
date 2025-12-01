import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./consulta.css";
import { FaVideo, FaUserMd } from "react-icons/fa";

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

  return (
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
  );
}
