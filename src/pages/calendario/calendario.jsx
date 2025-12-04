import { useEffect } from "react";
import './calendario.css'
import logo from '../../assets/logoo.png';
import trashIcon from '../../assets/image.png';
import { useNavigate } from "react-router-dom";

export default function Calendarioo() {
  const navigate = useNavigate();  
  useEffect(() => {
    // Inicializa ícones Lucide, se disponíveis globalmente
    try {
      if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
      }
    } catch {}

    // ------------------ Script original adaptado ------------------
    const daysContainer = document.getElementById("days");
    const monthYear = document.getElementById("month-year");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");

    let date = new Date();
    let todosEventos = [];

    async function buscarEventos() {
      try {
        const response = await fetch('https://backend-sosbaby.onrender.com/v1/sosbaby/calenders');
        const data = await response.json();

        if (response.ok && Array.isArray(data.dateCalender)) {
          todosEventos = data.dateCalender;
          marcarDiasComEventos(todosEventos);

          const hoje = new Date().toISOString().split('T')[0];
          const eventosHoje = todosEventos.filter(evento => evento.data_calendario.split('T')[0] === hoje);
          exibirEventosNoCardAzul(eventosHoje, hoje);
        } else {
          console.error('Nenhum evento encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      }
    }

    function renderCalendar(direction) {
      if (!daysContainer || !monthYear) return;

      const year = date.getFullYear();
      const month = date.getMonth();

      const firstDay = new Date(year, month, 1).getDay();
      const lastDate = new Date(year, month + 1, 0).getDate();

      const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ];

      monthYear.textContent = `${months[month]} ${year}`;
      daysContainer.innerHTML = "";

      for (let i = 0; i < firstDay; i++) {
        daysContainer.appendChild(document.createElement("div"));
      }

      for (let day = 1; day <= lastDate; day++) {
        const dayElement = document.createElement("div");
        dayElement.textContent = day;
        dayElement.classList.add("dia");

        const dataCompleta = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayElement.setAttribute("data-data", dataCompleta);

        const dayOfWeek = new Date(year, month, day).getDay();
        const color = (dayOfWeek === 0 || dayOfWeek === 6) ? "#f34a4a" : "#4a6ef5";
        dayElement.style.color = color;

        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
          dayElement.classList.add("today");
        }

        dayElement.addEventListener("mouseenter", () => dayElement.style.filter = "brightness(1.2)");
        dayElement.addEventListener("mouseleave", () => dayElement.style.filter = "brightness(1)");

        daysContainer.appendChild(dayElement);
      }

      marcarDiasComEventos(todosEventos);

      if (direction) {
        daysContainer.classList.add("fade");
        setTimeout(() => daysContainer.classList.remove("fade"), 200);
      }
    }

    function formatarHora(horaUTC) {
      const date = new Date(horaUTC);
      let h = date.getUTCHours();
      let m = date.getUTCMinutes();
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    function formatarData(dataISO) {
      const date = new Date(dataISO);
      const dia = String(date.getUTCDate()).padStart(2, '0');
      const mes = String(date.getUTCMonth() + 1).padStart(2, '0');
      const ano = date.getUTCFullYear();
      return `${dia}/${mes}/${ano}`;
    }

    // Toast simples e não bloqueante
    function showToast(msg, type = 'info') {
      const toast = document.createElement('div');
      toast.textContent = msg;
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.right = '20px';
      toast.style.zIndex = '99999';
      toast.style.padding = '10px 14px';
      toast.style.borderRadius = '8px';
      toast.style.color = '#fff';
      toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
      toast.style.fontSize = '14px';
      toast.style.background = type === 'error' ? '#e74c3c' : '#2ecc71';
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.transition = 'opacity 0.3s ease';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 1500);
    }

    // Função para criar e exibir o modal de detalhes do evento
    function mostrarDetalhesEvento(evento) {
      // Remove o modal existente se houver
      const modalExistente = document.getElementById('evento-modal');
      if (modalExistente) {
        document.body.removeChild(modalExistente);
      }

      // Cria o modal
      const modal = document.createElement('div');
      modal.id = 'evento-modal';
      modal.className = 'evento-modal';
      
      // Formata a data e hora
      const dataFormatada = formatarData(evento.data_calendario + 'T00:00:00Z');
      const horaFormatada = formatarHora(evento.hora_calendario);
      
      // Conteúdo do modal
      modal.innerHTML = `
        <div class="modal-conteudo">
          <div class="modal-cabecalho" style="background-color: ${evento.cor || '#708EF1'};">
            <h3>${evento.titulo || 'Sem título'}</h3>
            <button class="fechar-modal">&times;</button>
          </div>
          <div class="modal-corpo">
            <div class="info-item">
              <span class="info-rotulo">Data:</span>
              <span class="info-valor">${dataFormatada}</span>
            </div>
            <div class="info-item">
              <span class="info-rotulo">Hora:</span>
              <span class="info-valor">${horaFormatada}</span>
            </div>
            ${evento.nota ? `
            <div class="info-item">
              <span class="info-rotulo">Nota:</span>
              <p class="info-nota">${evento.nota}</p>
            </div>` : ''}
            <div class="info-item">
              <span class="info-rotulo">Cor:</span>
              <div class="cor-evento" style="background-color: ${evento.cor || '#708EF1'}"></div>
            </div>
          </div>
        </div>
        <div class="modal-overlay"></div>
      `;

      // Adiciona o modal ao body
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden'; // Impede rolagem do body

      // Adiciona a classe para ativar a animação
      setTimeout(() => {
        modal.classList.add('show');
      }, 10);

      // Fecha o modal ao clicar no botão de fechar ou no overlay
      const btnFechar = modal.querySelector('.fechar-modal');
      const overlay = modal.querySelector('.modal-overlay');
      
      const fecharModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
          if (modal.parentNode) {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
          }
        }, 300); // Tempo da animação de saída
      };

      btnFechar.addEventListener('click', fecharModal);
      overlay.addEventListener('click', fecharModal);

      // Fecha com a tecla ESC
      document.addEventListener('keydown', function fecharComEsc(e) {
        if (e.key === 'Escape') {
          fecharModal();
          document.removeEventListener('keydown', fecharComEsc);
        }
      });
    }

    function exibirEventosNoCardAzul(eventos, dataSelecionada) {
      const container = document.getElementById('eventos-hoje');
      if (!container) return;
      const dataFormatada = formatarData(dataSelecionada + 'T00:00:00Z');

      container.innerHTML = '';

      const tituloCard = document.querySelector('.card-azul h2');
      if (tituloCard) {
        tituloCard.textContent = `Eventos para ${dataFormatada}`;
      }

      if (!Array.isArray(eventos) || eventos.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #0c0c0c;">Sem eventos para esta data 🎉</p>';
        return;
      }

      eventos.sort((a, b) => {
        const dateA = new Date(a.hora_calendario);
        const dateB = new Date(b.hora_calendario);
        const minutosA = dateA.getUTCHours() * 60 + dateA.getUTCMinutes();
        const minutosB = dateB.getUTCHours() * 60 + dateB.getUTCMinutes();
        return minutosA - minutosB;
      });

      eventos.forEach(ev => {
        const card = document.createElement('div');
        card.classList.add('card-branco');
        card.setAttribute('data-expanded', 'false');

        // Formata os dados para exibição
        const dataFormatada = formatarData(ev.data_calendario);
        const horaFormatada = formatarHora(ev.hora_calendario);
        const corEvento = ev.cor || '#708EF1';
        const temAlarme = ev.alarme === 'true' || ev.alarme === true;

        card.innerHTML = `
          <div class="circulo" style="background-color: ${corEvento}"></div>
          <div class="conteudo">
              <div class="cabecalho-evento">
                <h3>${ev.titulo || 'Sem título'}</h3>
                <div class="hora-evento">${horaFormatada}</div>
              </div>
              <div class="data-evento">${dataFormatada}</div>
              <div class="detalhes-expandidos" style="display: none;">
                <div class="info-item">
                  <span class="info-rotulo">Cor:</span>
                  <div class="cor-evento" style="background-color: ${corEvento}"></div>
                </div>
                <div class="info-item">
                  <span class="info-rotulo">Descrição:</span>
                  <p class="info-nota">${ev.descricao || 'Nenhuma descrição fornecida'}</p>
                </div>
                <div class="info-item">
                  <span class="info-rotulo">Alarme:</span>
                  <span class="info-valor">${temAlarme ? 'Ativado' : 'Desativado'}</span>
                </div>
              </div>
          </div>
          <div class="acoes-evento">
            <button class="btn-expandir" aria-label="Mostrar detalhes">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="seta-icone">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div class="lixo" data-id="${ev.id_calendario}" aria-label="Excluir evento">
              <img src="${trashIcon}" alt="Excluir">
            </div>
          </div>`;

        container.appendChild(card);

        // Adiciona evento de clique no botão de expandir/recolher
        const btnExpandir = card.querySelector('.btn-expandir');
        const detalhesExpandidos = card.querySelector('.detalhes-expandidos');
        const setaIcone = card.querySelector('.seta-icone');
        
        if (btnExpandir && detalhesExpandidos) {
          btnExpandir.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o clique se propague para o card
            const isExpanded = card.getAttribute('data-expanded') === 'true';
            
            // Alterna entre mostrar e esconder os detalhes
            if (isExpanded) {
              detalhesExpandidos.style.display = 'none';
              setaIcone.style.transform = 'rotate(0deg)';
              card.setAttribute('data-expanded', 'false');
            } else {
              detalhesExpandidos.style.display = 'block';
              setaIcone.style.transform = 'rotate(180deg)';
              card.setAttribute('data-expanded', 'true');
              
              // Rola suavemente até o card se necessário
              card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          });
        }

        // Adiciona evento de clique na lixeira
        const lixo = card.querySelector('.lixo');
        lixo?.addEventListener('click', async (e) => {
          const id = e.currentTarget.dataset.id;
          if (confirm('Deseja realmente excluir este evento?')) {
            try {
              const response = await fetch(`https://backend-sosbaby.onrender.com/v1/sosbaby/calender/${id}`, { method: 'DELETE' });
              const data = await response.json();

              if (response.ok) {
                showToast('Evento excluído com sucesso!');
                await buscarEventos();
                const dataExcluida = ev.data_calendario.split('T')[0];
                const eventosAtualizados = todosEventos.filter(e => e.data_calendario.split('T')[0] === dataExcluida);
                exibirEventosNoCardAzul(eventosAtualizados, dataExcluida);
                renderCalendar();
                setTimeout(() => { window.location.reload(); }, 600);
              } else {
                showToast('Erro ao excluir evento: ' + (data.message || ''), 'error');
              }
            } catch (error) {
              console.error('Erro ao excluir:', error);
              showToast('Erro interno ao excluir evento', 'error');
            }
          }
        });
      });
    }

    function marcarDiasComEventos(eventos) {
      const diasDoMes = document.querySelectorAll('.dia');
      const tooltipContainer = document.getElementById("tooltip-global-container");
      if (!diasDoMes || !tooltipContainer) return;

      diasDoMes.forEach(dia => {
        const pontoExistente = dia.querySelector('.ponto-evento');
        if (pontoExistente) pontoExistente.remove();
      });

      tooltipContainer.innerHTML = "";

      const eventosPorData = {};
      eventos.forEach(ev => {
        const data = ev.data_calendario.split('T')[0];
        if (!eventosPorData[data]) eventosPorData[data] = [];
        eventosPorData[data].push(ev);
      });

      diasDoMes.forEach(dia => {
        const dataDia = dia.getAttribute('data-data');

        if (eventosPorData[dataDia]) {
          let eventosDoDia = eventosPorData[dataDia];

          eventosDoDia.sort((a, b) => {
            const dateA = new Date(a.hora_calendario);
            const dateB = new Date(b.hora_calendario);
            const minutosA = dateA.getUTCHours() * 60 + dateA.getUTCMinutes();
            const minutosB = dateB.getUTCHours() * 60 + dateB.getUTCMinutes();
            return minutosA - minutosB;
          });

          const ponto = document.createElement('span');
          ponto.classList.add('ponto-evento');
          dia.appendChild(ponto);
          dia.classList.add('has-event');

          dia.addEventListener('click', () => {
            exibirEventosNoCardAzul(eventosDoDia, dataDia);
            document.querySelectorAll('.dia').forEach(d => d.classList.remove('selected-day'));
            dia.classList.add('selected-day');
          });

          const tooltip = document.createElement('div');
          tooltip.classList.add('tooltip');
          tooltip.innerHTML = eventosDoDia.map(ev => {
            const hora = formatarHora(ev.hora_calendario);
            return `<div class="tooltip-evento">
                        <div class="circulo" style="background-color:${ev.cor || '#708EF1'}"></div>
                        <h4 class="titulo-tooltip">${ev.titulo}</h4>
                        <p class="hora-tooltip">${hora}</p>
                    </div>`;
          }).join("");

          tooltipContainer.appendChild(tooltip);

          dia.addEventListener('mouseenter', () => {
            tooltip.style.display = "block";
            const rect = dia.getBoundingClientRect();
            const tooltipTop = rect.top + window.scrollY - tooltip.offsetHeight - 8;
            const tooltipLeft = rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2;
            const screenWidth = document.documentElement.clientWidth;
            const safeLeft = Math.max(10, Math.min(tooltipLeft, screenWidth - tooltip.offsetWidth - 10));

            tooltip.style.top = `${tooltipTop}px`;
            tooltip.style.left = `${safeLeft}px`;

            setTimeout(() => { tooltip.classList.add("show"); }, 10);
          });

          dia.addEventListener('mouseleave', () => {
            tooltip.classList.remove("show");
            setTimeout(() => {
              if (!tooltip.classList.contains("show")) {
                tooltip.style.display = "none";
              }
            }, 200);
          });
        }
      });
    }

    async function listarEventosDoDiaAtual() {
      const hoje = new Date().toISOString().split('T')[0];
      try {
        const response = await fetch('https://backend-sosbaby.onrender.com/v1/sosbaby/calenders');
        const data = await response.json();
        if (response.ok && Array.isArray(data.dateCalender)) {
          const eventosHoje = data.dateCalender.filter(evento => evento.data_calendario.split('T')[0] === hoje);
          exibirEventosNoCardAzul(eventosHoje, hoje);
          marcarDiasComEventos(data.dateCalender);
        } else {
          console.error('Nenhum evento encontrado');
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    }

    const botaoMais = document.querySelector('.botao-mais');
    const modal = document.getElementById('modal');
    const adicionarCor = document.getElementById('adicionar-cor');
    const colorModal = document.getElementById('colorModal');
    const colorPickerInput = document.getElementById('colorPickerInput');
    const confirmColor = document.getElementById('confirmColor');
    const cancelColor = document.getElementById('cancelColor');
    const coresContainer = document.getElementById('cores-container');

    const selectDia = document.querySelector('.grupo select:nth-child(1)');
    const selectMes = document.querySelector('.grupo select:nth-child(2)');
    const selectAno = document.querySelector('.grupo select:nth-child(3)');

    if (selectDia && selectMes && selectAno) {
      for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = String(i).padStart(2, '0');
        option.textContent = i;
        selectDia.appendChild(option);
      }

      const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
      for (let i = 0; i < 12; i++) {
        const option = document.createElement('option');
        option.value = String(i + 1).padStart(2, '0');
        option.textContent = meses[i];
        selectMes.appendChild(option);
      }

      const anoAtual = new Date().getFullYear();
      for (let i = anoAtual; i <= anoAtual + 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectAno.appendChild(option);
      }

      selectDia.value = String(new Date().getDate()).padStart(2, '0');
      selectMes.value = String(new Date().getMonth() + 1).padStart(2, '0');
      selectAno.value = new Date().getFullYear();
    }

    botaoMais?.addEventListener('click', () => {
      if (modal) {
        // Limpa os campos ao abrir o modal
        limparCamposFormulario();
        modal.style.display = 'flex';
      }
    });
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    adicionarCor?.addEventListener('click', () => colorModal && (colorModal.style.display = 'flex'));
    cancelColor?.addEventListener('click', () => colorModal && (colorModal.style.display = 'none'));

    confirmColor?.addEventListener('click', () => {
      if (!coresContainer || !adicionarCor || !colorPickerInput) return;
      const novaCor = document.createElement('div');
      novaCor.classList.add('cor');
      const hex = colorPickerInput.value.toUpperCase();
      novaCor.style.backgroundColor = hex;
      novaCor.dataset.hex = hex;
      coresContainer.insertBefore(novaCor, adicionarCor);
      colorModal && (colorModal.style.display = 'none');
      document.querySelectorAll('.cor').forEach(c => c.classList.remove('selecionada'));
      novaCor.classList.add('selecionada');
    });

    coresContainer?.addEventListener('click', (e) => {
      const target = e.target;
      if (target.classList?.contains('cor')) {
        document.querySelectorAll('.cor').forEach(c => c.classList.remove('selecionada'));
        target.classList.add('selecionada');
      }
    });

    const primeiraCor = document.querySelector('.cor:not(.mais)');
    primeiraCor?.classList.add('selecionada');

    const salvarBtn = document.getElementById('salvar');
    let isSaving = false;
    // Função para limpar os campos do formulário
    function limparCamposFormulario() {
      const horaInput = document.querySelector('.hora-input');
      const tituloInput = document.querySelector('input[placeholder="Escreva o título"]');
      const descricaoInput = document.querySelector('textarea');
      const toggleAlarme = document.getElementById('toggle');
      
      if (horaInput) horaInput.value = '';
      if (tituloInput) tituloInput.value = '';
      if (descricaoInput) descricaoInput.value = '';
      if (toggleAlarme) toggleAlarme.checked = false;
      
      // Define a data atual como padrão
      const hoje = new Date();
      if (selectDia) selectDia.value = String(hoje.getDate()).padStart(2, '0');
      if (selectMes) selectMes.value = String(hoje.getMonth() + 1).padStart(2, '0');
      if (selectAno) selectAno.value = hoje.getFullYear();
      
      // Mantém a primeira cor selecionada
      const primeiraCor = document.querySelector('.cor:not(.mais)');
      if (primeiraCor) {
        document.querySelectorAll('.cor').forEach(c => c.classList.remove('selecionada'));
        primeiraCor.classList.add('selecionada');
      }
    }

    if (salvarBtn) salvarBtn.onclick = async () => {
      if (isSaving) return;
      const horaInput = document.querySelector('.hora-input');
      const tituloInput = document.querySelector('input[placeholder="Escreva o título"]');
      const descricaoInput = document.querySelector('textarea');

      if (!selectDia || !selectMes || !selectAno || !horaInput || !tituloInput || !descricaoInput) return;

      const dia = selectDia.value;
      const mes = selectMes.value;
      const ano = selectAno.value;
      const hora = horaInput.value;
      const titulo = tituloInput.value;
      const descricao = descricaoInput.value;

      let corSelecionadaDiv = document.querySelector('.cor.selecionada');
      let corSelecionada = '';
      if (corSelecionadaDiv) {
        corSelecionada = corSelecionadaDiv.dataset.hex || '';
        if (!corSelecionada) {
          const computed = getComputedStyle(corSelecionadaDiv).backgroundColor;
          const rgb = computed.match(/\d+/g);
          if (rgb) corSelecionada = '#' + rgb.map(x => parseInt(x).toString(16).padStart(2, '0')).join('').toUpperCase();
        }
      }

      const alarmeAtivo = document.getElementById('toggle')?.checked ? 1 : 0;
      const idUser = 1;

      const novoEvento = {
        data_calendario: `${ano}-${mes}-${dia}`,
        hora_calendario: hora.length === 5 ? hora + ':00' : hora,
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        cor: corSelecionada || '#708EF1',
        alarme_ativo: alarmeAtivo,
        id_user: Number(idUser)
      };

      try {
        // bloqueia cliques repetidos imediatamente
        isSaving = true;
        const prevText = salvarBtn.textContent;
        salvarBtn.disabled = true;
        salvarBtn.textContent = 'Salvando...';

        const response = await fetch('https://backend-sosbaby.onrender.com/v1/sosbaby/calender/cadastro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novoEvento)
        });

        const data = await response.json();

        if (response.ok) {
          setTimeout(() => { salvarBtn.textContent = 'Salvo!'; }, 100);
          // Limpa os campos do formulário
          limparCamposFormulario();
          
          // Fecha o modal e atualiza a interface
          if (modal) modal.style.display = 'none';
          await buscarEventos();
          renderCalendar();
          showToast('Evento salvo com sucesso!');
        } else {
          showToast('Erro ao salvar evento: ' + (data.message || ''), 'error');
        }

      } catch (error) {
        console.error('Erro na requisição:', error);
        showToast('Erro interno ao salvar evento', 'error');
      } finally {
        // libera botão
        if (salvarBtn) {
          setTimeout(() => {
            salvarBtn.textContent = 'Salvar';
            salvarBtn.disabled = false;
            isSaving = false;
          }, 800);
        } else {
          isSaving = false;
        }
      }
    };

    // Removido: listeners globais duplicados de exclusão, agora cada card gerencia seu próprio clique

    prevBtn?.addEventListener("click", () => { date.setMonth(date.getMonth() - 1); renderCalendar("prev"); });
    nextBtn?.addEventListener("click", () => { date.setMonth(date.getMonth() + 1); renderCalendar("next"); });

    buscarEventos();
    renderCalendar();

    // Cleanup básico: não remove listeners detalhadamente para brevidade
    return () => {};
    // ------------------ Fim do script adaptado ------------------
  }, []);
  const handlerHome = () => {
    navigate('/home');
  };
  const handlerCalendar = () => {
    navigate('/calendario');
  };
  const handlerConsulta = () => {
    navigate('/consulta');
  };
  const handlerRotina = () => {
    navigate('/rotina');
  };

  return (
    <>
      <header>
        <nav className="nav">
          <div className="nav-left">
            <img src={logo} alt="SOS Baby" className="logu" />
          </div>

          <div className="nav-center">
            <a href="" onClick={handlerHome}>Home</a>
            <a href="" onClick={handlerCalendar}>Calendário</a>
            <a href="" onClick={handlerConsulta} >Consultas</a>
            <a href="" onClick={handlerRotina} >Rotina</a>
          </div>

          <div className="nav-right">
            <i data-lucide="bell" className="icon"></i>
            <i data-lucide="user" className="icon user-icon"></i>
          </div>
        </nav>
      </header>

      <main>
        <div className="card-azul">
          <h2>Hoje</h2>
          <div id="eventos-hoje"></div>
          <button className="botao-mais">+</button>
        </div>

        <div className="modal" id="modal">
          <div className="modal-content">
            <h2>Data e Horário</h2>
            <div className="data-hora">
              <div className="grupo">
                <select><option>DIA</option></select>
                <select><option>MÊS</option></select>
                <select><option>ANO</option></select>
              </div>
              <input type="time" className="hora-input" placeholder="12:00" />
            </div>

            <h2>Cor</h2>
            <div className="cores" id="cores-container">
              <div className="cor laranja"></div>
              <div className="cor ciano"></div>
              <div className="cor roxo"></div>
              <div className="cor vermelho"></div>
              <div className="cor verde"></div>
              <div className="cor mais" id="adicionar-cor">+</div>
            </div>

            <h2>Título</h2>
            <input type="text" placeholder="Escreva o título" />

            <h2>Nota</h2>
            <textarea placeholder="Descreva o evento"></textarea>

            <div className="rodape">
              <div className="alarme">
                <label>Alarme</label>
                <input type="checkbox" id="toggle" defaultChecked />
              </div>
              <button id="salvar">Salvar</button>
            </div>
          </div>
        </div>

        <div className="color-modal" id="colorModal">
          <div className="color-modal-content">
            <h3>Escolha uma cor</h3>
            <input type="color" id="colorPickerInput" defaultValue="#708EF1" />
            <div className="color-buttons">
              <button id="confirmColor">Confirmar</button>
              <button id="cancelColor">Cancelar</button>
            </div>
          </div>
        </div>

        <div id="tooltip-global-container"></div>

        <div className="calendar">
          <div className="ali">
            <button id="prev" className="nav-btn">←</button>
            <h2 id="month-year">Outubro 2025</h2>
            <button id="next" className="nav-btn">→</button>
          </div>

          <div className="weekdays" id="weekdays">
            <div className="weekend">Dom</div>
            <div className="weekday">Seg</div>
            <div className="weekday">Ter</div>
            <div className="weekday">Qua</div>
            <div className="weekday">Qui</div>
            <div className="weekday">Sex</div>
            <div className="weekend">Sáb</div>
          </div>

          <div className="days" id="days"></div>
        </div>
      </main>
    </>
  );
}
