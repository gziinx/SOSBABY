import React, { useEffect, useMemo, useRef, useState } from "react";
import "./chatcomia.css";
import { marked } from "marked";

export default function ChatComIA() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);

  const endpoint = useMemo(() => {
    return "http://localhost:3030/v1/sosbaby/ia/generate/chat";
  }, []);

  // Autenticação (mesmo padrão do video.jsx)
  const authToken = useMemo(
  () => (typeof window !== "undefined" ? localStorage.getItem("token") : ""),
  []
);
  const useCookies = false; // ajuste para true se quiser enviar cookies (credentials: 'include')

  const userId = useMemo(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("sosbaby_user_id") : null;
    if (stored && stored.trim()) return stored.trim();
    const gen = Math.random().toString(36).slice(2, 10);
    if (typeof window !== "undefined") localStorage.setItem("sosbaby_user_id", gen);
    return gen;
  }, []);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  function pushMessage(role, text) {
    setMessages((prev) => [...prev, { role, text }]);
  }

  async function sendMessage() {
    const question = input.trim();
    if (!question || loading) return;
    setError("");
    pushMessage("user", question);
    setInput("");
    setLoading(true);
    try {
      const url = `${endpoint}?userId=${encodeURIComponent(userId)}`;
      const headers = { "Content-Type": "application/json" };
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ question }),
        credentials: useCookies ? "include" : "same-origin",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.message || "Erro ao enviar a mensagem.";
        setError(msg);
      } else {
        const answer = data?.IA_response || data?.response || data?.answer || "";
        if (answer) {
          pushMessage("assistant", answer);
        } else {
          setError("Resposta vazia da IA.");
        }
      }
    } catch (e) {
      setError("Falha na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="chat-ia-page">
      <div className="chat-ia-card">
        <div className="chat-ia-header">Chat com IA</div>
        <div ref={listRef} className="chat-ia-messages">
          {messages.length === 0 && (
            <div className="chat-ia-empty">Envie uma pergunta para começar.</div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`chat-ia-message ${m.role === "user" ? "user" : "assistant"}`}>
              <div
        className="chat-ia-bubble"
        dangerouslySetInnerHTML={{ __html: marked.parse(m.text) }}
          ></div>
            </div>
          ))}
          {loading && (
            <div className="chat-ia-message assistant">
              <div className="chat-ia-bubble loading">Digitando...</div>
            </div>
          )}
        </div>
        {error && <div className="chat-ia-error">{error}</div>}
        <div className="chat-ia-input-row">
          <textarea
            className="chat-ia-input"
            placeholder="Digite sua pergunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
          />
          <button className="chat-ia-send" onClick={sendMessage} disabled={loading || !input.trim()}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

