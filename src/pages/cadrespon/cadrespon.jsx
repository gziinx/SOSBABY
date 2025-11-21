import React, { useState, useEffect } from "react";
import {
  Container,
  Fundu,
  FundoContainer,
  TituloSobreImagem,
  VoltarBtn,
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
} from "./style.js";
import { GlobalStyle } from "../../styles/GglobalStyles.js";
import funduImage from "../../assets/cadres.png";

function CadastroRespon() {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cartaoMedico, setCartaoMedico] = useState("");
  const [cep, setCep] = useState("");
  const [segundoResponsavel, setSegundoResponsavel] = useState(false);
  const [arquivoBase64, setArquivoBase64] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [userId, setUserId] = useState(null);

  // Redimensiona e comprime a imagem antes de enviar
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setArquivo(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 500;
        const scaleSize = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const resizedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          setArquivoBase64(resizedBase64);
        }
      };
    };
    reader.readAsDataURL(file);
  };

  // Busca o ID do usuário logado ao carregar o componente
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.id_user) {
          setUserId(user.id_user);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Usuário não autenticado. Por favor, faça login novamente.");
      return;
    }

    if (!arquivoBase64) {
      alert("Selecione uma imagem antes de enviar.");
      return;
    }

    const dados = {
      nome: nome,
      data_nascimento: dataNascimento,
      cpf: cpf,
      telefone: telefone,
      cartao_medico: cartaoMedico,
      cep: cep,
      arquivo: arquivoBase64,
      id_sexo: 1,
      id_user: userId,
    };
    console.log(dados);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Token de autenticação não encontrado. Por favor, faça login novamente.");
        return;
      }

      const response = await fetch(
        "https://backend-sosbaby.onrender.com/v1/sosbaby/resp/cadastro",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(dados),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        console.log(data);
      } else {
        console.error(data);
        alert(data.message || "Erro ao cadastrar.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro no processo de cadastro.");
    }
  };

  return (
    <Container>
      <GlobalStyle />
      <FundoContainer>
  <Fundu src={funduImage} alt="Imagem de fundo" />

  <TituloSobreImagem>Cadastro do Responsável</TituloSobreImagem>

  <VoltarBtn onClick={() => window.location.href = "/"}>
    Voltar para início
  </VoltarBtn>
</FundoContainer>
      <Formm id="cad" onSubmit={handleSubmit}>
        {/* Identificação */}
        <Section>
          <Identificacao icon="❤">RESPONSÁVEL</Identificacao>

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
            <label htmlFor="dataNascimento">Data de Nascimento *</label>
            <Input
              type="date"
              id="dataNascimento"
              value={dataNascimento}
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
            <label htmlFor="cartaoMedico">Cartão SUS/Convênio</label>
            <Input
              type="text"
              id="cartaoMedico"
              value={cartaoMedico}
              onChange={(e) => setCartaoMedico(e.target.value)}
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
              {arquivo ? (
                <span style={{ fontSize: "14px", color: "#708ef1" }}>
                  {arquivo.name}
                </span>
              ) : (
                <span style={{ fontSize: "40px", color: "#d3a6b5" }}>⬆</span>
              )}
            </UploadBox>

            <Input
              type="file"
              id="arquivo"
              accept="image/*"
              hidden
              onChange={handleFileChange}
              required
            />
          </InputGroup>

          <CheckboxItem>
            <Input
              type="checkbox"
              id="segundoResponsavel"
              checked={segundoResponsavel}
              onChange={(e) => setSegundoResponsavel(e.target.checked)}
            />
            <label htmlFor="segundoResponsavel">
              Adicionar segundo responsável
            </label>
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


