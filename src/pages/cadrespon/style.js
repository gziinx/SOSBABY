import { styled } from "styled-components";

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
`

export const LogoImg = styled.img`
    size: auto;
`
export const TituDiv = styled.div`
    background-color: #708EF1;
    color: white;
    border-radius: 30px;
    width: 232px;
    height: 55px;
    font-size: 16px;
    text-align: center;
    margin-bottom: 27px;
`
export const Formm = styled.form`
    background: #fff;
    border-radius: 50px;
    padding: 40px;
    width: 1000px;
    border: 1px solid black;
    margin-bottom: 10px;
`

export const Section = styled.div`

`
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
    color: #d36a96;
  }

`