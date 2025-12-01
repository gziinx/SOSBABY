import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaVideo, FaUserMd } from "react-icons/fa";
import "./CreateCall.css";

export default function CreateCall() {
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleCreateCall(e) {
    e.preventDefault();
    
    if (!roomName.trim()) {
      setError("Por favor, digite o nome da sala.");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://backend-sosbaby.onrender.com/v1/sosbaby/chamada/cadastro",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ nome_chamada: roomName }),
        }
      );

      if (!res.ok) {
        throw new Error("Erro ao criar chamada");
      }

      // Simulate loading for better UX
      setTimeout(() => {
        navigate(`/video/${roomName}`);
        setLoading(false);
      }, 800);

    } catch (err) {
      console.error("Erro ao criar chamada:", err);
      setError("Erro ao criar a chamada. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="create-call-container">
      <div className="create-call-card">
        <div className="create-call-icon">
          <FaVideo />
        </div>
        <h1 className="create-call-title">Criar Consulta</h1>
        
        <form onSubmit={handleCreateCall}>
          <input
            type="text"
            placeholder="Digite o nome da sala"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="create-call-input"
            autoFocus
          />
          
          <button 
            type="submit" 
            className="create-call-button"
            disabled={loading}
          >
            {loading ? (
              <span className="button-loading">Criando...</span>
            ) : (
              <span>Criar Consulta <FaUserMd style={{ marginLeft: '8px' }} /></span>
            )}
          </button>
          
          {error && <p className="create-call-error">{error}</p>}
          
          <p className="create-call-note">
            Compartilhe o nome da sala com o paciente para que ele possa se juntar à consulta.
          </p>
        </form>
      </div>
    </div>
  );
}
