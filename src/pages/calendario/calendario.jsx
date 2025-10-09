import { useEffect, useState } from "react";
import {
  Container,
  Lateral,
  Titulo,
  ListaEventos,
  CardEvento,
  Circulo,
  Form,
  Input,
  BotaoAdd,
  CalendarioWrapper,
  Cabecalho,
  Tabela,
  Dia,
  Wrapper
} from "./style";
import Cima from "../../components/header/header";
import { CalendarioGlobal } from "../../styles/GglobalStyles";

export default function Calendario() {
  const [eventos, setEventos] = useState([]);
  const [novoEvento, setNovoEvento] = useState({ titulo: "", data: "", hora: "" });
  const [mesAtual, setMesAtual] = useState(new Date());

  // GET — busca eventos
  useEffect(() => {
    async function buscarEventos() {
      const resposta = await fetch("https://sua-api.com/eventos");
      const dados = await resposta.json();
      setEventos(dados);
    }
    buscarEventos();
  }, []);

  // POST — adiciona evento
  async function adicionarEvento(e) {
    e.preventDefault();

    const resposta = await fetch("https://sua-api.com/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoEvento),
    });

    if (resposta.ok) {
      const criado = await resposta.json();
      setEventos([...eventos, criado]);
      setNovoEvento({ titulo: "", data: "", hora: "" });
    }
  }

  // Funções de calendário
  const ano = mesAtual.getFullYear();
  const mes = mesAtual.getMonth();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  function mudarMes(delta) {
    const novoMes = new Date(ano, mes + delta, 1);
    setMesAtual(novoMes);
  }

  function temEvento(dia) {
    const data = new Date(ano, mes, dia).toISOString().split("T")[0];
    return eventos.some((ev) => ev.data === data);
  }

  return (
    <>
    <CalendarioGlobal />
    <Cima/>
    <Wrapper>
    <Container>
      {/* Lado esquerdo */}
      
      <Lateral>
        <Titulo>Hoje</Titulo>

        <ListaEventos>
          {eventos.length === 0 ? (
            <p>Nenhum evento ainda.</p>
          ) : (
            eventos.map((e, i) => (
              <CardEvento key={i}>
                <Circulo cor={["#F59E0B", "#14B8A6", "#9333EA", "#10B981"][i % 4]} />
                <div>
                  <h3>{e.titulo}</h3>
                  <p>{e.data} - {e.hora}</p>
                </div>
              </CardEvento>
            ))
          )}
        </ListaEventos>

        <Form onSubmit={adicionarEvento}>
          <Input
            placeholder="Título"
            value={novoEvento.titulo}
            onChange={(e) => setNovoEvento({ ...novoEvento, titulo: e.target.value })}
          />
          <Input
            type="date"
            value={novoEvento.data}
            onChange={(e) => setNovoEvento({ ...novoEvento, data: e.target.value })}
          />
          <Input
            type="time"
            value={novoEvento.hora}
            onChange={(e) => setNovoEvento({ ...novoEvento, hora: e.target.value })}
          />
          <BotaoAdd type="submit">+</BotaoAdd>
        </Form>
      </Lateral>

      {/* Lado direito */}
      <CalendarioWrapper>
        <Cabecalho>
          <button onClick={() => mudarMes(-1)}>←</button>
          <h2>{nomesMeses[mes]} {ano}</h2>
          <button onClick={() => mudarMes(1)}>→</button>
        </Cabecalho>

        <Tabela>
          <thead>
            <tr>
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <th key={d}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(Math.ceil((diasNoMes + primeiroDiaSemana) / 7))].map((_, i) => (
              <tr key={i}>
                {[...Array(7)].map((_, j) => {
                  const dia = i * 7 + j - primeiroDiaSemana + 1;
                  return (
                    <Dia
                      key={j}
                      ativo={dia > 0 && dia <= diasNoMes}
                      temEvento={dia > 0 && temEvento(dia)}
                    >
                      {dia > 0 && dia <= diasNoMes ? dia : ""}
                    </Dia>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Tabela>
      </CalendarioWrapper>
    </Container>
    </Wrapper>
    </>
  );
}
