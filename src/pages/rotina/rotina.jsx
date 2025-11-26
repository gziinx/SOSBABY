import React, { useState, useEffect } from 'react';
import './rotina.css';

const Rotina = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [rotinas, setRotinas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    cor: '#000000',
    id_user: '',
    titulo_item: '',
    descricao: '',
    hora: '',
    data_rotina: ''
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
      const userId = getUserIdFromToken();
      const url = `https://backend-sosbaby.onrender.com/v1/sosbaby/viewRoutines?id_user=${userId}`;
      
      // Buscar rotinas
      const response = await fetch(url, {
        method: 'GET',
        headers
      });
      
      if (response.ok) {
        const responseData = await response.json();
        
        // Verificar se a resposta tem a estrutura esperada
        if (responseData && Array.isArray(responseData.data)) {
          // Filtrar rotinas pelo ID do usuário logado
          const userRotinas = responseData.data.filter(rotina => 
            rotina.id_user && rotina.id_user.toString() === userId.toString()
          );
          
          console.log('Rotinas recebidas:', userRotinas);
          setRotinas(userRotinas);
          setApiStatus('success');
        } else {
          console.error('Formato de resposta inesperado:', responseData);
          setApiStatus('error');
        }
      } else {
        setApiStatus('error');
        try {
          const errorData = await response.text();
          console.error('Erro da API:', response.status, errorData);
        } catch (e) {
          console.error('Erro ao ler resposta de erro:', e);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar rotinas:', error);
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

  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return 'Sem horário';
    
    try {
      // If it's in the format 1970-01-01T12:22:00.000Z
      if (timeString.includes('1970-01-01T') && timeString.endsWith('Z')) {
        const timePart = timeString.split('T')[1].split('.')[0];
        return timePart.substring(0, 5); // Returns just HH:MM
      }
      
      // If it's just the time part (HH:MM)
      if (timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      }
      
      return timeString; // Return as is if format is not recognized
    } catch (error) {
      console.error('Erro ao formatar horário:', error);
      return timeString; // Return original if there's an error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = getUserIdFromToken();

      // Format the time to ensure it's in HH:MM format
      let formattedTime = formData.hora;
      if (formData.hora) {
        const [hours, minutes] = formData.hora.split(':');
        formattedTime = `${hours.padStart(2, '0')}:${minutes || '00'}`;
      }

      const rotinaData = {
        titulo_rotina: formData.titulo_item,
        titulo_item: formData.titulo_item,
        descricao: formData.descricao,
        data_rotina: formData.data_rotina,
        hora: formattedTime,
        cor: formData.cor,
        id_user: userId
      };
console.log(rotinaData)
    const response = await fetch(
      'https://backend-sosbaby.onrender.com/v1/sosbaby/RelacionamentoRotina/cadastro',
      {
        method: 'POST',
        headers: getAuthHeaders(), // já inclui Bearer token
        body: JSON.stringify(rotinaData)

        
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Erro na criação da rotina:', responseData);
      throw new Error(responseData.message || 'Erro ao criar rotina');
    }

    console.log('Rotina criada com sucesso:', responseData);

    // Atualizar lista
    fetchRotinas();

    // Resetar form
    setFormData({
      titulo_item: '',
      descricao: '',
      data_rotina: '',
      hora: '',
      cor: '#6366f1'
    });
    setShowForm(false);

    alert('Rotina criada com sucesso!');
  } catch (error) {
    console.error('Erro ao criar rotina:', error);
    alert(`Erro ao criar rotina: ${error.message || 'Tente novamente mais tarde'}`);
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id) => {
    // Verificar confirmação do usuário
    const confirmDelete = window.confirm('Tem certeza que deseja excluir esta rotina? Esta ação não pode ser desfeita.');
    
    if (!confirmDelete) {
      return; // Usuário cancelou a exclusão
    }

    try {
      const response = await fetch(`https://backend-sosbaby.onrender.com/v1/sosbaby/routineResp/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        // Atualizar o estado local apenas após confirmação do servidor
        setRotinas(prevRotinas => prevRotinas.filter(rotina => rotina.id_item !== id));
      } else {
        // Se a API retornar erro, mostrar mensagem
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro ao deletar rotina:', errorData);
        alert('Não foi possível excluir a rotina. Tente novamente mais tarde.');
      }
    } catch (error) {
      console.error('Erro ao deletar rotina:', error);
      alert('Ocorreu um erro ao se comunicar com o servidor. Verifique sua conexão e tente novamente.');
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      const response = await fetch(`https://backend-sosbaby.onrender.com/v1/sosbaby/routineItem/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
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
          <form className="rotina-form" onSubmit={handleSubmit}>
            <h2>Nova Rotina</h2>
            
            <input
              type="text"
              placeholder="Título da rotina"
              value={formData.titulo_item || ''}
              onChange={(e) => setFormData({ ...formData, titulo_item: e.target.value })}
              required
            />
            
            <textarea
              placeholder="Descrição"
              value={formData.descricao || ''}
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
              style={{ borderLeft: `4px solid ${rotina.cor || '#6366f1'}` }}
            >
              <div className="rotina-info">
                <h3>{rotina.titulo_item || rotina.titulo || 'Sem título'}</h3>
                {rotina.descricao && <p className="rotina-descricao">{rotina.descricao}</p>}
                <div className="rotina-meta">
                  {rotina.data_rotina && (
                    <div className="rotina-data">
                      📅 {new Date(rotina.data_rotina).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                  <div className="rotina-time">
                    ⏰ {rotina.hora ? formatTimeForDisplay(rotina.hora) : 'Sem horário'}
                  </div>
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
                  onClick={() => handleDelete(rotina.id_item)}
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