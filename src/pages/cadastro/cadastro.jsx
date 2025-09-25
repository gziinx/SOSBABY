import { Bore, Titu, Linha, Butao, Fundula } from "./style"
import Inputzada from "../../components/inputzada"
import { GlobalStyle, CadStyle } from "../../styles/GglobalStyles"
import footinha from "../../assets/funduu.png"
import { useState } from "react";



function Cadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== confirmSenha) {
      alert("As senhas são diferentes.");
      return;
    }

    try {
      const userResponse = await fetch("http://localhost:3030/v1/sosbaby/user/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          senha: senha,
          id_tipo: 1,
        }),
      });

      if (userResponse.ok) {
        alert("Usuário cadastrado com sucesso!");
        // redireciona para login (React Router)
        window.location.href = "/login";
      } else {
        const errorData = await userResponse.json();
        console.error(errorData);
        alert("Erro ao cadastrar usuário.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro no processo de cadastro.");
    }
  };
  return (
    <Bore>
      <CadStyle />
      <Titu>Cadastrar-se</Titu>

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

      <Inputzada
        type="password"
        placeholder="CONFIRMAR"
        icon="🔒"
        value={confirmSenha}
        onChange={(e) => setConfirmSenha(e.target.value)}
      />
      <Linha />
      <Butao type="submit">CADASTRAR</Butao>
      <Fundula src={footinha} alt="" />
      </form>
    </Bore>
  )
}
export default Cadastro
