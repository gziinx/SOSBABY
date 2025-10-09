import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  gap: 40px;
  padding: 40px;
  width: 100%;
  height: 969px;
`;

export const Lateral = styled.div`
  background-color: #708EF1;
  border-radius: 25px;
  padding: 30px;
  width: 50%;
  display: flex;
  flex-direction: column;
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: center; /* centraliza horizontalmente */
  align-items: center;     /* centraliza verticalmente */
  width: 100%;
  min-height: calc(100vh - 80px); /* 100% da altura da tela menos a altura do header */
`;

export const Titulo = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
`;

export const ListaEventos = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-right: 5px;
`;

export const CardEvento = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-3px);
  }

  h3 {
    font-weight: 700;
    font-size: 1.1rem;
  }

  p {
    font-size: 0.9rem;
    color: #555;
  }
`;

export const Circulo = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: ${(p) => p.cor || "#555"};
  margin-right: 15px;
`;

export const Form = styled.form`
  background-color: white;
  border-radius: 20px;
  padding: 10px;
  display: flex;
  align-items: center;
  margin-top: 20px;
  gap: 8px;
`;

export const Input = styled.input`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 6px;
  flex: 1;
  outline: none;
`;

export const BotaoAdd = styled.button`
  background-color: #2563eb;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
`;

export const CalendarioWrapper = styled.div`
  width: 100%;          /* ocupa toda a largura do container */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch; /* ocupa toda a largura */
  background-color: #f9f9f9;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 20px;        /* espaço interno */
`;

export const Cabecalho = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;          /* ocupa toda a largura */
  margin-bottom: 15px;

  button {
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
  }

  h2 {
    font-weight: 600;
    font-size: 1.4rem;
  }
`;

export const Tabela = styled.table`
  width: 100%;          /* ocupa toda a largura */
  text-align: center;
  border-collapse: collapse;

  th {
    color: #999;
    font-weight: 500;
    padding-bottom: 8px;
  }
`;  

export const Dia = styled.td`
  padding: 12px;
  color: ${(p) => (p.ativo ? "#333" : "#ccc")};
  position: relative;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: ${(p) => (p.ativo ? "pointer" : "default")};

  &:hover {
    background-color: ${(p) => (p.ativo ? "#e0f2ff" : "transparent")};
    transform: ${(p) => (p.ativo ? "scale(1.1)" : "none")};
  }

  ${(p) =>
    p.temEvento &&
    `
    font-weight: bold;
    color: #2563eb;
    &:after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      height: 6px;
      background-color: #2563eb;
      border-radius: 50%;
    }
  `}
`;


