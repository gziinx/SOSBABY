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

export const createChat = async (chatName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/cadastro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome_chat: chatName })
    });

    const text = await response.text();
console.log("RESPOSTA BRUTA DO BACKEND:", text);

let data;
try {
  data = JSON.parse(text);
} catch {
  console.error("Backend devolveu HTML, não JSON.");
  return {
    success: false,
    data: [],
    error: "Backend retornou HTML — rota pode estar explodindo no servidor"
  };
}

    if (!response.ok) {
      console.error('Create chat error response:', data);
      return {
        success: false,
        data: null,
        error: data.message || 'Falha ao criar chat'
      };
    }

    return {
      success: true,
      data: data.data || data,
      error: null
    };
  } catch (error) {
    console.error('Error creating chat:', error);
    return {
      success: false,
      data: null,
      error: error.message || 'Erro de rede'
    };
  }
};

export const sendMessage = async (chatId, messageData) => {
  try {
    // Step 1: Create the message
    const messagePayload = {
      id_chat: parseInt(chatId),
      conteudo: messageData.conteudo,
      id_user: messageData.id_user || 1
    };

    console.log('Sending message payload:', messagePayload);

    const messageResponse = await fetch(`${API_BASE_URL}/message/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messagePayload)
    });

    const messageData_response = await messageResponse.json();

    if (!messageResponse.ok) {
      console.error('Send message error response:', messageData_response);
      return {
        success: false,
        data: null,
        error: messageData_response.message || 'Falha ao enviar mensagem'
      };
    }

    // Extract message ID from response
    const messageId = messageData_response.data?.id_mensagem || messageData_response.data?.id;
    
    if (!messageId) {
      console.error('No message ID in response:', messageData_response);
      return {
        success: false,
        data: null,
        error: 'Falha ao obter ID da mensagem'
      };
    }

    // Step 2: Create the chat-message relationship
    const chatMessagePayload = {
      id_chat: parseInt(chatId),
      id_mensagem: parseInt(messageId)
    };

    console.log('Creating chat-message relationship:', chatMessagePayload);

    const chatMessageResponse = await fetch(`${API_BASE_URL}/chat/message/cadastro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatMessagePayload)
    });

    const chatMessageData = await chatMessageResponse.json();

    if (!chatMessageResponse.ok) {
      console.error('Chat-message relationship error response:', chatMessageData);
      return {
        success: false,
        data: null,
        error: chatMessageData.message || 'Falha ao criar relacionamento da mensagem'
      };
    }

    return {
      success: true,
      data: chatMessageData.data || chatMessageData,
      error: null
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      data: null,
      error: error.message || 'Erro de rede'
    };
  }
};

export const getChatMessages = async (chatId) => {
  try {
    // Try primary endpoint first
    const response = await fetch(`${API_BASE_URL}/chat/message/${chatId}`)

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: data.data || data || [],
        error: null
      };
    }

    // If primary endpoint fails, try alternative endpoint
    console.log('Primary endpoint failed, trying alternative /chatMessages endpoint');
    const alternativeResponse = await fetch(`${API_BASE_URL}/chat/message/${chatId}`);
    const alternativeData = await alternativeResponse.json();

    if (alternativeResponse.ok) {
      console.log('Alternative endpoint succeeded');
      return {
        success: true,
        data: alternativeData.data || alternativeData || [],
        error: null
      };
    }

    // If both fail, return error
    console.error('Both endpoints failed. Primary:', data, 'Alternative:', alternativeData);
    return {
      success: false,
      data: [],
      error: data.message || alternativeData.message || 'Falha ao buscar mensagens'
    };
  } catch (error) {
    console.error('Error fetching messages:', error);
    return {
      success: false,
      data: [],
      error: error.message || 'Erro de rede'
    };
  }
};
