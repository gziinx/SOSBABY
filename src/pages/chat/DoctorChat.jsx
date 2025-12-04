// chat.jsx corrigido com salvamento por chatId
// (Substitua todo o conteúdo do seu arquivo por este)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { createChat, sendMessage as sendMessageService, getChatMessages, searchResp } from '../../services/chatService';
import './chat.css';

const API_BASE_URL = 'https://backend-sosbaby.onrender.com/v1/sosbaby';
const SOCKET_URL = 'https://backend-sosbaby.onrender.com';

const DoctorChat = () => {
  const [recentConversations, setRecentConversations] = useState(() => {
    const saved = localStorage.getItem('recentConversations');
    return saved ? JSON.parse(saved) : [];
  });
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [chatIdByContact, setChatIdByContact] = useState(
    JSON.parse(localStorage.getItem('chatIdByContact') || '{}')
  );
  const [error, setError] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // SOCKET
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    socketRef.current.on('receiveMessage', handleIncomingMessage);

    return () => {
      socketRef.current?.off('receiveMessage', handleIncomingMessage);
      socketRef.current?.disconnect();
    };
  }, []);

  // Receber mensagem via socket
  const handleIncomingMessage = useCallback(
    (msg) => {
      if (!selectedContact) return;

      const text = msg?.conteudo || msg?.mensagem_enviada?.mensagem || '';
      const createdRaw = msg?.created_at || msg?.mensagem_enviada?.hora_envio;
      const idUser = msg?.id_user;
      
      // Obter ID do usuário atual para verificar se a mensagem é do usuário atual
      const currentUserId = getUserId();
      const isFromMe = idUser === currentUserId;

      let ts = '';
      if (createdRaw) {
        const d = new Date(createdRaw);
        ts = !isNaN(d.getTime())
          ? d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          : '';
      }

      if (!ts) {
        ts = new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }

      const message = {
        id: Date.now().toString(),
        text,
        sender: isFromMe ? 'me' : 'them',
        time: ts
      };

      setMessages((prev) => {
        const updated = [...prev, message];
        localStorage.setItem(`chatMessages_${selectedContact.id}`, JSON.stringify(updated));
        return updated;
      });
    },
    
  );
  const getUserId = () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        console.error('Dados do usuário não encontrados no localStorage');
        return null;
      }
      const user = JSON.parse(userData);
      return user.id_user || null;
    } catch (error) {
      console.error('Erro ao obter ID do usuário:', error);
      return null;
    }
  };


  // Carregar mensagens do backend
 const loadMessages = useCallback(async (chatId) => {
  try {
    const currentUserId = getUserId();
    if (!currentUserId) {
      console.error('Usuário não autenticado');
      return [];
    }

    const messages = await getChatMessages(chatId);
    
    // Verificar se há mensagens no localStorage
    const savedMessages = localStorage.getItem(`chatMessages_${chatId}`);
    let localMessages = [];
    
    if (savedMessages) {
      try {
        localMessages = JSON.parse(savedMessages);
      } catch (e) {
        console.error('Erro ao carregar mensagens locais:', e);
      }
    }

    // Combinar mensagens do servidor com as locais
    const allMessages = [...messages, ...localMessages]
      // Remover duplicatas pelo ID da mensagem
      .filter((msg, index, self) => 
        index === self.findIndex(m => m.id === msg.id)
      )
      // Ordenar por data (mais antigas primeiro)
      .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at) : new Date();
        const dateB = b.created_at ? new Date(b.created_at) : new Date();
        return dateA - dateB;
      })
      // Mapear para o formato esperado pelo componente
      .map(msg => {
        const isFromMe = String(msg.id_user) === String(currentUserId);
        return {
          id: msg.id || Date.now().toString(),
          text: msg.text || msg.conteudo || '',
          sender: isFromMe ? 'me' : 'them',
          time: msg.created_at 
            ? new Date(msg.created_at).toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })
            : new Date().toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
          // Manter os dados originais para referência
          original: msg
        };
      });

    console.log('Mensagens carregadas e processadas:', allMessages);
    return allMessages;

  } catch (error) {
    console.error('Erro ao carregar mensagens:', error);
    return [];
  }
}, [getUserId]);

  // Criar novo chat caso não exista
// Helper: normaliza a chave do contato para mapear chatId
const getContactKey = (contact) => {
  // Prioriza propriedades que comumente aparecem no seu app
  return String(contact.id ?? contact.id_user ?? contact.id_responsavel ?? contact.originalId ?? contact.cpf ?? '');
};

// Criar novo chat caso não exista (ajustada para usar getContactKey)
const createNewChat = async (contact) => {
  try {
    const currentUserId = getUserId();
    if (!currentUserId) {
      console.error('Usuário não autenticado');
      return null;
    }
    
    const response = await createChat(currentUserId, contact.id_user ?? contact.id);
    if (!response?.success) {
      console.error('Falha ao criar chat:', response?.error ?? response);
      return null;
    }

    const chatId = response.data?.id_chat ?? response.data?.id;
    if (!chatId) {
      console.error('ID do chat inválido na resposta:', response.data);
      return null;
    }

    // Atualiza o mapeamento com a chave normalizada
    const key = getContactKey(contact);
    const map = { ...chatIdByContact, [key]: String(chatId) };
    setChatIdByContact(map);
    localStorage.setItem('chatIdByContact', JSON.stringify(map));

    return String(chatId);
  } catch (error) {
    console.error('Erro ao criar novo chat:', error);
    return null;
  }
};

// Selecionar contato (refatorada para checar várias fontes e sempre setar selectedContact.chatId)
const selectContact = async (contact) => {
  setLoading(true);
  setError(null);

  try {
    const currentUserId = getUserId();
    if (!currentUserId) {
      setError('Usuário não autenticado');
      setLoading(false);
      return;
    }

    const key = getContactKey(contact);

    // 1) Se o contato já trouxe chatId diretamente (ex.: vindo de recentConversations)
    let chatId = contact.chatId ? String(contact.chatId) : null;

    // 2) Se não, procurar no mapeamento local
    if (!chatId && chatIdByContact && chatIdByContact[key]) {
      chatId = String(chatIdByContact[key]);
    }

    let isNewChat = !chatId;

    // 3) Se ainda não tem, checar no backend se já existe um chat entre os dois
    if (!chatId) {
      const checkResponse = await checkExistingChat(currentUserId, contact.id_user ?? contact.id);
      if (checkResponse?.success && checkResponse.data?.id_chat) {
        chatId = String(checkResponse.data.id_chat);
        isNewChat = false;
      } else {
        // 4) Se não existir, criar um novo chat
        chatId = await createNewChat(contact);
        if (!chatId) {
          setError('Falha ao criar ou encontrar chat');
          setLoading(false);
          return;
        }
        isNewChat = true;
      }

      // Atualizar o mapeamento local com a chave normalizada
      const updatedChatMap = {
        ...chatIdByContact,
        [key]: String(chatId)
      };
      setChatIdByContact(updatedChatMap);
      localStorage.setItem('chatIdByContact', JSON.stringify(updatedChatMap));
    }

    console.log('Conectando ao chat ID:', chatId);

    // Emitir join com chatId correto (número

    // Atualizar o contato selecionado com o ID do chat e a chave original
    setSelectedContact({ 
      ...contact, 
      chatId: String(chatId),
      originalKey: key
    });

    // Carregar as mensagens do chat (usa chatId numérico / string suportado)
    const chatMessages = await loadMessages(chatId);
    setMessages(chatMessages);

    // Gerenciar recentConversations apenas se for um novo chat
    if (isNewChat) {
      const updatedConversations = [
        {
          id: contact.id,
          nome: contact.nome_medico || contact.nome || 'Contato',
          tipo: contact.tipo || 'Contato',
          lastMessage: '',
          lastMessageTime: new Date().toISOString(),
          chatId: String(chatId)
        },
        ...recentConversations
      ]
      // remover duplicatas por id
      .filter((v, i, arr) => i === arr.findIndex(a => a.id === v.id))
      .slice(0, 10);

      setRecentConversations(updatedConversations);
      localStorage.setItem('recentConversations', JSON.stringify(updatedConversations));
    }

  } catch (err) {
    console.error('Erro ao abrir chat:', err);
    setError('Erro ao abrir o chat. Tente novamente.');
  } finally {
    setLoading(false);
  }
};

  // Obter ID do usuário logado
  
  // Enviar mensagem
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    const userId = getUserId();
    if (!userId) {
      setError('Usuário não autenticado');
      return;
    }

    const chatId = selectedContact.chatId || chatIdByContact[selectedContact.id];
    if (!chatId) {
      setError('ID do chat não encontrado');
      return;
    }

    try {
      // Criar o objeto da mensagem
      const messageData = {
        id_chat: parseInt(chatId),
        conteudo: newMessage.trim(),
        id_user: parseInt(userId),
        created_at: new Date().toISOString()
      };

      // Enviar mensagem para o servidor
      const response = await sendMessageService(chatId, messageData);

      if (!response.success) {
        throw new Error(response.error || 'Falha ao enviar mensagem');
      }

      // Enviar mensagem via socket
      socketRef.current.emit('SendMessage', messageData);
      
      // Limpar o campo de mensagem
      setNewMessage('');
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setError('Erro ao enviar mensagem. Tente novamente.');
    }
  };

  // Efeito para buscar médicos quando o termo de busca mudar
  useEffect(() => {
    // Log para verificar a estrutura do DOM após a renderização
    const logContactListStructure = () => {
      const contactList = document.getElementById('contact-list');
      console.log('Estrutura do DOM da lista de contatos:', contactList?.outerHTML);
      console.log('Contatos no estado:', contacts);
    };

    const search = async () => {
  if (!searchTerm.trim()) {
    console.log('Termo de busca vazio, limpando contatos');
    setContacts([]);
    return;
  }

  console.log('Iniciando busca com termo:', searchTerm);
  setSearchLoading(true);
  
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado no localStorage');
      setError('Usuário não autenticado');
      setSearchLoading(false);
      return;
    }

    console.log('Buscando responsáveis com o termo:', searchTerm);
    const result = await searchResp(searchTerm, token);
    console.log('Resposta da busca:', result);
    
    const { success, data, error } = result;
    
    if (success) {
      // Ajuste para a estrutura correta da resposta
      const responsaveisList = data?.Nomes || [];
      console.log('Lista de responsáveis recebida:', responsaveisList);
      
      if (!Array.isArray(responsaveisList)) {
        console.error('A lista de responsáveis não é um array:', responsaveisList);
        setError('Formato de dados inválido');
        setContacts([]);
        return;
      }
      
      const formattedResponsaveis = responsaveisList.map(responsavel => {
        console.log('Processando responsável:', responsavel);
        return {
          id: responsavel.id_responsavel,
          nome: responsavel.nome_responsavel || responsavel.nome_user || 'Responsável sem nome',
          tipo: 'Responsável',
          email: responsavel.email,
          telefone: responsavel.telefone,
          cpf: responsavel.cpf,
          dataNascimento: responsavel.data_nascimento,
          sexo: responsavel.sexo_responsavel
        };
      });
      
      console.log('Responsáveis formatados:', formattedResponsaveis);
      setContacts(formattedResponsaveis);
    } else {
      console.error('Erro na busca:', error);
      setError(error || 'Erro ao buscar responsáveis');
      setContacts([]);
    }
  } catch (err) {
    console.error('Erro na busca:', err);
    setError('Erro ao buscar responsáveis');
    setContacts([]);
  } finally {
    setSearchLoading(false);
  }
};

    // Usar debounce para evitar muitas chamadas enquanto o usuário digita
    const timer = setTimeout(() => {
      search();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

    // Usar debounce para evitar muitas chamadas enquanto o usuário digita


  // Efeito para rolagem automática das mensagens
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Efeito para verificar a estrutura do DOM após atualizações
  useEffect(() => {
    if (contacts.length > 0) {
      // Usar um pequeno atraso para garantir que o DOM foi atualizado
      const timer = setTimeout(() => {
        console.log('Verificando estrutura do DOM após atualização dos contatos...');
        const contactItems = document.querySelectorAll('.contact-item');
        console.log(`Número de itens de contato encontrados no DOM: ${contactItems.length}`);
        contactItems.forEach((item, index) => {
          console.log(`Contato ${index + 1}:`, item.outerHTML);
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [contacts]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };


 return (
    <div id="app" className="h-screen bg-black p-4 flex items-center justify-center">
      <div className="main-container">
        <div id="sidebar" className="sidebar">
          <div className="sidebar-header p-6 border-b border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="search-container w-full relative">
                <div className="relative w-full" style={{ minWidth: '200px' }}>
                  <input 
                    type="text" 
                    placeholder="Buscar pacientes.."
                    className="search-input pl-4 pr-10 py-2.5 w-full bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                      paddingRight: '2.5rem',
                      minWidth: '100%'
                    }}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" style={{ right: '0.75rem' }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                {searchLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div id="contact-list" className="contact-list-area">
            {searchLoading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : searchTerm.trim() ? (
              contacts.length === 0 ? (
                <div className="text-center p-4 text-gray-500">
                  Nenhum contato encontrado
                </div>
              ) : (
                contacts.map((contact) => (
                  <div 
                    key={contact.id} 
                    className={`contact-item p-3 hover:bg-gray-800 cursor-pointer transition-colors ${selectedContact?.id === contact.id ? 'bg-gray-800' : ''}`}
                    onClick={() => selectContact(contact)}
                  >
                    <div className="flex items-center">
                      <div className="contact-avatar flex-shrink-0 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                        {contact.nome?.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3 overflow-hidden">
                        <div className="flex justify-between items-baseline">
                          <div className="contact-name text-white font-medium truncate">{contact.nome}</div>
                          <span className="text-xs text-gray-400 ml-2">{contact.tipo}</span>
                        </div>
                        {contact.especialidade && (
                          <div className="text-sm text-gray-400 truncate">{contact.especialidade}</div>
                        )}
                        {contact.email && (
                          <div className="text-xs text-gray-500 truncate">{contact.email}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : (
              recentConversations.length === 0 ? (
                <div className="text-center p-4 text-gray-500">
                  Nenhuma conversa recente. Busque um contato para começar.
                </div>
              ) : (
                recentConversations.map((contact) => (
                  <div 
                    key={contact.id} 
                    className={`contact-item ${selectedContact?.id === contact.id ? 'selected' : ''}`}
                    onClick={() => selectContact(contact)}
                  >
                    <div className="contact-avatar">
                      {contact.nome?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="contact-name">{contact.nome}</div>
                      <div className="contact-type">{contact.tipo}</div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>

        {selectedContact ? (
          <div className="chat-area">
            <div className="chat-header">
            <button 
              onClick={() => window.location.href = '/criarconsulta'}
              className="camera-button"
              aria-label="Ir para consulta"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </button>
            <div className="chat-contact-info">
                <div className="contact-avatar">
                  {selectedContact.nome?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="contact-name">{selectedContact.nome}</div>
                </div>
              </div>
            </div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2">
                {error}
              </div>
            )}
            <div className="message-area">
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg.id} className={`message-bubble ${msg.sender === 'me' ? 'user' : 'contact'}`}>
                    <div className="message-content">
                      <div className="message-text">{msg.text}</div>
                      <div className={`timestamp-${msg.sender === 'me' ? 'user' : 'contact'}`}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-messages">
                  Nenhuma mensagem ainda. Envie uma mensagem para começar a conversa.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-area">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <button 
                onClick={sendMessage}
                disabled={!newMessage.trim() || loading}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-content">
              <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3>Nenhuma conversa selecionada</h3>
              <p>Selecione um contato para começar a conversar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

export default DoctorChat;
