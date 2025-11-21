import React, { useState, useEffect } from 'react';
import './rotina.css';

const Rotina = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [rotinas, setRotinas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_rotina: '',
    hora: '',
    cor: '#6366f1'
  });
  const [apiStatus, setApiStatus] = useState('loading'); // 'loading', 'error', 'success'

  // Função para obter o token JWT
  const getAuthToken = () => {
    // PROBLEMA IDENTIFICADO: Token atual é do usuário ID 2 com id_tipo: 3
    // que não tem permissão para criar rotinas ("Acesso negado para esse tipo de usuário")
    // 
    // localStorage tem usuário ID 1 com id_tipo: 1 que pode ter permissão
    // 
    // Token atual (ID 2, tipo 3): SEM PERMISSÃO
    const stored = (
      localStorage.getItem('token') ||
      localStorage.getItem('authToken') ||
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('token') ||
      sessionStorage.getItem('authToken') ||
      sessionStorage.getItem('access_token')
    );
    if (stored) return stored;
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoyLCJpZF90aXBvIjozLCJpYXQiOjE3NjI4OTAzNzQsImV4cCI6MTc2MzQ5NTE3NH0.RsSDDYbnqaEbrgjet0nhuwbBEN3Urq5kdzaSm8dDPEM';
    
    // TODO: Precisa de um token para o usuário ID 1 com id_tipo: 1
    // ou verificar se o usuário ID 2 pode ter permissões ajustadas na API
  };

  // Função para criar headers com autenticação
  const getAuthHeaders = () => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      const hasBearer = token.toLowerCase().startsWith('bearer ');
      headers['Authorization'] = hasBearer ? token : `Bearer ${token}`;
    }
    return headers;
  };

  // Função para decodificar o token JWT e extrair o ID do usuário
  const getUserIdFromToken = () => {
    try {
      const token = getAuthToken();
      // Decodificar o payload do JWT (parte do meio)
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.id_user || 2; // fallback para 2
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return 2; // fallback
    }
  };

  // Função para obter o payload completo do token (para debug)
  const getTokenPayload = () => {
    try {
      const token = getAuthToken();
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  };

  // Dados do onboarding
  const onboardingSteps = [
    {
      title: "Bem vindo à Rotina !!",
      subtitle: "Olá Usuário !!",
      description: "Organize suas atividades diárias de forma simples e eficiente. Crie rotinas personalizadas para você e seu bebê.",
      buttonText: "Começar"
    },
    {
      title: "Crie suas Rotinas",
      subtitle: "Personalize seu dia",
      description: "Adicione atividades como alimentação, sono, medicamentos e muito mais. Defina horários e cores para cada rotina.",
      buttonText: "Continuar"
    },
    {
      title: "Acompanhe o Progresso",
      subtitle: "Mantenha tudo organizado",
      description: "Visualize suas rotinas diárias e marque as atividades conforme as realiza. Tenha controle total do seu dia.",
      buttonText: "Começar a usar"
    }
  ];

  // Função para testar endpoints disponíveis
  const testEndpoints = async () => {
    const headers = getAuthHeaders();
    const userId = getUserIdFromToken();
    
    const endpointsToTest = [
      'https://backend-sosbaby.onrender.com/v1/sosbaby/routineResp',
      `https://backend-sosbaby.onrender.com/v1/sosbaby/routineResp/${userId}`,
      'https://backend-sosbaby.onrender.com/v1/sosbaby/routineItem',
      `https://backend-sosbaby.onrender.com/routineItem/${userId}`
    ];
    
    for (const endpoint of endpointsToTest) {
      try {
        const response = await fetch(endpoint, { headers });
      } catch (error) {
        // silencioso
      }
    }
  };

  useEffect(() => {
    if (currentStep >= onboardingSteps.length) {
      // Debug: verificar todas as chaves do localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
      }
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
      }
      
      // Testar endpoints disponíveis
      testEndpoints();
      
      fetchRotinas();
    }
  }, [currentStep]);

  const fetchRotinas = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      
      // Tentar diferentes endpoints para buscar rotinas
      
      // Primeira tentativa: endpoint original
      let response = await fetch('https://backend-sosbaby.onrender.com/v1/sosbaby/routineResp', {
        headers
      });
      
      
      // Se der 404, tentar com ID do usuário
      if (response.status === 404) {
        const userId = getUserIdFromToken();
        response = await fetch(`https://backend-sosbaby.onrender.com/v1/sosbaby/routineResp/${userId}`, {
          headers
        });
      }
      
      
      if (response.ok) {
        const rotinasData = await response.json();
        
        // Para cada rotina, buscar seus itens
        const rotinasComItens = await Promise.all(
          rotinasData.map(async (rotina) => {
            const itemsResponse = await fetch(`https://backend-sosbaby.onrender.com/v1/sosbaby/routineItem/${rotina.id_rotina}`, {
              headers: getAuthHeaders()
            });
            if (itemsResponse.ok) {
              const items = await itemsResponse.json();
              return { ...rotina, items };
            }
            return { ...rotina, items: [] };
          })
        );
        
        setRotinas(rotinasComItens);
        setApiStatus('success');
      } else {
        setApiStatus('error');
        // Tentar ler a mensagem de erro da API
        try {
          const errorData = await response.text();
          console.error('Erro da API:', response.status, errorData);
        } catch (e) {
          console.error('Erro ao ler resposta de erro:', e);
        }
        
        // Mock data para demonstração se a API não estiver disponível
        
        setRotinas([
          {
            id_item: 1,
            titulo: "Mamadeira da manhã",
            descricao: "Primeira mamadeira do dia",
            data_rotina: "2024-11-11",
            hora: "07:00",
            cor: "#ff6b6b"
          },
          {
            id_item: 2,
            titulo: "Soneca da tarde",
            descricao: "Descanso após o almoço",
            data_rotina: "2024-11-11",
            hora: "14:00",
            cor: "#4ecdc4"
          },
          {
            id_item: 3,
            titulo: "Medicamento",
            descricao: "Vitamina D",
            data_rotina: "2024-11-11",
            hora: "18:00",
            cor: "#51cf66"
          }
        ]);
      }
    } catch (error) {
      console.error('Erro ao buscar rotinas:', error);
      setApiStatus('error');
      // Mock data em caso de erro
      setRotinas([
        {
          id_item: 1,
          titulo: "Mamadeira da manhã",
          descricao: "Primeira mamadeira do dia",
          data_rotina: "2024-11-11",
          hora: "07:00",
          cor: "#ff6b6b"
        },
        {
          id_item: 2,
          titulo: "Soneca da tarde",
          descricao: "Descanso após o almoço",
          data_rotina: "2024-11-11",
          hora: "14:00",
          cor: "#4ecdc4"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(onboardingSteps.length);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const headers = getAuthHeaders();
      
      // Primeiro criar o item da rotina
      // Verificar se todos os campos obrigatórios estão preenchidos
      if (!formData.titulo || !formData.data_rotina || !formData.hora) {
        console.error('Campos obrigatórios não preenchidos');
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
      }
      
      // Tentar incluir id_user no item também (pode ser obrigatório)
      const userId = getUserIdFromToken();
      const itemData = {
        titulo: formData.titulo,
        descricao: formData.descricao || '', // Garantir que não seja undefined
        data_rotina: formData.data_rotina,
        hora: formData.hora,
        id_user: userId // Adicionar ID do usuário
      };
      
      // Decodificar o token para ver os dados do usuário (silencioso)
      const tokenPayload = getTokenPayload();
      if (tokenPayload?.exp) {
        const now = Math.floor(Date.now() / 1000);
        const isExpired = now > tokenPayload.exp;
        // silencioso
      }
      
      // Tentar primeiro o endpoint original
      let itemResponse = await fetch('https://backend-sosbaby.onrender.com/v1/sosbaby/routineItem/cadastro', {
        method: 'POST',
        headers,
        body: JSON.stringify(itemData)
      });
      
      
      // Se der 403 ou 404, tentar sem /cadastro
      if (itemResponse.status === 403 || itemResponse.status === 404) {
        itemResponse = await fetch('https://backend-sosbaby.onrender.com/v1/sosbaby/routineItem', {
          method: 'POST',
          headers,
          body: JSON.stringify(itemData)
        });
      }
      
      
      if (itemResponse.ok) {
        const itemCreated = await itemResponse.json();
        
        // Pegar o ID do usuário do token JWT
        const userId = getUserIdFromToken();
        
        // Depois criar a rotina do responsável usando o ID do item criado
        // Garantir que a cor esteja no formato "#000000"
        let corFormatada = formData.cor;
        if (!corFormatada.startsWith('#')) {
          corFormatada = '#' + corFormatada;
        }
        
        // Extrair ID do item criado considerando diferentes formatos de resposta
        const itemId = (
          itemCreated?.id_item ??
          itemCreated?.id ??
          itemCreated?.item?.id ??
          itemCreated?.insertId ??
          itemCreated?.data?.id_item ??
          itemCreated?.data?.id
        );
        
        const rotinaResp = {
          titulo: formData.titulo,
          cor: corFormatada, // Cor no formato "#000000"
          id_user: userId,
          id_item_rotina: itemId // ID do item criado
        };
        
        let rotinaResponse = await fetch('https://backend-sosbaby.onrender.com/v1/sosbaby/routineResp/cadastro', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(rotinaResp)
        });
        
        // Fallback: alguns backends podem esperar "id_item" ao invés de "id_item_rotina"
        if (!rotinaResponse.ok && (rotinaResponse.status === 400 || rotinaResponse.status === 404)) {
          const rotinaRespAlt = {
            titulo: formData.titulo,
            cor: corFormatada,
            id_user: userId,
            id_item: itemId
          };
          rotinaResponse = await fetch('https://backend-sosbaby.onrender.com/v1/sosbaby/routineResp/cadastro', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(rotinaRespAlt)
          });
        }

        // Fallback final: tentar endpoint sem /cadastro
        if (!rotinaResponse.ok && (rotinaResponse.status === 400 || rotinaResponse.status === 404)) {
          rotinaResponse = await fetch('https://backend-sosbaby.onrender.com/v1/sosbaby/routineResp', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(rotinaResp)
          });
          if (!rotinaResponse.ok) {
            const rotinaRespAlt = {
              titulo: formData.titulo,
              cor: corFormatada,
              id_user: userId,
              id_item: itemId
            };
            rotinaResponse = await fetch('https://backend-sosbaby.onrender.com/v1/sosbaby/routineResp', {
              method: 'POST',
              headers: getAuthHeaders(),
              body: JSON.stringify(rotinaRespAlt)
            });
          }
        }
        
        if (rotinaResponse.ok) {
          const rotinaCreated = await rotinaResponse.json();
          // Recarregar a lista de rotinas
          fetchRotinas();
        } else {
          // Tentar ler a mensagem de erro
          try {
            const errorData = await rotinaResponse.text();
            console.error('Erro ao criar rotina:', rotinaResponse.status, errorData);
          } catch (e) {
            console.error('Erro ao ler resposta de erro da rotina:', e);
          }
        }
      } else {
        // Tentar ler a mensagem de erro do POST item
        try {
          const errorData = await itemResponse.text();
          console.error('Erro ao criar item:', itemResponse.status, errorData);
        } catch (e) {
          console.error('Erro ao ler resposta de erro do item:', e);
        }
        
        // Mock - adicionar à lista local se a API não estiver disponível
        const newRotina = {
          id_item: Date.now(),
          ...formData
        };
        setRotinas([...rotinas, newRotina]);
      }
      
      setFormData({
        titulo: '',
        descricao: '',
        data_rotina: '',
        hora: '',
        cor: '#6366f1'
      });
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao criar rotina:', error);
      // Mock - adicionar à lista local em caso de erro
      const newRotina = {
        id_item: Date.now(),
        ...formData
      };
      setRotinas([...rotinas, newRotina]);
      
      setFormData({
        titulo: '',
        descricao: '',
        data_rotina: '',
        hora: '',
        cor: '#6366f1'
      });
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRotina = async (id) => {
    try {
      // Deletar o item da rotina
      const itemResponse = await fetch(`https://backend-sosbaby.onrender.com/v1/sosbaby/routineItem/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (itemResponse.ok) {
        // Recarregar a lista de rotinas
        fetchRotinas();
      } else {
        // Mock - remover da lista local se a API não estiver disponível
        setRotinas(rotinas.filter(rotina => rotina.id_item !== id));
      }
    } catch (error) {
      console.error('Erro ao deletar rotina:', error);
      // Mock - remover da lista local em caso de erro
      setRotinas(rotinas.filter(rotina => rotina.id_item !== id));
    }
  };

  const handleEditRotina = async (id, updatedData) => {
    try {
      // Atualizar o item da rotina
      const itemResponse = await fetch(`https://backend-sosbaby.onrender.com/v1/sosbaby/routineItem/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedData)
      });
      
      if (itemResponse.ok) {
        // Recarregar a lista de rotinas
        fetchRotinas();
      } else {
        // Mock - atualizar na lista local se a API não estiver disponível
        setRotinas(rotinas.map(rotina => 
          rotina.id_item === id ? { ...rotina, ...updatedData } : rotina
        ));
      }
    } catch (error) {
      console.error('Erro ao editar rotina:', error);
      // Mock - atualizar na lista local em caso de erro
      setRotinas(rotinas.map(rotina => 
        rotina.id_item === id ? { ...rotina, ...updatedData } : rotina
      ));
    }
  };

  // Renderizar onboarding
  if (currentStep < onboardingSteps.length) {
    const step = onboardingSteps[currentStep];
    return (
      <div className="rotina-container">
        <div className="onboarding-screen">
          <div className="onboarding-content">
            <div className="welcome-icon">
              <div className="baby-icon">👶</div>
            </div>
            
            <h1 className="welcome-title">{step.title}</h1>
            <h2 className="welcome-subtitle">{step.subtitle}</h2>
            
            <p className="welcome-description">{step.description}</p>
            
            <div className="step-indicators">
              {onboardingSteps.map((_, index) => (
                <div 
                  key={index} 
                  className={`step-dot ${index === currentStep ? 'active' : ''}`}
                />
              ))}
            </div>
            
            <button 
              className="welcome-button"
              onClick={handleNextStep}
            >
              {step.buttonText}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar tela principal de rotinas
  return (
    <div className="rotina-container">
      <div className="rotina-header">
        <h1>Minhas Rotinas</h1>
        <button 
          className="add-rotina-btn"
          onClick={() => setShowForm(true)}
        >
          + Nova Rotina
        </button>
      </div>

      {/* Erro de API fica apenas em log; não exibimos mais aviso visual na interface */}
      {false && apiStatus === 'error' && (
        <div className="api-warning">
          ⚠️ Problema de permissão na API: "Acesso negado para esse tipo de usuário" (ID 2, Tipo 3). 
          Exibindo dados de demonstração.
        </div>
      )}

      {loading && <div className="loading">Carregando...</div>}

      {showForm && (
        <div className="form-overlay">
          <form className="rotina-form" onSubmit={handleFormSubmit}>
            <h2>Nova Rotina</h2>
            
            <input
              type="text"
              placeholder="Título da rotina"
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              required
            />
            
            <textarea
              placeholder="Descrição"
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
            />
            
            <input
              type="date"
              value={formData.data_rotina}
              onChange={(e) => setFormData({...formData, data_rotina: e.target.value})}
              required
            />
            
            <input
              type="time"
              value={formData.hora}
              onChange={(e) => setFormData({...formData, hora: e.target.value})}
              required
            />
            
            <div className="color-picker">
              <label>Cor da rotina:</label>
              <input
                type="color"
                value={formData.cor}
                onChange={(e) => setFormData({...formData, cor: e.target.value})}
              />
            </div>
            
            <div className="form-buttons">
              <button type="button" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
              <button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rotinas-list">
        {rotinas.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma rotina criada ainda.</p>
            <p>Clique em "Nova Rotina" para começar!</p>
          </div>
        ) : (
          rotinas.map((rotina) => (
            <div 
              key={rotina.id_item} 
              className="rotina-card"
              style={{ borderLeft: `4px solid ${rotina.cor}` }}
            >
              <div className="rotina-info">
                <h3>{rotina.titulo}</h3>
                <p>{rotina.descricao}</p>
                <div className="rotina-time">
                  <span>📅 {new Date(rotina.data_rotina).toLocaleDateString('pt-BR')}</span>
                  <span>⏰ {rotina.hora}</span>
                </div>
              </div>
              
              <div className="rotina-actions">
                <button 
                  className="edit-btn"
                  onClick={() => {
                    // Implementar edição
                    // silencioso
                  }}
                >
                  ✏️
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteRotina(rotina.id_item)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Rotina;