import { useEffect, useState } from 'react';
import './home.css';
import logo from '../../assets/logoo.png';
import heroImg from '../../assets/home.png';
import homeRight from '../../assets/homeri.png';
import homeLeft from '../../assets/homeleft.png';
import { useNavigate } from 'react-router-dom';
import senai from '../../assets/senai.png';
import ChatComIA from '../chatcomia/chatcomia';
import botIcon from '../../assets/Bot.png';
import chatIcon from '../../assets/Chat.png';
import documentIcon from '../../assets/Document.png';

function getUserIdFromToken() {
  try {
    const token = localStorage.getItem('token') || 
                 localStorage.getItem('authToken') ||
                 sessionStorage.getItem('token') ||
                 sessionStorage.getItem('authToken');
    
    if (!token) return 2; // fallback para ID 2
    
    // Decodificar o payload do JWT (parte do meio)
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    
    // Tenta encontrar o ID do usuário em diferentes formatos possíveis
    return decodedPayload.id_user || 
           decodedPayload.userId || 
           decodedPayload.user_id || 
           2; // fallback para ID 2
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return 2; // fallback para ID 2
  }
}

export default function Home() {
  const navigate = useNavigate();  
  const [rotinas, setRotinas] = useState([]);
  const [apiStatus, setApiStatus] = useState('loading');

  const fetchRotinas = async () => {
    try {
      console.log('Iniciando busca de rotinas...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token não encontrado no localStorage');
        setApiStatus('error');
        return;
      }
      
      const userId = getUserIdFromToken();
      if (!userId) {
        console.error('ID do usuário não encontrado no token');
        setApiStatus('error');
        return;
      }
      
      const url = `https://backend-sosbaby.onrender.com/v1/sosbaby/viewRoutines?id_user=${userId}`;
      console.log('URL da requisição:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Status da resposta:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      console.log('Dados recebidos:', responseData);
      
      if (responseData && Array.isArray(responseData.data)) {
        // Filtra as rotinas pelo ID do usuário (segurança adicional)
        const userRotinas = responseData.data.filter(rotina => 
          rotina && rotina.id_user && rotina.id_user.toString() === userId.toString()
        );
        
        // Mapeia os dados para garantir que estejam no formato esperado
        const rotinasFormatadas = userRotinas.map(rotina => ({
          ...rotina,
          titulo: rotina.titulo_rotina || rotina.titulo || 'Sem título',
          cor: rotina.cor || '#6366f1',
          data_rotina: rotina.data_rotina || new Date().toISOString().split('T')[0],
          hora: rotina.hora || '00:00'
        }));
        
        console.log('Rotinas formatadas:', rotinasFormatadas);
        setRotinas(rotinasFormatadas);
        setApiStatus('success');
      } else {
        console.log('Nenhuma rotina encontrada ou formato inválido de dados');
        setRotinas([]);
        setApiStatus('success');
      }
    } catch (error) {
      console.error('Erro ao buscar rotinas:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setApiStatus('error');
    }
  };

  useEffect(() => {
    fetchRotinas();
  }, []);

  useEffect(() => {
    try { if (window.lucide?.createIcons) window.lucide.createIcons(); } catch {}

    const daysContainer = document.getElementById('days');
    const monthYear = document.getElementById('month-year');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const tooltipContainer = document.getElementById('tooltip-global-container');
    if (!daysContainer || !monthYear || !tooltipContainer) return;

    let date = new Date();
    let todosEventos = [];

    function formatarHora(horaUTC) {
      const d = new Date(horaUTC);
      const h = String(d.getUTCHours()).padStart(2,'0');
      const m = String(d.getUTCMinutes()).padStart(2,'0');
      return `${h}:${m}`;
    }

    async function buscarEventos() {
      try {
        const response = await fetch('https://backend-sosbaby.onrender.com/v1/sosbaby/calenders');
        const data = await response.json();
        if (response.ok && Array.isArray(data.dateCalender)) {
          todosEventos = data.dateCalender;
          marcarDiasComEventos(todosEventos);
        } else {
          todosEventos = [];
          marcarDiasComEventos([]);
        }
      } catch (e) {
        marcarDiasComEventos([]);
      }
    }

    function renderCalendar(direction) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      const lastDate = new Date(year, month + 1, 0).getDate();
      const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
      monthYear.textContent = `${months[month]} ${year}`;

      daysContainer.innerHTML = '';
      for (let i = 0; i < firstDay; i++) daysContainer.appendChild(document.createElement('div'));
      for (let day = 1; day <= lastDate; day++) {
        const el = document.createElement('div');
        el.textContent = day;
        el.classList.add('dia');
        const dataCompleta = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        el.setAttribute('data-data', dataCompleta);

        const dow = new Date(year, month, day).getDay();
        el.style.color = (dow === 0 || dow === 6) ? '#f34a4a' : '#4a6ef5';

        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
          el.classList.add('today');
        }
        daysContainer.appendChild(el);
      }

      marcarDiasComEventos(todosEventos);
      if (direction) {
        daysContainer.classList.add('fade');
        setTimeout(() => daysContainer.classList.remove('fade'), 200);
      }
    }

    function marcarDiasComEventos(eventos) {
      // limpa pontos anteriores
      document.querySelectorAll('.dia .ponto-evento').forEach(p => p.remove());
      tooltipContainer.innerHTML = '';

      const eventosPorData = {};
      eventos.forEach(ev => {
        const data = ev.data_calendario.split('T')[0];
        (eventosPorData[data] ||= []).push(ev);
      });

      document.querySelectorAll('.dia').forEach(dia => {
        const dataDia = dia.getAttribute('data-data');
        const lista = eventosPorData[dataDia];
        if (!lista) return;

        // ordena por hora
        lista.sort((a,b) => {
          const da = new Date(a.hora_calendario); const db = new Date(b.hora_calendario);
          return (da.getUTCHours()*60+da.getUTCMinutes()) - (db.getUTCHours()*60+db.getUTCMinutes());
        });

        const ponto = document.createElement('span');
        ponto.classList.add('ponto-evento');
        dia.appendChild(ponto);

        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.innerHTML = lista.map(ev => `
          <div class="tooltip-evento">
            <div class="circulo" style="background-color:${ev.cor || '#708EF1'}"></div>
            <h4 class="titulo-tooltip">${ev.titulo}</h4>
            <p class="hora-tooltip">${formatarHora(ev.hora_calendario)}</p>
          </div>
        `).join('');
        tooltipContainer.appendChild(tooltip);

        // Inicialmente esconder o tooltip
        tooltip.style.display = 'none';
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
        
        dia.addEventListener('mouseenter', () => {
          console.log('Mouse enter no dia');
          
          // Primeiro, tornar o tooltip visível para calcular as dimensões
          tooltip.style.display = 'block';
          tooltip.style.visibility = 'hidden';
          tooltip.style.opacity = '0';
          
          // Forçar o navegador a recalcular o layout
          void tooltip.offsetHeight;
          
          // Obter a posição do dia
          const rect = dia.getBoundingClientRect();
          
          // Obter as dimensões do tooltip
          const tooltipWidth = tooltip.offsetWidth;
          const tooltipHeight = tooltip.offsetHeight;
          
          console.log('Dimensões do tooltip:', { width: tooltipWidth, height: tooltipHeight });
          
          // Calcular a posição centralizada horizontalmente
          let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          
          // Ajustar para não sair da tela
          left = Math.max(10, left);
          left = Math.min(left, window.innerWidth - tooltipWidth - 10);
          
          // Posicionar acima do dia
          const top = rect.top - tooltipHeight - 5;
          
          console.log('Posicionando tooltip em:', { top, left });
          
          // Aplicar posições
          tooltip.style.position = 'fixed';
          tooltip.style.left = `${left}px`;
          tooltip.style.top = `${top}px`;
          
          // Forçar renderização antes de mostrar
          void tooltip.offsetHeight;
          
          // Tornar visível com transição suave
          tooltip.style.visibility = 'visible';
          tooltip.style.opacity = '1';
          tooltip.classList.add('show');
        });
        
        dia.addEventListener('mouseleave', () => {
          console.log('Mouse leave do dia');
          tooltip.classList.remove('show');
          tooltip.style.opacity = '0';
          
          setTimeout(() => {
            if (!tooltip.classList.contains('show')) {
              tooltip.style.display = 'none';
              tooltip.style.visibility = 'hidden';
              tooltip.style.position = 'absolute'; // Reset para o próximo uso
            }
          }, 200);
        });
      });
    }

    prevBtn?.addEventListener('click', () => { date.setMonth(date.getMonth() - 1); renderCalendar('prev'); });
    nextBtn?.addEventListener('click', () => { date.setMonth(date.getMonth() + 1); renderCalendar('next'); });

    // Primeiro cria os dias, depois marca os eventos (evita marcar antes de existir .dia)
    renderCalendar();
    buscarEventos();

    return () => {};
  }, []);

  const handleCalendar = () => {
    navigate('/calendario');
  };
  const handleConsulta = () => {
    navigate('/consulta');
  };
  const handleRotina = () => {
    navigate('/rotina');
  };
  const handlePerfil = () => {
    navigate('/perfil');
  };
  const handleHome = () => {
    navigate('/home');
  };
   const handleChat = () => {
    navigate('/chat');
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
            <a href="" onClick={handleConsulta}>Consultas</a>
            <a href="" onClick={handleRotina}>Rotina</a>
          </div>
          <div className="nav-right"onClick={handlePerfil}>
            <i data-lucide="bell" className="icon" ></i>
            <i data-lucide="user" className="icon user-icon"></i>
          </div>
        </nav>
      </header>

      <main className='cu'>
        {/* Hero */}
        <section className="hero">
          <div className="hero-text">
            <h1>CUIDAR É AMAR</h1>
            <p>Descubra como nossos serviços ajudam você a acompanhar cada momento do seu bebê com mais segurança e carinho.</p>
            <button>Explorar</button>
          </div>
          <div>
            {/* Substitua o src abaixo quando adicionar a imagem */}
            <img src={heroImg} alt="Cuidados com bebê" />
          </div>
        </section>

        {/* Services */}
        <section className="services">
          <h2>Serviços</h2>
          <div className="services-grid">
            <div className="service" onClick={() => {
              document.querySelector('.chat-ia-section')?.scrollIntoView({ behavior: 'smooth' });
            }} style={{ cursor: 'pointer' }}>
              <div className="service-icon">
                <img src={botIcon} alt="Bot" style={{ width: '60px', height: '60px' }} />
              </div>
              <h3>IA</h3>
              <p>Realize pesquisas e receba respostas imediatas pela IA</p>
            </div>
            <div className="service" onClick={handleChat} style={{ cursor: 'pointer' }}>
              <div className="service-icon">
                <img src={chatIcon} alt="Chat" style={{ width: '60px', height: '60px' }} />
              </div>
              <h3>Chat com médico</h3>
              <p>Converse em tempo real com médicos especializados</p>
            </div>
            <div className="service" onClick={handleRotina} style={{ cursor: 'pointer' }}>
              <div className="service-icon">
                <img src={documentIcon} alt="Documento" style={{ width: '60px', height: '60px' }} />
              </div>
              <h3>Rotina</h3>
              <p>Acompanhe e gerencie as rotinas do seu bebê</p>
            </div>
          </div>
        </section>

        {/* Calendar */}
        <section className="calendar-section">
          <div className="titu">
            <a>Lembretes</a>
          </div>
          <p>
            Acompanhe consultas, vacinas e lembretes importantes para o bem-
            <br />estar do seu bebê.
          </p>
          <div id="tooltip-global-container"></div>

          <div className="calendar-container">
            <div className="calendarali">
              <div className="ola">
                <button id="prev" className="nav-btn">←</button>
                <h2 id="month-year">Outubro 2025</h2>
                <button id="next" className="nav-btn">→</button>
              </div>

              <div className="weekdays" id="weekdays">
                <div className="weekend">Dom</div>
                <div className="weekday">Seg</div>
                <div className="weekday">Ter</div>
                <div className="weekday">Qua</div>
                <div className="weekday">Qui</div>
                <div className="weekday">Sex</div>
                <div className="weekend">Sáb</div>
              </div>

              <div className="days" id="days"></div>
              
              {/* Botão Ver Calendário Completo */}
              <div className="calendar-actions" style={{ marginTop: '3rem', textAlign: 'center' }}>
                <button 
                  className="btn" 
                  onClick={() => navigate('/calendario')}
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 2rem',
                    background: '#708EF1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    transition: '0.3s',
                    fontSize: '1rem',
                    fontWeight: '600',
                    margin: '1rem 0 0 0'
                  }}
                >
                  Ver Calendário Completo
                </button>
              </div>
            </div>

            <div className="linha"></div>
            {/* Substitua os src abaixo quando adicionar as imagens */}
            <img src={homeRight} alt="" className="direta" />
            <img src={homeLeft} alt="" className="esquerda" />
          </div>
        </section>

        {/* Routine */}
        <section className="routine-section">
          <div className="routine-container">
            <h2>Rotina do dia</h2>
            {apiStatus === 'loading' ? (
              <div className="routine-loading">Carregando rotina...</div>
            ) : apiStatus === 'error' ? (
              <div className="routine-error">
                <p>Não foi possível carregar as rotinas. Tente novamente mais tarde.</p>
                <button className="btn" onClick={fetchRotinas}>Tentar novamente</button>
              </div>
            ) : rotinas.length > 0 ? (
              <div className="routine">
                <div className="routine-tasks">
                  {rotinas.map((rotina, index) => {
                    // Formata a hora para exibição
                    const horaFormatada = rotina.hora ? 
                      rotina.hora.includes('T') ? 
                        new Date(rotina.hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 
                        rotina.hora : 
                      '--:--';
                    
                    return (
                      <div key={index} className="task" style={{ borderLeft: `4px solid ${rotina.cor || '#6366f1'}` }}>
                        <div className="task-dot" style={{ backgroundColor: rotina.cor || '#6366f1' }}></div>
                        <div className="task-info">
                          <span className="task-title">{rotina.titulo_rotina || rotina.titulo || 'Sem título'}</span>
                          {rotina.descricao && <span className="task-desc">{rotina.descricao}</span>}
                        </div>
                        <span className="task-time">{horaFormatada}</span>
                      </div>
                    );
                  })}
                  <div className="routine-actions" style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <button className="btn" onClick={() => navigate('/rotina')}>Ver rotina completa</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-routine">
                <p>Você ainda não tem uma rotina cadastrada.</p>
                <button className="btn" onClick={() => navigate('/rotina')}>Criar rotina</button>
              </div>
            )}
          </div>
        </section>

        {/* Chat IA */}
        <section className="chat-ia-section">
          <div className="chat-ia-container">
            <ChatComIA />
          </div>
        </section>
      </main>

      <footer>
        <div className="socials">
          <img src={senai} alt="" />
        </div>
        <p>&copy; {new Date().getFullYear()} SOS Baby. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}