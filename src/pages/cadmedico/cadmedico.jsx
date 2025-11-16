import { Bore, Titu, Linha, Butao, Fundula, Container, FormWrapper, FundoContainer, Fundu, TituloSobreImagem, VoltarBtn } from "./style";
import Inputzada from "../../components/inputzada";
import { CadoisStyle } from "../../styles/GglobalStyles";
import footinha from "../../assets/CADMED.png";


function CadastroMedico() {

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <Container>
      <CadoisStyle />

      {/* LADO ESQUERDO – FORMULÁRIO */}
      <FormWrapper>
        <Bore>
          <Titu>Medico</Titu>

          <form onSubmit={handleSubmit}>
            <Inputzada
              type="text"
              placeholder="Nome completo *"
              icon="👤"
              value=""
              onChange=""
            />

            <Inputzada
              type="email"
              placeholder="E-mail"
              icon="@"
              value=""
              onChange=""
            />

            <Inputzada
              type="password"
              placeholder="Senha"
              icon="🔒"
              value=""
              onChange=""
            />
            <Inputzada
              type="text"
              placeholder="CPF"
              icon="�"
              value=""
              onChange=""
            />
            <Inputzada
              type="text"
              placeholder="CRM"
              icon="�"
              value=""
              onChange=""
            />
            <Inputzada
              type="text"
              placeholder="Telefone"
              icon="📞"
              value=""
              onChange=""
            />
            <Inputzada
              type="text"
              placeholder="Sexo"
              icon="⚧"
              value=""
              onChange=""
            />
            <Linha />
            <Butao type="submit">SALVAR</Butao>
          </form>
        </Bore>
      </FormWrapper>

      {/* LADO DIREITO – IMAGEM */}
      <FundoContainer>
        <Fundu src={footinha} alt="Cadastro do médico" />

        <TituloSobreImagem>Cadastro do Medico</TituloSobreImagem>

        <VoltarBtn onClick={() => (window.location.href = "/")}>
          Voltar ao início
        </VoltarBtn>
      </FundoContainer>
    </Container>
  );
}
export default CadastroMedico
