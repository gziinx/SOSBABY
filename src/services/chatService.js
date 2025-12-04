const API_BASE_URL = 'https://backend-sosbaby.onrender.com/v1/sosbaby';


export const searchResp = async (searchTerm, token) => {
  try {
    console.log('Iniciando busca de responsáveis...');
    console.log('URL da requisição:', `${API_BASE_URL}/filter/nameResp`);
    console.log('Termo de busca:', searchTerm);
    
    const response = await fetch(`${API_BASE_URL}/filter/nameResp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: searchTerm })  // Note que aqui é 'name' e não 'nome'
    });

    console.log('Status da resposta:', response.status);
    const responseText = await response.text();
    console.log('Resposta bruta:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Erro ao fazer parse do JSON:', e);
      throw new Error('Resposta inválida do servidor');
    }

    if (!response.ok) {
      return {
        success: false,
        data: [],
        error: data.message || 'Falha ao buscar responsáveis'
      };
    }

    // Ajuste para a estrutura correta da resposta
    return {
      success: true,
      data: data, // Mantemos o objeto completo da resposta
      error: null
    };
  } catch (error) {
    console.error('Error searching responsáveis:', error);
    return {
      success: false,
      data: [],
      error: error.message || 'Erro de rede'
    };
  }
};

export const searchDoctors = async (searchTerm, token) => {
  try {
    console.log('Iniciando busca de médicos...');
    console.log('URL da requisição:', `${API_BASE_URL}/filter/nameDoctors`);
    console.log('Termo de busca:', searchTerm);
    
    const response = await fetch(`${API_BASE_URL}/filter/nameDoctors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nome: searchTerm })
    });

    console.log('Status da resposta:', response.status);
    const responseText = await response.text();
    console.log('Resposta bruta:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Erro ao fazer parse do JSON:', e);
      throw new Error('Resposta inválida do servidor');
    }

    if (!response.ok) {
      return {
        success: false,
        data: [],
        error: data.message || 'Falha ao buscar médicos'
      };
    }

    return {
      success: true,
      data: data.data || data,
      error: null
    };
  } catch (error) {
    console.error('Error searching doctors:', error);
    return {
      success: false,
      data: [],
      error: error.message || 'Erro de rede'
    };
  }
};

export const createChat = async (user1_id, user2_id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token de autenticação não encontrado');
      return {
        success: false,
        error: 'Usuário não autenticado'
      };
    }

    console.log('Criando chat entre:', { user1_id, user2_id });

    const response = await fetch(`${API_BASE_URL}/chat/cadastro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user1_id: user1_id,
        user2_id: user2_id
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro ao criar chat:', data);
      return {
        success: false,
        error: data.message || 'Falha ao criar chat'
      };
    }

    console.log('Chat criado com sucesso:', data);
    return {
      success: true,
      data: data.data || data
    };

  } catch (error) {
    console.error('Erro ao criar chat:', error);
    return {
      success: false,
      error: error.message || 'Erro ao criar chat'
    };
  }
};

export const sendMessage = async (chatId, messageData) => {
  try {
    // Ensure we're sending the data in the correct format
    const payload = {
      conteudo: messageData.conteudo,
      id_chat: parseInt(chatId),
      id_user: parseInt(messageData.id_user)
    };

    console.log('Sending message payload:', payload);

    const response = await fetch(`${API_BASE_URL}/message/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Send message error response:', responseData);
      return {
        success: false,
        error: responseData.message || 'Falha ao enviar mensagem'
      };
    }

    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      error: 'Erro de conexão ao enviar mensagem'
    };
  }
};

export const getChatMessages = async (chatId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token de autenticação não encontrado');
      return [];
    }

    console.log('Buscando mensagens para o chat ID:', chatId);
    const response = await fetch(`${API_BASE_URL}/chat/message/${chatId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro ao buscar mensagens:', data);
      return [];
    }

    // Verificar se a resposta tem a estrutura esperada
    if (!data.mensagens || !Array.isArray(data.mensagens)) {
      console.error('Formato de mensagens inválido:', data);
      return [];
    }

    console.log('Mensagens recebidas:', data.mensagens);
    return data.mensagens.map(msg => ({
      id: msg.id_mensagem,
      text: msg.conteudo,
      sender: 'them', // Será ajustado no componente se for do usuário atual
      time: msg.created_at,
      id_user: msg.id_user,
      nome_user: msg.nome_user
    }));

  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    return [];
  }
};

export const getAllChats = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/chats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return {
      success: true,
      data: data,
      error: null
    };
  } catch (error) {
    console.error('Error fetching chats:', error);
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};
