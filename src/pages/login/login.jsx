import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

import emailIcon from '../../assets/email.png';
import lockIcon from '../../assets/Lock.png';
import eyeIcon from '../../assets/Eye.png';
import closedEyeIcon from '../../assets/Closed Eye.png';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useState(() => {
    setTimeout(() => setIsEntering(false), 50);
    setTimeout(() => setShowContent(true), 800);
  }, []);

  // ============================================
  // 🔐 LOGIN REAL OFICIAL COM TOKEN
  // ============================================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      const response = await fetch("https://backend-sosbaby.onrender.com/v1/sosbaby/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          senha: password
        })
      });

      const resultado = await response.json();
      console.log("RESPOSTA LOGIN:", resultado);

      if (!response.ok) {
        alert(resultado.message || "Erro ao tentar logar");
        return;
      }

      // ===============================
      //  ✅ SALVAR TOKEN NO LOCALSTORAGE
      // ===============================
      localStorage.setItem("token", resultado.token);

      // ===============================
      //  ✅ SALVAR DADOS DO USUÁRIO
      // ===============================
      localStorage.setItem("user", JSON.stringify(resultado.data));

      // Notificação de sucesso
      const notification = document.createElement('div');
      notification.className = 'notification success';
      notification.textContent = 'Login realizado com sucesso!';
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add('show');
      }, 10);

      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 2000);

      // ============================================
      //  ✅ REDIRECIONAMENTO POR TIPO DE USUÁRIO
      // ============================================
      const tipo = resultado.data.tipo_user;

      if (tipo === "ADMIN") {
        navigate("/cadclinica");
      } 
      else if (tipo === "Médico") {
        navigate("/cadmedico");
      } 
      else if (tipo === "Responsável") {
        navigate("/home");
      } 
      else {
        navigate("/");
      }

    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor");
    }
  };

  // ============================================

  const handleForgotPassword = () => navigate('/recuperar-senha');

  const handleSignup = () => {
    setIsTransitioning(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          navigate('/cadastro');
        }, 1200);
      });
    });
  };

  return (
    <div className={`login-container ${isTransitioning ? 'transitioning' : ''}`}>

      <div className={`login-left ${isTransitioning ? 'slide-out-left' : ''} ${isEntering ? 'entering-left' : ''} ${showContent ? 'show-content' : ''}`}>
        <h1 className="login-title">Entrar com</h1>

        <div className="divider">
          <span>Use seu email e senha</span>
        </div>

        <form onSubmit={handleLogin} className="login-form">

          <div className="input-group">
            <img src={emailIcon} alt="Email" className="input-icon-img" />
            <input
              type="email"
              placeholder="EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
          </div>

          <div className="input-group">
            <img src={lockIcon} alt="Lock" className="input-icon-img" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="SENHA"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img
                src={showPassword ? eyeIcon : closedEyeIcon}
                alt="Toggle password visibility"
                className={showPassword ? "eye-icon" : "eye-icon closed-eye"}
              />
            </button>
          </div>

          <a className="forgot-password" onClick={handleForgotPassword}>
            Esqueceu sua senha?
          </a>

          <button type="submit" className="login-btn">
            LOGAR
          </button>
        </form>
      </div>

      <div className={`login-right ${isTransitioning ? 'slide-full' : ''} ${isEntering ? 'entering-from-left' : ''}`}>
        <div className={`right-content ${showContent ? 'show-content' : ''}`}>
          <h2 className="welcome-text">Olá Usuário!!</h2>
          <p className="welcome-subtitle">Cadastre-se e comece a usar nossa plataforma</p>

          <button className="signup-btn" onClick={handleSignup}>
            Cadastre-se
          </button>
        </div>
      </div>

    </div>
  );
}

export default Login;
