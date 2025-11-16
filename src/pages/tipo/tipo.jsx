import React, { useState } from "react";
import "./tipo.css";
import bebe from "../../assets/bebe.png";
import { useNavigate } from "react-router-dom";

export default function Tipo() {
    const navigate = useNavigate();
    const [tipoSelecionado, setTipoSelecionado] = useState("");

    function voltar() {
        navigate(-1);
    }

    // Quando clicar no card → salva o tipo
    function selecionarTipo(tipo) {
        setTipoSelecionado(tipo);

        // salvar no localStorage (caso queira usar no cadastro)
        localStorage.setItem("tipo_usuario", tipo);

        // redireciona para cadastro depois
        navigate("/cadastro");
    }

    return (
        <div className="tipo-container">
            
            {/* Botão voltar */}
            <button className="btn-voltar" onClick={voltar}>
                ⬅ Voltar ao início
            </button>

            <header className="tipo-header">
                <h1>Quem é você?</h1>
                <p>
                    Escolha o tipo de conta que melhor representa você para <br />
                    começarmos sua jornada no SOS Baby.
                </p>
            </header>

            <main className="tipo-cards">

                {/* RESPONSÁVEL */}
                <Card 
                    img={bebe}
                    title="Responsável"
                    text="Para pais e cuidadores que desejam acompanhar o desenvolvimento do bebê."
                    onClick={() => navigate("/cadastro", { state: { tipo_id: 1 } })}
                />

                {/* MÉDICO */}
                <Card 
                    img={bebe}
                    title="Médico"
                    text="Para profissionais da saúde que acompanham o cuidado com o bebê."
                    onClick={() => navigate("/cadastro", { state: { tipo_id: 4 } })}
                />

                {/* ADMIN */}
                <Card 
                    img={bebe}
                    title="ADMIN"
                    text="Acesso ao painel administrativo e gerenciamento do sistema."
                    onClick={() => navigate("/cadastro", { state: { tipo_id: 3 } })}
                />

            </main>
        </div>
    );
}

function Card({ img, title, text, onClick }) {
    return (
        <div className="tipo-card" onClick={onClick}>
            <div className="tipo-card-img">
                <img src={img} alt="icone" />
            </div>

            <h2>{title}</h2>
            <p>{text}</p>
        </div>
    );
}
