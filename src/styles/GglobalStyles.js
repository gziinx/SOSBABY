import { createGlobalStyle } from "styled-components";
export const PerfilStyle = createGlobalStyle`
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Krona One', sans-serif;
}

body {
    background-color: #708EF1;
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
}
`
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
export const Inicioala = createGlobalStyle`

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  font-family: 'Krona One', sans-serif;
  line-height: 1.5;
  font-weight: 400;
  
  --primary-color: #AEDCFF;
  --secondary-color: #708EF1;
  --tertiary-color: #537BC4;
  --dark-bg: #2C3E50;
  --light-bg: #FFFFFF;
  --text-dark: #537BC4;
  --text-light: #FFFFFF;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: var(--light-bg);
  color: var(--text-dark);
  overflow-x: hidden;
}

html {
  scroll-behavior: smooth;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  cursor: pointer;
  border: none;
  outline: none;
  font-family: inherit;
}
`
export const DicasStyle = createGlobalStyle`
*:root{
  --blue:#708EF1; /* Bebês e tons azuis gerais */
  --mom:#B3A0F6;  /* Mães */
  --dad:#4A5BAE;  /* Pais, combinado com azul */
  --title:#081C60; /* Cor dos títulos fora do card */
  --bg:#ffffff;
  --text:#0f172a;
}
*{box-sizing:border-box}
html,body,#root{height:100%}
body{
  margin:0; background:var(--bg); color:var(--text);
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji';
}
.container{max-width:1200px;margin:0 auto;padding:0 24px}
.pad{padding-top:24px;padding-bottom:64px}

/* Header */
.header{position:sticky;top:0;z-index:10;background:#fff;border-bottom:1px solid #eef2ff}
.header-inner{display:flex;align-items:center;justify-content:space-between;height:72px}
.logo{font-weight:800;cursor:pointer;letter-spacing:0.4px}
.nav{display:flex;gap:28px}
.nav a{color:#111827;text-decoration:none;font-weight:600}
.nav a.active{color:var(--blue)}
.profile-btn{border:none;background:#f3f4f6;width:40px;height:40px;border-radius:999px;cursor:pointer}

/* Hero Search */
.dicas-page .search-hero{display:flex;flex-direction:column;align-items:center;margin-top:32px;margin-bottom:60px}
.hero-title{font-family:'Krona One', sans-serif;font-size:32px;margin:0}
.hero-sub{margin:6px 0 18px 0;color:#475569}
.search-row{display:flex;gap:12px;align-items:center}
.input-wrap{position:relative;width:600px;max-width:70vw}
.input-wrap input{width:100%;height:44px;border:1.5px solid #e5e7eb;border-radius:999px;padding:0 44px 0 16px;font-size:14px}
.search-icon{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:#64748b}
.icon-btn{height:44px;width:44px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;cursor:pointer}
.icon-btn img{width:22px;height:22px;display:block;margin:auto}
.fav-btn{display:flex;align-items:center;gap:8px;border:none;background:var(--mom);color:#fff;height:44px;padding:0 16px;border-radius:999px;cursor:pointer;font-weight:700}
.fav-btn.on{filter:saturate(1.2) brightness(0.95)}
.star{font-size:18px}

/* Category Block */
.category-block{margin-top:60px}
.category-title{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.category-title h2{margin:0;font-size:24px}
.category-emoji{font-size:20px}

/* Tips Grid */
.tips-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.tip-card{border-radius:14px;overflow:hidden;box-shadow:0 6px 22px rgba(16,24,40,.06);background:#fff}
.tip-card .thumb{position:relative;height:180px;overflow:hidden}
.tip-card .thumb img.bg{width:100%;height:100%;object-fit:cover;display:block}
.icon-overlay{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:90px;height:90px;z-index:1;pointer-events:none;filter: drop-shadow(0 4px 16px rgba(0,0,0,.18));}
.badge{position:absolute;left:12px;top:12px;color:#fff;font-weight:700;font-size:12px;padding:6px 10px;border-radius:999px;z-index:2}
.fav{position:absolute;right:10px;top:10px;height:32px;width:32px;border-radius:999px;border:none;background:rgba(255,255,255,.7);backdrop-filter:blur(4px);cursor:pointer;z-index:2}
.fav.on{background:#fff}
.info{padding:16px;color:#fff}
.title-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}
.title-row h4{margin:0;font-size:16px}
.fav-inline{height:28px;min-width:28px;padding:0 8px;border-radius:999px;border:none;background:rgba(255,255,255,.9);cursor:pointer;color:#111827;font-weight:800}
.fav-inline.on{background:#fff}
.info h4{margin:0 0 10px 0}
.chips{display:flex;gap:8px;flex-wrap:wrap}
.chip{background:rgba(255,255,255,.9);color:#111827;border-radius:999px;padding:4px 10px;font-size:12px}

.more-wrap{display:flex;justify-content:center;margin:24px 0 60px}
.more-btn{height:40px;padding:0 22px;border-radius:999px;background:#fff;border:2px solid var(--blue);cursor:pointer;font-weight:700}

/* Page width 1920 (desktop). This layout is responsive, but was tuned for desktop first. */
@media (min-width: 1440px){
  .container{max-width:1200px}
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

