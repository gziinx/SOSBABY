import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateCall() {
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleCreateCall(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
  "http://localhost:3030/v1/sosbaby/chamada/cadastro",
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
        setError("Erro ao criar chamada.");
        setLoading(false);
        return;
      }

      // Sucesso → redireciona para /video/{room}
      navigate(`/video/${roomName}`);

    } catch (err) {
      setError("Erro ao conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Criar Chamada</h1>

      <form onSubmit={handleCreateCall} style={styles.form}>
        <input
          type="text"
          placeholder="Nome da sala"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Criando..." : "Criar Chamada"}
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

// 🎨 estilos inline simples
const styles = {
  container: {
    maxWidth: 420,
    margin: "60px auto",
    padding: 20,
    textAlign: "center",
    borderRadius: 10,
    background: "#f5f5f5",
  },
  title: {
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  button: {
    padding: 12,
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
};
