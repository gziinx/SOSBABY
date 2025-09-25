import { useState } from "react";
import { Bore, Titu, Linha, Butao, Fundula } from "./style";
import Inputzada from "../../components/inputzada";
import { CadStyle } from "../../styles/GglobalStyles";
import footinha from "../../assets/funduu.png";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3030/v1/sosbaby/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          senha: senha,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Login realizado com sucesso!");
        console.log("Dados recebidos:", data);

        // salvar usuário no localStorage
        localStorage.setItem("usuario", JSON.stringify(data));

        // redireciona para home
        window.location.href = "/";
      } else {
        const errorData = await response.json();
        console.error(errorData);
        alert("Erro ao fazer login.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro no processo de login.");
    }
  };

  return (
    <Bore>
      <CadStyle />
      <Titu>Login</Titu>

      <form onSubmit={handleSubmit}>
        <Inputzada
          type="email"
          placeholder="EMAIL"
          icon="@"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Inputzada
          type="password"
          placeholder="SENHA"
          icon="🔒"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <Linha />
        <Butao type="submit">ENTRAR</Butao>
        <Fundula src={footinha} alt="" />
      </form>
    </Bore>
  )
}

export default Login
