import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logo from '../../assets/logo.png';
import { Inicioala } from '../../styles/GglobalStyles';

function Inicio() {
  const navigate = useNavigate();
  const [headerBg, setHeaderBg] = useState('rgba(255, 255, 255, 0.95)');
  const [headerTextColor, setHeaderTextColor] = useState('black');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Seção Bem Vindo (branco)
      if (scrollPosition < windowHeight * 0.8) {
        setHeaderBg('rgba(255, 255, 255, 0.95)');
        setHeaderTextColor('black');
      }
      // Seção Quem Somos (#737371)
      else if (scrollPosition < windowHeight * 1.8) {
        setHeaderBg('rgba(115, 115, 113, 0.95)');
        setHeaderTextColor('white');
      }
      // Seção Benefícios (branco)
      else if (scrollPosition < windowHeight * 2.8) {
        setHeaderBg('rgba(255, 255, 255, 0.95)');
        setHeaderTextColor('black');
      }
      // Footer (escuro)
      else {
        setHeaderBg('rgba(44, 62, 80, 0.95)');
        setHeaderTextColor('white');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSing = () => {
    navigate('/tipo');
  };

  const handleStart = () => {
    navigate('/tipo');
  };

  return (
    <div className="app">
      <Inicioala/>
      {/* Header */}
      <header className="headers" style={{ backgroundColor: headerBg, color: headerTextColor }}>
        <div className="logo-container">
          <img src={logo} alt="SOS Baby Logo" className="logo-img" />
        </div>
        
        <nav className='navss'>
          <ul className="nav-links">
            <li><a onClick={() => scrollToSection('inicio')}>Início</a></li>
            <li><a onClick={() => scrollToSection('sobre')}>Sobre</a></li>
            <li><a onClick={() => scrollToSection('contato')}>Contato</a></li>
          </ul>
        </nav>

        <div className="headers-buttons">
          <button className="btn-login" onClick={handleLogin}>Login</button>
          <button className="btn-signup" onClick={handleSing}>Sing Up</button>
        </div>
      </header>

      {/* Welcome Section */}
      <section id="inicio" className="section welcome-section">
        <div className="welcome-content">
          <h1>Bem Vindo!</h1>
          <p className="subtitle">Cuidando do seu bebê</p>
          <p className="description">
            Uma plataforma completa para acompanhar o desenvolvimento do seu bebê, conectar com
            profissionais de saúde e registrar cada momento especial dessa jornada
          </p>
          <button className="btn-start" onClick={handleStart}>Começar</button>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="section about-section">
        <h2>QUEM SOMOS!</h2>
        <div className="cards-container">
          <div className="card">
            <div className="card-icon">👥</div>
            <h3>Equipe</h3>
            <p>
              Somos uma time de auxiliar País de primeira viagem a
              cuidar do seu bebê
            </p>
          </div>

          <div className="card">
            <div className="card-icon">🏥</div>
            <h3>Rede de Apoio</h3>
            <p>
              Funcionamos como uma rede de apoio criada para auxiliar pais de
              primeira viagem a cuidar do seu bebê
            </p>
          </div>

          <div className="card">
            <div className="card-icon">🌐</div>
            <h3>Tecnologia</h3>
            <p>
              Oferecemos auxilio tecnológico que otimiza o cuidado do bebê através de
              novas informações
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="section benefits-section">
        <h2>Benefícios!</h2>
        <div className="benefits-container">
          <div className="benefit-card">
            <h3>Consultas Médicas</h3>
            <p>
              Uma plataforma completa para acompanhar o desenvolvimento do
              seu bebê, conectar com profissionais de saúde e registrar
              cada momento especial dessa jornada
            </p>
          </div>

          <div className="benefit-card">
            <h3>Rotina Diária</h3>
            <p>
              Uma plataforma completa para acompanhar o desenvolvimento do
              seu bebê, conectar com profissionais de saúde e registrar
              cada momento especial dessa jornada
            </p>
          </div>

          <div className="benefit-card">
            <h3>Inteligência Artificial</h3>
            <p>
              Uma plataforma completa para acompanhar o desenvolvimento do
              seu bebê, conectar com profissionais de saúde e registrar
              cada momento especial dessa jornada
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="footer">
        <h3>Contac Us</h3>
        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-icon">✉️</span>
            <span>email: sosbaby@gmail.com</span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <span>+55 (11) 98905543</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Inicio;