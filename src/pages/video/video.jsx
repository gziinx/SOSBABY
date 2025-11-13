import React, { useEffect, useRef, useState } from "react";
import Video from "twilio-video";
import "./video.css";

/**
 * Componente de Video Chamada (Twilio Video)
 *
 * Props sugeridas:
 * - roomName: string (nome da sala)
 * - tokenEndpoint: string (URL do endpoint no seu backend que retorna o token)
 *   O endpoint deve responder com JSON no formato:
 *   { token: string, indentity: string, Room: string }
 *   onde `indentity` vem como "id|Nome" (gerado pelo backend).
 * - onConnected?: (room) => void
 * - onDisconnected?: () => void
 */
export default function VideoCall({
  roomName = "teste3indentity",
  tokenEndpoint = "http://localhost:3030/v1/sosbaby/call/token",
  authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : "",
  useCookies = false,
  onConnected,
  onDisconnected,
}) {
  const localRef = useRef(null);
  const remoteRef = useRef(null);

  const [room, setRoom] = useState(null);
  const [identity, setIdentity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Busca o token no backend
  async function fetchToken() {
    setLoading(true);
    setError("");
    try {
      const headers = { "Content-Type": "application/json" };
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

      const res = await fetch(tokenEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({ room: roomName }),
        credentials: useCookies ? "include" : "same-origin",
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Erro HTTP ${res.status}`);
      }
      const data = await res.json();
      // Esperado: { token: string, indentity: string, Room: string }
      if (!data?.token) throw new Error("Resposta sem token");
      return data;
    } catch (err) {
      setError(err?.message || "Erro ao buscar token");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Anexa track em um container
  function attachTrack(track, container) {
    try {
      const el = track.attach();
      el.style.maxWidth = "100%";
      el.style.borderRadius = "12px";
      container.appendChild(el);
    } catch (_) {
      // no-op
    }
  }

  // Remove todos os elementos de vídeo anexados
  function detachParticipantTracks(participant) {
    participant.tracks.forEach(publication => {
      const track = publication.track;
      if (track) {
        track.detach().forEach(el => el.remove());
      }
    });
  }

  // Conecta à sala ao montar
  useEffect(() => {
    let connectedRoom = null;

    async function connect() {
      try {
        const { token, indentity } = await fetchToken();
        setIdentity(indentity || "");

        // Cria e mostra as tracks locais ANTES de conectar
        const localTracks = await Video.createLocalTracks({
          audio: true,
          video: { width: 640 },
        });
        if (localRef.current) {
          localTracks.forEach(track => attachTrack(track, localRef.current));
        }

        // Conecta usando as tracks locais criadas
        connectedRoom = await Video.connect(token, {
          name: roomName,
          tracks: localTracks,
        });
        setRoom(connectedRoom);
        onConnected?.(connectedRoom);

        // Se outras tracks locais forem publicadas posteriormente
        connectedRoom.localParticipant.tracks.forEach(publication => {
          if (!publication.track && localRef.current) {
            publication.on("subscribed", track => attachTrack(track, localRef.current));
          }
        });

        // Participantes já presentes
        connectedRoom.participants.forEach(participant => {
          participant.tracks.forEach(publication => {
            if (publication.isSubscribed && publication.track && remoteRef.current) {
              attachTrack(publication.track, remoteRef.current);
            }
          });

          participant.on("trackSubscribed", track => {
            if (remoteRef.current) attachTrack(track, remoteRef.current);
          });
        });

        // Novos participantes
        connectedRoom.on("participantConnected", participant => {
          participant.on("trackSubscribed", track => {
            if (remoteRef.current) attachTrack(track, remoteRef.current);
          });
        });

        // Saída de participantes
        connectedRoom.on("participantDisconnected", participant => {
          detachParticipantTracks(participant);
        });
      } catch (_) {
        // erro já tratado em fetchToken ou logado
      }
    }

    connect();

    // Cleanup ao desmontar
    return () => {
      try {
        if (connectedRoom) {
          // Para e remove os elementos DOM das tracks locais
          connectedRoom.localParticipant?.tracks.forEach(publication => {
            const track = publication.track;
            if (track) {
              track.stop?.();
              track.detach?.().forEach(el => el.remove());
            }
          });
          connectedRoom.disconnect();
          onDisconnected?.();
        } else if (localRef.current) {
          // Caso tenha criado tracks mas não conectado
          Array.from(localRef.current.children).forEach(el => el.remove());
        }
      } catch (_) {
        // no-op
      }
    };
  }, [roomName, tokenEndpoint]);

  // Utilitário: separa identity "id|Nome"
  const [id_user, nome_user] = (identity || "").split("|");

  return (
     <div className="video-call">
    <div className="video-pane you">
      <h3 className="video-title">Você</h3>
      <div id="local-video" ref={localRef} className="video-box" />
    </div>

    <div className="video-pane remote">
      <h3 className="video-title">Remoto</h3>
      <div id="remote-video" ref={remoteRef} className="video-box" />
    </div>

    <div className="video-status">
      {loading && <span>Conectando…</span>}
      {error && <span className="video-error">{error}</span>}
      {identity && (
        <span>
          Conectado como: <strong>{nome_user}</strong> (ID: {id_user})
        </span>
      )}
    </div>

    <div className="video-actions">
      {/* Botões opcionais que posso adicionar depois */}
      {/* <button className="video-btn">Mutar</button> */}
    </div>
  </div>
  );
}
