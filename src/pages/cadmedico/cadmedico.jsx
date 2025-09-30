import { Bore, Titu, Linha, Butao, Fundula } from "./style"
import Inputzada from "../../components/inputzada"
import { GlobalStyle, CadStyle } from "../../styles/GglobalStyles"
import footinha from "../../assets/funduu.png"



function CadastroMedico() {

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== confirmSenha) {
      alert("As senhas são diferentes.");
      return;
    }
    }
  return (
    <Bore>
      <CadStyle />
      <Titu>Cadastrar-se</Titu>

      <form onSubmit={handleSubmit}>
      <Inputzada
        type="email"
        placeholder="EMAIL"
        icon="@"
        value=""
        onChange=""
      />

      <Inputzada
        type="password"
        placeholder="SENHA"
        icon="🔒"
        value=""
        onChange=""
      />

      <Inputzada
        type="password"
        placeholder="CONFIRMAR"
        icon="🔒"
        value=""
        onChange=""
      />
      <Inputzada
        type="number"
        placeholder="TELEFONE"
        icon="📞"
        value=""
        onChange=""
      />
      <Inputzada
        type="password"
        placeholder="CRM"
        icon="🍆"
        value=""
        onChange=""
      />
      <Inputzada
        type="date"
        placeholder="DATA DE NASCIMENTO"
        icon="📠"
        value=""
        onChange=""
      />
      <Linha />
      <Butao type="submit">CADASTRAR</Butao>
      <Fundula src={footinha} alt="" />
      </form>
    </Bore>
  )
}
export default CadastroMedico
