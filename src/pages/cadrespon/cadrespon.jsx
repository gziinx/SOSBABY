import React, { useState } from "react";
import {
  Logo,
  LogoImg,
  TituDiv,
  Formm,
  Section,
  Identificacao,
  InputGroup,
  Input,
  Row,
  UploadBox,
  BtnContainer,
  Btn,
  CheckboxItem
} from "./style";
import { CadoisStyle } from "../../styles/GglobalStyles";
import foto from "../../assets/logu.png";

function CadastroBebe() {
  const [nome, setNome] = useState("");
  const [data_nascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cartao_medico, setCartao] = useState("");
  const [cep, setCep] = useState("");
  const [segundoResponsavel, setSegundoResponsavel] = useState(false);
  const [arquivoBase64, setArquivoBase64] = useState(""); // imagem em base64

  // Redimensiona e comprime a imagem antes de enviar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      let img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 500; // largura máxima
        const scaleSize = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Converte para base64 e comprime
        const resizedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setArquivoBase64(resizedBase64);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3030/v1/sosbaby/resp/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          data_nascimento,
          cpf,
          telefone,
          cartao_medico,
          cep,
          segundo_responsavel: segundoResponsavel,
          arquivo: arquivoBase64,
          id_sexo: 1,
          id_user: 1
        }),
      });

      if (response.ok) {
        alert("Cadastro do bebê realizado com sucesso!");
        window.location.href = "/login";
      } else {
        const errorData = await response.json();
        console.error(errorData);
        alert("Erro ao cadastrar bebê.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro no processo de cadastro.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <CadoisStyle />
      <Logo>
        <LogoImg src={foto} alt="Logo" />
      </Logo>

      <TituDiv>DADOS DO RESPONSÁVEL</TituDiv>

      <Formm id="cad" onSubmit={handleSubmit}>
        {/* Identificação */}
        <Section>
          <Identificacao icon="❤">Identificação</Identificacao>
          <InputGroup>
            <label htmlFor="nome">Nome completo *</label>
            <Input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome completo"
              required
            />
          </InputGroup>

          <InputGroup>
            <label htmlFor="data_nascimento">Data de Nascimento *</label>
            <Input
              type="date"
              id="data_nascimento"
              value={data_nascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              required
            />
          </InputGroup>

          <Row>
            <InputGroup>
              <label htmlFor="cpf">CPF</label>
              <Input
                type="text"
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                required
              />
            </InputGroup>

            <InputGroup>
              <label htmlFor="telefone">Telefone</label>
              <Input
                type="text"
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                required
              />
            </InputGroup>
          </Row>
        </Section>

        {/* Documentos */}
        <Section>
          <Identificacao icon="🩺">Documentos</Identificacao>
          <InputGroup>
            <label htmlFor="cartao_medico">Cartão SUS/Convênio</label>
            <Input
              type="text"
              id="cartao_medico"
              value={cartao_medico}
              onChange={(e) => setCartao(e.target.value)}
              placeholder="Escreva"
              required
            />
          </InputGroup>
          <InputGroup>
            <label htmlFor="cep">CEP</label>
            <Input
              type="text"
              id="cep"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              placeholder="00000-000"
              required
            />
          </InputGroup>
        </Section>

        {/* Upload */}
        <Section>
          <Identificacao icon="📤">Upload de Arquivos</Identificacao>
          <InputGroup>
            <UploadBox htmlFor="arquivo">
              <span style={{ fontSize: "40px", color: "#d3a6b5" }}>⬆</span>
            </UploadBox>
            <Input
              type="file"
              id="arquivo"
              accept="image/*"
              hidden
              onChange={handleFileChange} // redimensiona e envia base64
              required
            />
          </InputGroup>
          <CheckboxItem>
            <Input
              type="checkbox"
              id="segundo_responsavel"
              checked={segundoResponsavel}
              onChange={(e) => setSegundoResponsavel(e.target.checked)}
            />
            <label htmlFor="segundo_responsavel">Adicionar segundo responsável</label>
          </CheckboxItem>
        </Section>

        {/* Botão */}
        <BtnContainer>
          <Btn type="submit">PRÓXIMO</Btn>
        </BtnContainer>
      </Formm>
    </div>
  );
}

export default CadastroBebe;
