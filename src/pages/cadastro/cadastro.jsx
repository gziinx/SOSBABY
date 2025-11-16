import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Cadastro.css';
import emailIcon from '../../assets/email.png';
import lockIcon from '../../assets/Lock.png';

function Cadastro() {
  const navigate = useNavigate();
  const location = useLocation();

  // RECEBE O tipo_id DA TELA ANTERIOR
  const tipoSelecionado = location.state?.tipo_id || null;

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
    tipo_id: tipoSelecionado
  });

  // ⛔ Antes estava errado: useState(() => {})
  // ✅ Correto: useEffect()
  useEffect(() => {
    setTimeout(() => setIsEntering(false), 50);
    setTimeout(() => setShowContent(true), 800);
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // FUNÇÃO CORRIGIDA (estava faltando!)
  const handleLoginRedirect = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  // SUBMIT DO CADASTRO
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.password || !formData.confirmPassword) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }

    if (!formData.tipo_id) {
      alert("Tipo de usuário não definido! Volte e selecione um tipo.");
      return;
    }

    const dados = {
      nome_user: formData.nome,
      email: formData.email,
      senha: formData.password,
      id_tipo: formData.tipo_id
    };

    try {
      const response = await fetch("http://localhost:3030/v1/sosbaby/user/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
      });

      const resultado = await response.json();

      if (!response.ok) {
        alert("Erro ao cadastrar: " + resultado.message);
        return;
      }

      // Notificação
      const notification = document.createElement("div");
      notification.className = "notification success";
      notification.textContent = "Cadastro realizado com sucesso!";
      document.body.appendChild(notification);

      setTimeout(() => notification.classList.add("show"), 10);

      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
          notification.remove();
          navigate("/login");
        }, 300);
      }, 2000);

    } catch (error) {
      console.error("Erro no fetch:", error);
      alert("Erro ao conectar ao servidor");
    }
  };

  return (
    <div className={`cadastro-container ${isTransitioning ? "transitioning" : ""}`}>
      
      {/* LADO ESQUERDO */}
      <div className={`cadastro-left ${isTransitioning ? 'slide-full-reverse' : ''} ${isEntering ? 'entering-from-right' : ''}`}>
        <div className="wave-animation-cadastro"></div>
        <div className={`left-content ${showContent ? 'show-content' : ''}`}>
          <h2 className="welcome-text-cadastro">Já possui conta?</h2>
          <p className="welcome-subtitle-cadastro">
            Para se manter conectado <br /> com a gente faça login
          </p>

          {/* ERRO ESTAVA AQUI — botão chamava função inexistente */}
          <button className="login-redirect-btn" onClick={handleLoginRedirect}>
            Login
          </button>
        </div>
      </div>

      {/* LADO DIREITO */}
      <div className={`cadastro-right ${isTransitioning ? "slide-out-right" : ""} ${isEntering ? "entering-right" : ""} ${showContent ? "show-content" : ""}`}>
        
        <h1 className="cadastro-title">Criar Conta</h1>

        {/* MOSTRAR TIPO ESCOLHIDO */}
        <p style={{ marginBottom: "15px", fontWeight: "bold", color: "#444" }}>
          Tipo selecionado: {
            formData.tipo_id === 1 ? "Responsável" :
            formData.tipo_id === 3 ? "ADMIN" :
            formData.tipo_id === 4 ? "Médico" :
            "Nenhum"
          }
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="cadastro-form">

          {/* NOME */}
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

          {/* EMAIL */}
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

          {/* SENHA */}
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

          {/* CONFIRMAR SENHA */}
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

          <button type="submit" className="cadastro-btn">CADASTRAR</button>
        </form>

      </div>
    </div>
  );
}

export default Cadastro;
