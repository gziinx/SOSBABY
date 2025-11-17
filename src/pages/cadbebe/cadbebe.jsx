import React, { useState, useEffect } from "react";

import {
    Container,
    FormWrapper,
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
    FundoContainer,
    Fundu,
    TituloSobreImagem,
    VoltarBtn
} from "./style";
import { CadoisStyle } from "../../styles/GglobalStyles";
import foto from "../../assets/cadres.png";
function CadastroBebe() {
    const [nome, setNome] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [sexo, setSexo] = useState("");
    const [nacionalidade, setNacionalidade] = useState("");
    const [peso, setPeso] = useState("");
    const [altura, setAltura] = useState("");
    const [tipoSanguineo, setTipoSanguineo] = useState("");
    const [certidao_nascimento, setCertidaoNascimento] = useState("");
    const [cpf, setCpf] = useState("");
    const [cartao_medico, setCartaoMedico] = useState("");
    const [arquivo, setArquivo] = useState(null);
    const [arquivoBase64, setArquivoBase64] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setArquivo(file);
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const maxWidth = 500;
                const scaleSize = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scaleSize;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const resizedBase64 = canvas.toDataURL("image/jpeg", 0.7);
                setArquivoBase64(resizedBase64);
            };
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!arquivoBase64) {
          alert("Selecione uma imagem antes de enviar.");
          return;
        }
      
        const dados = {
          nome: nome,
          data_nascimento: dataNascimento,
          peso: parseFloat(peso),
          altura: parseInt(altura),
          certidao_nascimento: certidao_nascimento,
          cpf: cpf,
          cartao_medico: cartao_medico,
          imagem_certidao: arquivo.name,
          id_sexo: 1,
          id_sangue: 1
        };
      
        try {
          const response = await fetch("http://localhost:3030/v1/sosbaby/baby/cadastro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
          });
      
          let data;
          try {
            data = await response.json();
          } catch {
            data = null;
          }
      
          if (response.ok) {
            alert("Cadastro do bebê realizado com sucesso!");
            console.log(data);
          } else {
            console.error(data);
            alert(data?.message || "Erro ao cadastrar bebê.");
          }
        } catch (error) {
          console.error(error);
          alert("Erro no processo de cadastro.");
        }
      };

    return (
    <Container>
        <CadoisStyle />

        {/* LADO ESQUERDO – FORMULÁRIO */}
        <FormWrapper>

            <Formm onSubmit={handleSubmit}>

                {/* Identificação */}
                <Section>
                    <Identificacao icon="❤">Identificação</Identificacao>

                    <InputGroup>
                        <label>Nome completo *</label>
                        <Input
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Digite o nome completo"
                            required
                        />
                    </InputGroup>

                    <Row>
                        <InputGroup>
                            <label>Data de Nascimento *</label>
                            <Input
                                type="date"
                                value={dataNascimento}
                                onChange={(e) => setDataNascimento(e.target.value)}
                                required
                            />
                        </InputGroup>

                        <InputGroup>
                            <label>Sexo *</label>
                            <Input
                                value={sexo}
                                onChange={(e) => setSexo(e.target.value)}
                                placeholder="Ex: Masculino ou Feminino"
                                required
                            />
                        </InputGroup>
                    </Row>

                    <InputGroup>
                        <label>Nacionalidade *</label>
                        <Input
                            value={nacionalidade}
                            onChange={(e) => setNacionalidade(e.target.value)}
                            placeholder="Ex: Brasileiro"
                            required
                        />
                    </InputGroup>
                </Section>

                {/* Saúde ao Nascer */}
                <Section>
                    <Identificacao icon="🩺">Saúde ao Nascer</Identificacao>

                    <Row>
                        <InputGroup>
                            <label>Peso *</label>
                            <Input
                                value={peso}
                                onChange={(e) => setPeso(e.target.value)}
                                placeholder="Ex: 3.2"
                                required
                            />
                        </InputGroup>

                        <InputGroup>
                            <label>Altura (cm) *</label>
                            <Input
                                value={altura}
                                onChange={(e) => setAltura(e.target.value)}
                                placeholder="Ex: 50"
                                required
                            />
                        </InputGroup>
                    </Row>

                    <InputGroup>
                        <label>Tipo sanguíneo *</label>
                        <Input
                            value={tipoSanguineo}
                            onChange={(e) => setTipoSanguineo(e.target.value)}
                            placeholder="Ex: O+, A-, B+, AB+..."
                            required
                        />
                    </InputGroup>
                </Section>

                {/* Documentos */}
                <Section>
                    <Identificacao icon="📄">Documentos</Identificacao>

                    <InputGroup>
                        <label>Certidão de Nascimento</label>
                        <Input
                            value={certidao_nascimento}
                            onChange={(e) => setCertidaoNascimento(e.target.value)}
                            placeholder="Número da certidão"
                        />
                    </InputGroup>

                    <InputGroup>
                        <label>CPF</label>
                        <Input
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            placeholder="000.000.000-00 (opcional)"
                        />
                    </InputGroup>

                    <InputGroup>
                        <label>Cartão SUS/Convênio</label>
                        <Input
                            value={cartao_medico}
                            onChange={(e) => setCartaoMedico(e.target.value)}
                            placeholder="Escreva"
                        />
                    </InputGroup>
                </Section>

                {/* Upload */}
                <Section>
                    <Identificacao icon="📤">Upload de Arquivos</Identificacao>
                    <UploadBox htmlFor="arquivo">
                        {arquivo ? (
                            <span style={{ fontSize: "14px", color: "#708ef1" }}>
                                {arquivo.name}
                            </span>
                        ) : (
                            <span style={{ fontSize: "40px", color: "#d3a6b5" }}>⬆</span>
                        )}
                    </UploadBox>
                    <Input type="file" id="arquivo" accept="image/*" hidden onChange={handleFileChange} />
                </Section>

                {/* Botão */}
                <BtnContainer>
                    <Btn type="submit">PRÓXIMO</Btn>
                </BtnContainer>

            </Formm>
        </FormWrapper>

        {/* LADO DIREITO – IMAGEM */}
        <FundoContainer>
            <Fundu
                src={foto}
                alt="Imagem Bebê"
            />

            <TituloSobreImagem>Cadastro do Bebê</TituloSobreImagem>

            <VoltarBtn onClick={() => (window.location.href = "/")}>
                Voltar ao início
            </VoltarBtn>
        </FundoContainer>

    </Container>
);


}

export default CadastroBebe;
