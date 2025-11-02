import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cadastro.css';
import emailIcon from '../../assets/email.png';
import lockIcon from '../../assets/Lock.png';

function Cadastro() {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useState(() => {
    // Primeiro desliza o azul para a posição
    setTimeout(() => setIsEntering(false), 50);
    // Depois mostra o conteúdo
    setTimeout(() => setShowContent(true), 800);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleSignup = () => {
    alert('Cadastro com Google em desenvolvimento');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.password || !formData.confirmPassword) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    // Criar notificação de sucesso
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = 'Cadastro realizado com sucesso!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
        navigate('/login');
      }, 300);
    }, 2000);
  };

  const handleLoginRedirect = () => {
    setIsTransitioning(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          navigate('/login');
        }, 1200);
      });
    });
  };

  return (
    <div className={`cadastro-container ${isTransitioning ? 'transitioning' : ''}`}>
      <div className={`cadastro-left ${isTransitioning ? 'slide-full-reverse' : ''} ${isEntering ? 'entering-from-right' : ''}`}>
        <div className="wave-animation-cadastro"></div>
        <div className={`left-content ${showContent ? 'show-content' : ''}`}>
          <h2 className="welcome-text-cadastro">Já possui conta?</h2>
          <p className="welcome-subtitle-cadastro">Para se manter conectado <br></br>com a gente faça login</p>
          <button className="login-redirect-btn" onClick={handleLoginRedirect}>
            Login
          </button>
        </div>
      </div>

      <div className={`cadastro-right ${isTransitioning ? 'slide-out-right' : ''} ${isEntering ? 'entering-right' : ''} ${showContent ? 'show-content' : ''}`}>
        <h1 className="cadastro-title">Criar Conta</h1>
        
        <button className="google-btn-cadastro" onClick={handleGoogleSignup}>
          <svg className="google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Cadastrar com Google
        </button>

        <div className="divider-cadastro">
          <span>Ou use seu email para cadastro</span>
        </div>

        <form onSubmit={handleSubmit} className="cadastro-form">
          <div className="input-group-cadastro">
            <img src={emailIcon} alt="User" className="input-icon-img-cadastro" />
            <input
              type="text"
              name="nome"
              placeholder="NOME COMPLETO"
              value={formData.nome}
              onChange={handleChange}
              className="cadastro-input"
            />
          </div>

          <div className="input-group-cadastro">
            <img src={emailIcon} alt="Email" className="input-icon-img-cadastro" />
            <input
              type="email"
              name="email"
              placeholder="EMAIL"
              value={formData.email}
              onChange={handleChange}
              className="cadastro-input"
            />
          </div>

          <div className="input-group-cadastro">
            <img src={lockIcon} alt="Lock" className="input-icon-img-cadastro" />
            <input
              type="password"
              name="password"
              placeholder="SENHA"
              value={formData.password}
              onChange={handleChange}
              className="cadastro-input"
            />
          </div>

          <div className="input-group-cadastro">
            <img src={lockIcon} alt="Lock" className="input-icon-img-cadastro" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="CONFIRMAR SENHA"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="cadastro-input"
            />
          </div>

          <button type="submit" className="cadastro-btn">
            CADASTRAR
          </button>
        </form>
      </div>
    </div>
  );
}

export default Cadastro;