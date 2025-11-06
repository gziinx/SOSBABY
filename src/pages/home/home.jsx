import { useEffect } from 'react';
import './home.css';
import logo from '../../assets/logoo.png';
import heroImg from '../../assets/home.png';
import homeRight from '../../assets/homeri.png';
import homeLeft from '../../assets/homeleft.png';

export default function Home() {
  useEffect(() => {
    try {
      if (window.lucide?.createIcons) window.lucide.createIcons();
    } catch {}
    // Render simples do calendário (sem eventos)
    const daysEl = document.getElementById('days');
    const monthYearEl = document.getElementById('month-year');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');

    if (!daysEl || !monthYearEl) return;

    let date = new Date();

    const months = [
      'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
      'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
    ];

    function renderCalendar() {
      const year = date.getFullYear();
      const month = date.getMonth();
      monthYearEl.textContent = `${months[month]} ${year}`;

      const firstDay = new Date(year, month, 1).getDay();
      const lastDate = new Date(year, month + 1, 0).getDate();

      daysEl.innerHTML = '';
      for (let i = 0; i < firstDay; i++) {
        daysEl.appendChild(document.createElement('div'));
      }
      for (let day = 1; day <= lastDate; day++) {
        const d = document.createElement('div');
        d.textContent = day;
        const dow = new Date(year, month, day).getDay();
        d.style.color = (dow === 0 || dow === 6) ? '#f34a4a' : '#4a6ef5';

        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
          d.classList.add('hoje');
        }
        daysEl.appendChild(d);
      }
    }

    prevBtn?.addEventListener('click', () => {
      date.setMonth(date.getMonth() - 1);
      renderCalendar();
    });
    nextBtn?.addEventListener('click', () => {
      date.setMonth(date.getMonth() + 1);
      renderCalendar();
    });

    renderCalendar();

    return () => {};
  }, []);

  return (
    <>
      <header>
        <nav className="nav">
          <div className="nav-left">
            <img src={logo} alt="SOS Baby" className="logu" />
          </div>
          <div className="nav-center">
            <a href="#">Home</a>
            <a href="#">Calendário</a>
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

      <main>
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
            <div className="calendar">
              <div className="header">
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

        {/* Routine */}
        <section className="routine-section">
          <h2>Rotina do dia</h2>
          <div className="routine">
            <div className="routine-tasks">
              <div className="task"><div className="task-dot completed"></div><span className="task-completed">Café da manhã</span><span>07:00</span></div>
              <div className="task"><div className="task-dot completed"></div><span className="task-completed">Creche</span><span>08:00</span></div>
              <div className="task"><div className="task-dot"></div>Buscar nenhém<span>11:30</span></div>
              <div className="task"><div className="task-dot"></div>Almoço<span>12:00</span></div>
              <div className="task"><div className="task-dot"></div>Soneca<span>13:30</span></div>
              <div className="task"><div className="task-dot"></div>Jantar<span>19:00</span></div>
              <div className="task"><div className="task-dot"></div>Dormir<span>20:30</span></div>
              <button className="btn">Ver rotina</button>
            </div>
            <div className="routine-sidebar">
              <div>Exames</div>
              <div>Dicas</div>
              <div>Rotinas</div>
            </div>
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