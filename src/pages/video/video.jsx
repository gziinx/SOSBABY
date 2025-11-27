import React, { useEffect, useRef, useState } from "react";
import Video from "twilio-video";
import { useNavigate } from "react-router-dom";
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
    roomName,
    tokenEndpoint = "https://backend-sosbaby.onrender.com/v1/sosbaby/call/token",
    authToken = typeof window !== "undefined"
      ? (
          localStorage.getItem("token") ||
          localStorage.getItem("authToken") ||
          localStorage.getItem("access_token") ||
          ""
        )
      : "",
    useCookies = false,
    onConnected,
    onDisconnected,
  }) {
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [identity, setIdentity] = useState("");
  const [remoteParticipant, setRemoteParticipant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

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
      if (!data?.token) throw new Error("Resposta sem token JWT");
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
      console.log(`Anexando track ${track.kind} ao container`, container);
      
      // Limpa o container antes de adicionar um novo vídeo
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      
      const el = track.attach();
      console.log('Elemento de mídia criado:', el);
      
      // Aplica estilos diretamente no elemento de vídeo
      el.style.width = '100%';
      el.style.height = '100%';
      el.style.objectFit = 'cover';
      el.style.borderRadius = '12px';
      
      // Adiciona o elemento ao container
      container.appendChild(el);
      
      // Força o redesenho do elemento
      el.style.display = 'none';
      el.offsetHeight; // Trigger reflow
      el.style.display = 'block';
      
      console.log(`✅ Track ${track.kind} anexada com sucesso ao container`);
      
      // Dispara um evento personalizado para notificar que uma track foi anexada
      const event = new Event('trackAttached');
      container.dispatchEvent(event);
      if (track.kind === "audio") {
  console.log("🔊 Áudio remoto recebido — anexando");
}
el.autoplay = true;
el.muted = false;
      
    } catch (err) {
      console.error("❌ Erro ao anexar track:", err);
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
    console.log('🔵 Iniciando conexão com a sala...');
    let connectedRoom = null;
    const localTracks = [];

    async function connect() {
      try {
        console.log('🔑 Buscando token...');
        const response = await fetchToken();

// Agora o backend retorna token.token!
const jwt = response.token.token;   // backend retorna só token
const userIdentity = response.token.identity
const room = response.token.room
console.log("TOKEN JWT:", jwt);
console.log("IDENTITY:", userIdentity);
console.log("ROOM:", room);

setIdentity(userIdentity);


        // Cria e mostra as tracks locais ANTES de conectar
      try {
  // ---- Tentativa 1: vídeo + áudio ----
  const tracks = await Video.createLocalTracks({
    audio: true,
    video: { 
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: 24,
      aspectRatio: 16/9,
      facingMode: 'user',
      zoom: false
    },
  });

  localTracks.push(...tracks);
  console.log(`✅ ${tracks.length} tracks locais criadas`);

  if (localRef.current) {
    console.log('📌 Anexando tracks locais...');
    tracks.forEach(track => {
      console.log(`   Anexando track local ${track.kind}...`);
      attachTrack(track, localRef.current);
    });
  } else {
    console.error('❌ localRef.current é nulo!');
  }

} catch (errVideo) {
  console.warn("⚠️ Sem webcam disponível. Tentando criar track somente de áudio...", errVideo);

  try {
    // ---- Tentativa 2: somente áudio ----
    const tracks = await Video.createLocalTracks({
      audio: true,
      video: false
    });

    localTracks.push(...tracks);
    console.log("🎤 Track de áudio criada (sem vídeo)");

  } catch (errAudio) {
    console.warn("⚠️ Nem áudio disponível. Conectando sem mídia...", errAudio);
    // ---- Tentativa 3: nenhuma mídia ----
    localTracks.length = 0;
  }
}

        // Conecta usando as tracks locais criadas
        console.log('🌐 Conectando à sala...');
        try {
          connectedRoom = await Video.connect(jwt, {
            name: roomName,
            tracks: localTracks,
            bandwidthProfile: {
              video: {
                maxTracks: 5,
                dominantSpeakerPriority: 'high',
                renderDimensions: {
                  high: { width: 1280, height: 720 },
                  standard: { width: 640, height: 480 },
                  low: { width: 320, height: 240 }
                }
              }
            },
            dominantSpeaker: true,
            networkQuality: { local: 1, remote: 1 },
            preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }]
          });
          
          console.log('✅ Conectado à sala:', connectedRoom.name);
          console.log('👤 Participantes na sala:', connectedRoom.participants.size);
          
          setRoom(connectedRoom);
          onConnected?.(connectedRoom);

          // Estado inicial dos toggles baseado nas tracks locais
          try {
            const audioPubs = Array.from(connectedRoom.localParticipant.audioTracks?.values?.() || []);
            const videoPubs = Array.from(connectedRoom.localParticipant.videoTracks?.values?.() || []);
            const audioEnabled = audioPubs.some(p => p?.track?.isEnabled);
            const videoEnabled = videoPubs.some(p => p?.track?.isEnabled);
            setIsMicOn(audioPubs.length === 0 ? false : audioEnabled);
            setIsCamOn(videoPubs.length === 0 ? false : videoEnabled);
          } catch (e) {
            console.warn('Não foi possível ler estado inicial de áudio/vídeo', e);
          }
          
          // Log de eventos da sala
          connectedRoom.on('reconnecting', error => {
            console.warn('🔄 Reconectando à sala...', error);
          });
          
          connectedRoom.on('reconnected', () => {
            console.log('✅ Reconexão bem-sucedida');
          });
          
          connectedRoom.on('disconnected', room => {
            console.log('🚪 Desconectado da sala:', room.name);
          });
          
        } catch (error) {
          console.error('❌ Erro ao conectar à sala:', error);
          throw error;
        }

        // Se outras tracks locais forem publicadas posteriormente
        connectedRoom.localParticipant.tracks.forEach(publication => {
          if (!publication.track && localRef.current) {
            publication.on("subscribed", track => attachTrack(track, localRef.current));
          }
        });

        console.log("🚀 Sala conectada com sucesso!");
        console.log("👥 Participantes presentes:", connectedRoom.participants.size);

        console.log('👥 Verificando participantes existentes...');
        connectedRoom.participants.forEach(participant => {
          console.log(`👤 Participante já na sala: ${participant.identity} (${participant.sid})`);
          
          // Log de todos os tracks disponíveis
          console.log(`   📊 Tracks publicadas por ${participant.identity}:`, 
            Array.from(participant.tracks.values()).map(p => ({
              kind: p.kind,
              isSubscribed: p.isSubscribed,
              track: p.track ? 'presente' : 'ausente'
            }))
          );
          
          // Trata cada track publicada
          participant.tracks.forEach(publication => {
            console.log(`   🔍 Track ${publication.kind} (${publication.trackSid}):`,
              `isSubscribed=${publication.isSubscribed},`, 
              `track=${publication.track ? 'presente' : 'ausente'}`);
            
            // Se a track já está inscrita e disponível
            if (publication.isSubscribed && publication.track) {
              console.log(`   🎥 Anexando track ${publication.kind} existente`);
              if (remoteRef.current) {
                console.log('   ✅ Container remoto disponível, anexando track...');
                attachTrack(publication.track, remoteRef.current);
              } else {
                console.error("❌ ERRO: remoteRef.current é nulo!");
                // Tenta novamente após um curto atraso
                setTimeout(() => {
                  if (remoteRef.current && publication.track) {
                    console.log('   🔄 Tentando anexar track novamente...');
                    attachTrack(publication.track, remoteRef.current);
                  }
                }, 1000);
              }
            }

            // track ativada depois
            publication.on("subscribed", track => {
              console.log(`   🎬 Track ${track.kind} do participante ${participant.identity} foi inscrita`);
              console.log(`   🎬 Nova track ${track.kind} inscrita`);
              console.log('   📝 Detalhes da track:', {
                id: track.id,
                kind: track.kind,
                isEnabled: track.isEnabled,
                isEnded: track.isEnded,
                mediaStreamTrack: track.mediaStreamTrack
              });
              
              if (remoteRef.current) {
                console.log('   ✅ Container remoto disponível, anexando track...');
                attachTrack(track, remoteRef.current);
              } else {
                console.error("❌ ERRO: remoteRef.current é nulo!");
                // Tenta novamente após um curto atraso
                setTimeout(() => {
                  if (remoteRef.current) {
                    console.log('   🔄 Tentando anexar track novamente...');
                    attachTrack(track, remoteRef.current);
                  }
                }, 1000);
              }
            });

            publication.on("unsubscribed", track => {
              console.log(`   🚫 Track ${track.kind} removida`);
              try {
                track.detach().forEach(el => {
                  if (el.parentNode) {
                    el.parentNode.removeChild(el);
                  }
                });
              } catch (error) {
                console.error('Erro ao remover elementos da track:', error);
              }
            });
            
            publication.on('publishFailed', error => {
              console.error(`❌ Falha ao publicar track ${publication.kind}:`, error);
            });
          });
        });

        // Quando alguém novo entra
        connectedRoom.on("participantConnected", participant => {
          console.log(`👋 NOVO PARTICIPANTE CONECTADO: ${participant.identity} (${participant.sid})`);
          // Atualiza o participante remoto quando alguém se conecta
          setRemoteParticipant(participant);
          console.log(`   📊 Tracks do participante:`, 
            Array.from(participant.tracks.values()).map(p => ({
              kind: p.kind,
              isSubscribed: p.isSubscribed,
              track: p.track ? 'presente' : 'ausente'
            }))
          );

          // Trata tracks já publicadas
          participant.tracks.forEach(publication => {
            console.log(`   🔔 Nova track ${publication.kind} disponível (${publication.trackSid})`);
            
            // Se já estiver inscrito e disponível
            if (publication.isSubscribed && publication.track) {
              console.log(`   🎥 Track ${publication.kind} já está inscrita`);
              if (remoteRef.current) {
                console.log('   ✅ Container remoto disponível, anexando track...');
                attachTrack(publication.track, remoteRef.current);
              } else {
                console.error("❌ ERRO: remoteRef.current é nulo!");
              }
            }

            // Quando uma nova track for inscrita
            publication.on("subscribed", track => {
              console.log(`   � Track ${track.kind} do participante ${participant.identity} foi inscrita`);
              console.log('   📝 Detalhes da track:', {
                id: track.id,
                kind: track.kind,
                isEnabled: track.isEnabled,
                isEnded: track.isEnded,
                mediaStreamTrack: track.mediaStreamTrack ? 'presente' : 'ausente'
              });
              
              if (remoteRef.current) {
                console.log("   ✅ Container remoto encontrado, anexando track...");
                attachTrack(track, remoteRef.current);
              } else {
                console.error("❌ ERRO: remoteRef.current é nulo!");
                // Tenta novamente após um curto atraso
                setTimeout(() => {
                  if (remoteRef.current) {
                    console.log('   🔄 Tentando anexar track novamente...');
                    attachTrack(track, remoteRef.current);
                  }
                }, 1000);
              }
            });
            
            publication.on('unsubscribed', track => {
              console.log(`   🚫 Track ${track.kind} do participante ${participant.identity} foi removida`);
              try {
                track.detach().forEach(el => {
                  if (el.parentNode) {
                    el.parentNode.removeChild(el);
                  }
                });
              } catch (error) {
                console.error('Erro ao remover elementos da track:', error);
              }
            });
            
            publication.on('publishFailed', error => {
              console.error(`❌ Falha ao publicar track ${publication.kind} do participante ${participant.identity}:`, error);
            });
          });
          
          // Eventos do participante
          participant.on('trackPublished', publication => {
            console.log(`   📡 Nova track ${publication.kind} publicada por ${participant.identity}`);
          });
          
          participant.on('trackUnpublished', publication => {
            console.log(`   🚮 Track ${publication.kind} não publicada mais por ${participant.identity}`);
          });
        });

        

        // Saída de participantes
        connectedRoom.on("participantDisconnected", participant => {
          detachParticipantTracks(participant);
          // Limpa o participante remoto quando desconecta
          setRemoteParticipant(null);
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
const [id_user, nome_user] = (() => {
  if (!identity || typeof identity !== "string") {
    return ["", ""];
  }

  // Caso a identidade venha no formato "1|Gustavo"
  if (identity.includes("|")) {
    const partes = identity.split("|");
    return [partes[0] || "", partes[1] || ""];
  }

  // Caso venha como JSON stringificado
  try {
    const parsed = JSON.parse(identity);
    return [parsed.id_Usuario || "", parsed.nome_Usuario || ""];
  } catch {
    return ["", ""];
  }
})();


  // Handlers de controles
  function handleToggleAudio() {
    try {
      if (!room) return;
      const pubs = Array.from(room.localParticipant.audioTracks?.values?.() || []);
      if (pubs.length === 0) return;
      const currentlyOn = pubs.some(p => p?.track?.isEnabled);
      pubs.forEach(p => {
        if (!p?.track) return;
        if (currentlyOn) p.track.disable(); else p.track.enable();
      });
      setIsMicOn(!currentlyOn);
    } catch (e) {
      console.error('Erro ao alternar áudio', e);
    }
  }

  function handleToggleVideo() {
    try {
      if (!room) return;
      const pubs = Array.from(room.localParticipant.videoTracks?.values?.() || []);
      if (pubs.length === 0) return;
      const currentlyOn = pubs.some(p => p?.track?.isEnabled);
      pubs.forEach(p => {
        if (!p?.track) return;
        if (currentlyOn) p.track.disable(); else p.track.enable();
      });
      setIsCamOn(!currentlyOn);
    } catch (e) {
      console.error('Erro ao alternar vídeo', e);
    }
  }

  function handleEndCall() {
    try {
      if (room) {
        // limpar tracks locais do DOM e parar
        room.localParticipant?.tracks?.forEach(publication => {
          const track = publication.track;
          try {
            track?.stop?.();
            track?.detach?.().forEach(el => el.remove());
          } catch (_) {}
        });
        room.disconnect();
      }
    } catch (e) {
      console.error('Erro ao encerrar chamada', e);
    } finally {
      setRoom(null);
      setRemoteParticipant(null);
      navigate('/home');
    }
  }

  return (
    <div className="video-call">
      <div className="video-shell">
        <div className="video-main">
          <div className="video-main-inner">
            <div className="video-main-video" id="remote-video" ref={remoteRef} />
            <div className="video-main-overlay">
              <div className="video-main-name">
                {remoteParticipant ? 
                  (() => {
                    // Extrai apenas o nome se estiver no formato "id|Nome"
                    const parts = remoteParticipant.identity.split('|');
                    return parts.length > 1 ? parts[1] : remoteParticipant.identity;
                  })() 
                  : (nome_user || "Aguardando participante...")}
              </div>
              <div className="video-main-actions">
                <div className="video-icon-pill video-icon-pill--mic" />
              </div>
            </div>
          </div>
        </div>

        <div className="video-bottom">
          <div className="video-self">
            <div className="video-self-video" id="local-video" ref={localRef} />
            <div className="video-self-footer">
              <span className="video-self-name">Você</span>
            </div>
          </div>

          <div className="video-controls">
            <button
              type="button"
              onClick={handleToggleAudio}
              disabled={!room}
              className={`video-control-btn video-control-btn--secondary ${!isMicOn ? 'video-control-btn--danger' : ''}`}
              aria-pressed={!isMicOn}
              aria-label={isMicOn ? 'Desativar microfone' : 'Ativar microfone'}
            >
              {isMicOn ? (
                <svg className="video-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="3" width="6" height="10" rx="3" />
                  <path d="M6 11a6 6 0 0 0 12 0" />
                  <path d="M12 17v4" />
                  <path d="M8 21h8" />
                </svg>
              ) : (
                <svg className="video-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="3" width="6" height="10" rx="3" />
                  <path d="M6 11a6 6 0 0 0 12 0" />
                  <path d="M12 17v4" />
                  <path d="M8 21h8" />
                  <path d="M4 4l16 16" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={handleToggleVideo}
              disabled={!room}
              className={`video-control-btn video-control-btn--secondary ${!isCamOn ? 'video-control-btn--danger' : ''}`}
              aria-pressed={!isCamOn}
              aria-label={isCamOn ? 'Desativar câmera' : 'Ativar câmera'}
            >
              {isCamOn ? (
                <svg className="video-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="6" width="12" height="12" rx="2" />
                  <path d="M15 10l6-3v10l-6-3z" />
                </svg>
              ) : (
                <svg className="video-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="6" width="12" height="12" rx="2" />
                  <path d="M15 10l6-3v10l-6-3z" />
                  <path d="M4 4l16 16" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={handleEndCall}
              className="video-control-btn video-control-btn--danger"
              aria-label="Encerrar chamada"
            >
              <svg className="video-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 6l12 12" />
                <path d="M18 6l-12 12" />
              </svg>
            </button>
          </div>
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
      </div>
    </div>
  );
}
