import { useEffect } from 'react';
import './homeclinica.css';
import logo from '../../assets/logoo.png';
import heroImg from '../../assets/home.png';
import homeRight from '../../assets/homeri.png';
import homeLeft from '../../assets/homeleft.png';
import { useNavigate } from 'react-router-dom';

export default function HomeClinica() {
const navigate = useNavigate();  
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

  return (
    <>
      <header>
        <nav className="nav">
          <div className="nav-left">
            <img src={logo} alt="SOS Baby" className="logu" />
          </div>
          <div className="nav-center">
            <a href="#">Home</a>
            <a href="" onClick={handleCalendar}>Calendário</a>
            <a href="#">Dicas</a>
            <a href="#">Consultas</a>
            <a href="#">Rotina</a>
          </div>
          <div className="nav-right">
            <i data-lucide="bell" className="icon"></i>
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
            <div className="service">
              <div className="service-icon">🤖</div>
              <h3>AI</h3>
              <p>Somos uma time que auxilia pais de primeira viagem e pai mais solo.</p>
            </div>
            <div className="service">
              <div className="service-icon">💬</div>
              <h3>Chat com médico</h3>
              <p>Funcionalidade com uma plataforma aferideelat</p>
            </div>
            <div className="service">
              <div className="service-icon">📄</div>
              <h3>Relatórios</h3>
              <p>Oferecemos auxílio tecnológico que oferece a aferideelat</p>
            </div>
          </div>
        </section>

        {/* Calendar */}
        <section className="calendar-section">
          <div className="titu">
            <a>Seu Calendário de Rotinas</a>
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
            </div>

            <div className="linha"></div>
            {/* Substitua os src abaixo quando adicionar as imagens */}
            <img src={homeRight} alt="" className="direta" />
<img src={homeLeft} alt="" className="esquerda" />
          </div>
        </section>
        {/* Chat/FAQ */}
        <section className="chat-section">
          <div className="chat-box">
            <h3>Tire dúvidas rápidas com nossa IA</h3>
            <input type="text" placeholder="Faça sua pergunta..." />
            <button>Enviar</button>
          </div>
          <div className="faq">
            <h3>Dúvidas Frequentes</h3>
            <button>Como funciona o calendário?</button>
            <button>Como adicionar um lembrete?</button>
            <button>Como falar com um médico?</button>
          </div>
        </section>
      </main>

      <footer>
        <div className="socials">
          <a href="#" aria-label="Facebook">F</a>
          <a href="#" aria-label="Twitter">T</a>
          <a href="#" aria-label="Instagram">I</a>
        </div>
        <div className="brand">SOS Baby</div>
        <p>&copy; {new Date().getFullYear()} SOS Baby. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}