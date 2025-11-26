import React from 'react';
import { useNavigate } from 'react-router-dom';
import './perfil.css';
import bebe from '../../assets/bebe.png';
import logo from '../../assets/logoo.png';
import { PerfilStyle } from '../../styles/GglobalStyles';
const Perfil = () => {
  const navigate = useNavigate();

  // 🔥 Todas as funções devem ficar AQUI, no escopo do componente
  const handlePerfilBebe = () => {
    navigate('/perfilbebe');
  };

  const handleCalendar = (e) => {
    e.preventDefault();
    navigate('/calendario');
  };

  const handleConsulta = (e) => {
    e.preventDefault();
    navigate('/consulta');
  };

  const handleRotina = (e) => {
    e.preventDefault();
    navigate('/rotina');
  };

  const handlePerfil = (e) => {
    e.preventDefault();
    navigate('/perfil');
  };

  const handleHome = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <>
      <PerfilStyle/>
      <header>
        <nav className="nav">
          <div className="nav-left">
            <img src={logo} alt="SOS Baby" className="logu" />
          </div>

          <div className="nav-center">
            <a href="" onClick={handleHome}>Home</a>
            <a href="" onClick={handleCalendar}>Calendário</a>
            <a>Dicas</a>
            <a href="" onClick={handleConsulta}>Consultas</a>
            <a href="" onClick={handleRotina}>Rotina</a>
          </div>

          <div className="nav-right">
            <i data-lucide="bell" className="icon"></i>
            <i data-lucide="user" className="icon user-icon"></i>
          </div>
        </nav>
        </header>
      <div className="container">
        <div className="header">
          <h2>Perfil do Responsável</h2>
        </div>

        <div className="logobebe" onClick={handlePerfilBebe}>
          <img src={bebe} alt="Ícone de bebê" />
        </div>

        <div className="perfil">
          <h3>NOME/APELIDO RESPONSÁVEL</h3>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="foto perfil"
          />
          <br />
          <button>✏️ Editar</button>
        </div>

        <div className="campos">
          <div className="campo campo-full">
            <label>Nome/Apelido</label>
            <input type="text" placeholder="ROBERTO" readOnly />
          </div>

          <div className="campo campo-full">
            <label>Data de Nascimento</label>
            <input type="text" placeholder="01/04/1998" readOnly />
          </div>

          <div className="campo">
            <label>CPF</label>
            <input type="text" placeholder="432.065.774-01" required />
          </div>

          <div className="campo">
            <label>Telefone</label>
            <input type="text" placeholder="(11) 99132-3444" readOnly />
          </div>

          <div className="campo campo-full">
            <label>E-mail</label>
            <input type="text" placeholder="feliccc31@gmail.com" readOnly />
          </div>

          <div className="campo campo-full">
            <label>Cartão SUS/Convênio</label>
            <input type="text" placeholder="3704 5563 7184 423" readOnly />
          </div>
        </div>

        <button className="bore" type="submit">Salvar</button>
      </div>
    </>
  );
};

export default Perfil;
