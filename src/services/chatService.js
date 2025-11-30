const API_BASE_URL = 'https://backend-sosbaby.onrender.com/v1/sosbaby';

export const createChat = async (chatName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/cadastro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome_chat: chatName })
    });

    const data = await response.json();

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
    const response = await fetch(`${API_BASE_URL}/chat/message/${chatId}`);
    const data = await response.json();

    if (!response.ok) {
      console.error('Get messages error response:', data);
      return {
        success: false,
        data: [],
        error: data.message || 'Falha ao buscar mensagens'
      };
    }

    return {
      success: true,
      data: data.data || data || [],
      error: null
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
