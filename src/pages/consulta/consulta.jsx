import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinRoom() {
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  function handleJoin() {
    if (!roomName.trim()) {
      alert("Digite o nome da sala.");
      return;
    }

    navigate(`/video/${roomName}`);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Entrar na Videochamada</h2>

      <input
        type="text"
        placeholder="Nome da sala"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        style={{ padding: 10, width: "250px", marginRight: 10 }}
      />

      <button onClick={handleJoin}>Entrar</button>
    </div>
  );
}
