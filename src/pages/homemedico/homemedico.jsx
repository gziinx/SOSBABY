import { useEffect, useState } from 'react';
import './homemedico.css';
import logo from '../../assets/logoo.png';
import heroImg from '../../assets/home.png';
import homeRight from '../../assets/homeri.png';
import homeLeft from '../../assets/homeleft.png';
import { useNavigate } from 'react-router-dom';
import senai from '../../assets/senai.png';
import ChatComIA from '../chatcomia/chatcomia';

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

export default function HomeMedico() {
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

        dia.addEventListener('mouseenter', () => {
          tooltip.style.display = 'block';
          const rect = dia.getBoundingClientRect();
          const top = rect.top + window.scrollY - tooltip.offsetHeight - 8;
          const left = rect.left + window.scrollX + rect.width/2 - tooltip.offsetWidth/2;
          const screenWidth = document.documentElement.clientWidth;
          tooltip.style.top = `${top}px`;
          tooltip.style.left = `${Math.max(10, Math.min(left, screenWidth - tooltip.offsetWidth - 10))}px`;
          setTimeout(() => tooltip.classList.add('show'), 10);
        });
        dia.addEventListener('mouseleave', () => {
          tooltip.classList.remove('show');
          setTimeout(() => { if (!tooltip.classList.contains('show')) tooltip.style.display = 'none'; }, 200);
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
    navigate('/criarconsulta');
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
              <div className="service-icon">🤖</div>
              <h3>AI</h3>
              <p>Somos uma time que auxilia pais de primeira viagem e pai mais solo.</p>
            </div>
            <div className="service" onClick={handleChat} style={{ cursor: 'pointer' }}>
              <div className="service-icon">💬</div>
              <h3>Chat </h3>
              <p>O Chat com a clinica e o paciente</p>
            </div>
            <div className="service" onClick={handleRotina} style={{ cursor: 'pointer' }}>
              <div className="service-icon">📋</div>
              <h3>Rotina</h3>
              <p>Acompanhe e gerencie as rotinas de seus pacientes</p>
            </div>
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