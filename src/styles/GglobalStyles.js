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
    font-family: 'Krona One', sans-serif;;
  }
`

export const CadStyle = createGlobalStyle`
*{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Krona One', sans-serif;;
    }
    body {
    background-image: url("../../src/assets/fund.png");
      height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`
export const CadoisStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Krona+One&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: #fff;
    font-family: 'Krona One', sans-serif;
    min-height: 100vh;
  }
`;
export const CalendarioGlobal = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Krona One', sans-serif;
  }

  body {
    background-color: white;
    font-family: 'Krona One', sans-serif;
    display: block;
    height: 100vh
  }
`;

