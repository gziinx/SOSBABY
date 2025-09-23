import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
    margin: 0;
    padding: 0;
    font-family: 'Krona One', sans-serif;
    background: url("../../src/assets/fundu2.png") no-repeat center center fixed;
    background-size: cover;
    font-family: 'Krona One', sans-serif;;
  }
`

export const CadStyle = createGlobalStyle`
*{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
    margin: 0;
    padding: 0;
    background-image: url("../../src/assets/fund.png");
      height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

