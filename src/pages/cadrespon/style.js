import styled from "styled-components";

// Container geral para alinhar a imagem (esquerda) e o formulário (direita)
export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: none;
  margin: 0;
  gap: 0;
  overflow: hidden;
  height: 100vh;
  background: #f3f4fb;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Fundu = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const Formm = styled.form`
  background: #fff;
  padding: 24px 48px 40px 48px;
  display: grid;
  width: 100%;
  max-width: 100%;
  min-height: 100vh;  /* Changed from height to min-height */
  border-radius: 0;
  margin: 0;
  align-self: stretch;
  overflow-y: auto;  /* Add scroll if content is too tall */

  @media (max-width: 1024px) {
    padding: 24px 24px 40px 24px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const Section = styled.div`
  margin-bottom: 10px;
`;

export const Identificacao = styled.h2`
  font-family: "Krona One", sans-serif;
  font-size: 22px;
  margin: 8px 0 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #000;
  &::before {
    content: "${(props) => props.icon || "❤"}";
    font-size: 22px;
    color: ${(props) => (props.icon ? "#d36a96" : "#d36a96")};
  }

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-family: "Krona One", sans-serif;
    font-size: 14px;
    color: #333;

    @media (max-width: 768px) {
      font-size: 12px;
    }
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #aaa;
  border-radius: 30px;
  font-size: 16px;
  font-family: "Krona One", sans-serif;
  box-sizing: border-box;
  transition: border 0.3s;

  &:focus {
    outline: none;
    border-color: #708ef1;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 14px;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 40px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

export const UploadBox = styled.label`
  width: 100%;
  height: 120px; 
  border: 2px dashed #d3a6b5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;   /* ← garante que fica no meio */
  cursor: pointer;
  transition: 0.3s;


  background: #fff;
  overflow: hidden;
  text-align: center;

  &:hover {
    border-color: #708ef1;
    background: #f7f9ff;
  }

  .icon {
    font-size: 40px;
    color: #d3a6b5;
  }

  span {
    font-size: 15px;
    color: #708ef1;
    padding: 0 10px;
  }
`;

export const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "Krona One", sans-serif;
  font-size: 16px;
  cursor: pointer;

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: #708ef1;
    cursor: pointer;
  }

  label {
    cursor: pointer;
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const BtnContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const Btn = styled.button`
  width: 180px;
  padding: 16px 24px;
  font-size: 16px;
  background: #708ef1;
  color: #ffffff;
  border: none;
  border-radius: 32px;
  font-family: "Krona One", sans-serif;
  cursor: pointer;
  height: 56px;
  transition: all 0.3s;

  &:hover {
    background: #357abd;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(112, 142, 241, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 70px;
    font-size: 14px;
  }
`;

export const FundoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

export const TituloSobreImagem = styled.h1`
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 20px;
  font-size: 36px;
  color: white;
  font-weight: small;
  border-radius: 10px;
  z-index: 2;
`;

/* Botão voltar */
export const VoltarBtn = styled.button`
  position: absolute;
  bottom: 20px;
  left: 20px;
  padding: 10px 18px;
  font-size: 15px;
  background: transparent;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.25);
  }
`;
