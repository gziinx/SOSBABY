// StyledCadastro.jsx
import styled from "styled-components";

export const Logo = styled.div`
  background-color: #fff;
  width: 143px;
  height: 71px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  margin-bottom: 11px;
`;

export const LogoImg = styled.img`
  width: auto;
  height: 50px;
`;

export const TituDiv = styled.div`
  background-color: #708ef1;
  color: white;
  border-radius: 30px;
  width: 232px;
  height: 55px;
  font-size: 12px;
  text-align: center;
  line-height: 55px;
  margin-bottom: 27px;
`;

export const Formm = styled.form`
  background: #fff;
  padding: 60px;
  width: 100%;
  border: none;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 32px;
  }
`;

export const Section = styled.div`
  margin-bottom: 20px;
`;

export const Identificacao = styled.h2`
  font-family: 'Krona One', sans-serif;
  font-size: 22px;
  margin: 20px 0 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #000;
  &::before {
    content: "${(props) => props.icon || "❤"}";
    font-size: 22px;
    color: ${(props) => (props.icon ? "#d36a96" : "#d36a96")};
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-family: 'Krona One', sans-serif;
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
  font-family: 'Krona One', sans-serif;
  box-sizing: border-box;
  transition: border 0.3s;
`;

export const Row = styled.div`
  display: flex;
  gap: 40px;
  width: 100%;
`;

export const UploadBox = styled.label`
  width: 100%;
  height: 120px;
  border: 2px dashed #d3a6b5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #fff;
  margin-bottom: 15px;
  text-align: center;
  transition: 0.3s;

  &:hover {
    border-color: #708ef1;
    background: #f7f9ff;
  }
`;

export const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Krona One', sans-serif;
  font-size: 16px;
  cursor: pointer;

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: #708ef1; /* cor do check */
    cursor: pointer;
  }

  label {
    cursor: pointer;
  }
`;

export const BtnContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const Btn = styled.button`
  margin-top: 20px;
  width: 236px;
  padding: 15px;
  font-size: 16px;
  background: #708ef1;
  color: #000;
  border: 1px solid black;
  border-radius: 30px;
  font-family: 'Krona One', sans-serif;
  cursor: pointer;
  height: 96px;

  &:hover {
    background: #357abd;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #aaa;
  border-radius: 30px;
  font-size: 16px;
  font-family: 'Krona One', sans-serif;
  box-sizing: border-box;
  transition: border 0.3s;
`;
/* Container geral lado a lado */
export const Tela = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  margin-top: 20px;
`;

/* Lado esquerdo (formulário) */
export const LadoEsquerdo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* Layout principal: formulário à esquerda e painel da imagem à direita */
export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: none;
  margin: 0;
  gap: 0;
  min-height: 100vh;
  align-items: stretch;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;  

  @media (max-width: 900px) {
    padding: 24px 20px;
  }
`;

export const FundoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const Fundu = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;

  @media (max-width: 900px) {
    height: 250px;
    width: 100%;
  }
`;

export const TituloSobreImagem = styled.h1`
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 42px;
  color: #ffffff;
  font-weight: 500;
  letter-spacing: 2px;
  text-align: center;

  @media (max-width: 900px) {
    font-size: 28px;
  }
`;

export const VoltarBtn = styled.button`
  position: absolute;
  bottom: 24px;
  right: 24px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 18px;
  font-size: 15px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;

  &:hover {
    background: #708ef1;
    color: #fff;
  }
`;
