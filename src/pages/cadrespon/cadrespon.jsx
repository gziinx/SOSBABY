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
  CheckboxItem,
  Fundu,
  Container
} from "./style";
import { CadoisStyle } from "../../styles/GglobalStyles";
import fundu from "../../assets/cadres.png";

function CadastroRespon() {
  const [nome, setNome] = useState("");
  const [data_nascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cartao_medico, setCartao] = useState("");
  const [cep, setCep] = useState("");
  const [segundoResponsavel, setSegundoResponsavel] = useState(false);
  const [arquivoBase64, setArquivoBase64] = useState(""); 
  const [arquivo, setArquivo] = useState(null);
  // Redimensiona e comprime a imagem antes de enviar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setArquivo(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      let img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 500; 
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
  
    // Garante que o usuário selecionou uma imagem
    if (!arquivoBase64) {
      alert("Selecione uma imagem antes de enviar.");
      return;
    }
  
    const dados = {
      nome: nome,
      data_nascimento: data_nascimento,
      cpf: cpf,
      telefone: telefone,
      cartao_medico: cartao_medico, // 👈 nome certo
      cep: cep,
      arquivo: arquivo.name,       // 👈 base64 da imagem
      id_sexo: 1,
      id_user: 1
    };
  
    try {
      const response = await fetch("http://localhost:3030/v1/sosbaby/resp/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Cadastro do bebê realizado com sucesso!");
        console.log(data);
      } else {
        console.error(data);
        alert(data.message || "Erro ao cadastrar bebê.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro no processo de cadastro.");
    }
  };
  
  

  return (
    <Container>
      <CadoisStyle />
      <Fundu src={fundu} alt="" />
      <Formm id="cad" onSubmit={handleSubmit}>
        {/* Identificação */}
        <Section>
          <Identificacao icon="❤">RESPONSAVEL</Identificacao>
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
    </Container>
  );
}

export default CadastroRespon;
