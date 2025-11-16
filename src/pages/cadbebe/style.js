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
  border-radius: 50px;
  padding: 40px;
  width: 1000px;
  border: 1px solid black;
  margin-bottom: 10px;
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
  border: 1px solid #d3a6b5;
  border-radius: 10px;
  height: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #fff;
  margin-bottom: 15px;
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

/* Lado direito com imagem */
export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 420px;
  width: 100%;
  min-height: 100vh;
  padding: 0 20px;
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 30px;
`;

export const FundoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  max-height: 900px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Fundu = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50px 0 0 50px;
`;

export const TituloSobreImagem = styled.div`
  position: absolute;
  top: 30px;
  background: #4969d0;
  padding: 14px 30px;
  font-size: 22px;
  color: #fff;
  border-radius: 20px;
`;

export const VoltarBtn = styled.button`
  position: absolute;
  bottom: 30px;
  background: #fff;
  padding: 12px 22px;
  font-size: 16px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #e6e6e6;
  }
`;
