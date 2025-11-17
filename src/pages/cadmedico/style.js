import { styled } from "styled-components";

export const Bore = styled.div`
    background: #fff;
    border: 1px solid #8AA9FF;
    border-radius: 40px;
    padding: 40px;
    margin-top: 40px;
    width: 822px;
    height: auto;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    text-align: center;
    gap: 10px; 

`
export const Titu = styled.h1`
margin-bottom: 30px;
    font-size: 50px;
    font-family: 'Krona One', sans-serif;;
    color: #000;
`

export const Linha = styled.div`
        background: #8AA9FF;
        width: 472px;
        height: 10px;
        margin: 0 auto;
        margin-top: 50px;

`
export const Butao = styled.button`
        background: #8AA9FF;
    border: 2px solid white;
    color: #fff;
    font-size: 30px;
    font-family: 'Krona One', sans-serif;;
    padding: 12px;
    border-radius: 30px;
    width: 440px;
    height: 100px;
    cursor: pointer;
    box-shadow: #000;
    margin-top: 40px;
`
export const Fundula = styled.img`
        position: absolute;
        top: 0px;
        left: 0px;
        height: 100vh;
         z-index: -9999;
`

// Layout em duas colunas igual ao cadbebe: formulário à esquerda, imagem à direita
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
  padding: 40px;

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
  top: 80px;
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
    background: #8AA9FF;
    color: #fff;
  }
`;