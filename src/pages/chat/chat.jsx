// chat.jsx corrigido com salvamento por chatId
// (Substitua todo o conteúdo do seu arquivo por este)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { createChat, sendMessage as sendMessageService, getChatMessages, searchDoctors } from '../../services/chatService';
import './chat.css';

const API_BASE_URL = 'https://backend-sosbaby.onrender.com/v1/sosbaby';
const SOCKET_URL = 'https://backend-sosbaby.onrender.com';

const Chat = () => {
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
const loadMessages = async (chatId) => {
  if (!chatId) {
    console.error('ID do chat não fornecido');
    return [];
  }

  try {
    console.log(`Carregando mensagens para o chat: ${chatId}`);
    const messages = await getChatMessages(chatId);
    console.log('Mensagens recebidas:', messages);
    
    if (!Array.isArray(messages)) {
      console.warn('Formato de mensagens inesperado:', messages);
      return [];
    }

    return messages.map(msg => {
      // Ensure we have a valid message object
      if (!msg) return null;
      
      return {
        id: msg.id_mensagem || msg.id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: msg.conteudo || msg.text || '',
        sender: String(msg.id_user) === String(getUserId()) ? 'me' : 'them',
        time: msg.created_at ? 
          new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 
          new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
    }).filter(Boolean); // Remove any null/undefined messages

  } catch (error) {
    console.error('Erro ao carregar mensagens:', {
      error: error.message,
      stack: error.stack,
      chatId
    });
    setError('Não foi possível carregar as mensagens. Tente novamente.');
    return [];
  }
};

  // Criar novo chat caso não exista
  const createNewChat = async (contact) => {
    try {
      const currentUserId = getUserId();
      if (!currentUserId) {
        console.error('Usuário não autenticado');
        return null;
      }
      
      const response = await createChat(currentUserId, contact.id);
      if (!response.success) {
        console.error('Falha ao criar chat:', response.error);
        return null;
      }

      const chatId = response.data?.id_chat || response.data?.id;
      if (!chatId) {
        console.error('ID do chat inválido na resposta:', response.data);
        return null;
      }

      const map = { ...chatIdByContact, [contact.id]: String(chatId) };
      setChatIdByContact(map);
      localStorage.setItem('chatIdByContact', JSON.stringify(map));

      return chatId;
    } catch (error) {
      console.error('Erro ao criar novo chat:', error);
      return null;
    }
  };

  // Selecionar contato
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

    // Set the selected contact immediately to show the chat area
    setSelectedContact(contact);

    // Check if we already have a chat ID for this contact
    let chatId = chatIdByContact[contact.id];

    // If no chat exists, create a new one
    if (!chatId) {
      console.log('Criando novo chat entre:', { user1_id: currentUserId, user2_id: contact.id_user || contact.id });
      
      const response = await createChat(currentUserId, contact.id_user || contact.id);
      console.log('Resposta da criação do chat:', response);
      
      if (!response?.success) {
        throw new Error(response?.error || 'Falha ao criar chat');
      }

      // Extract chat ID from the response
      chatId = response.data?.chat?.id_chat || response.data?.id_chat || response.data?.id;
      
      console.log('ID do chat extraído:', chatId);
      
      if (!chatId) {
        console.error('Estrutura inesperada da resposta:', response);
        throw new Error('ID do chat não encontrado na resposta');
      }

      // Update the chat ID mapping
      const updatedChatMap = {
        ...chatIdByContact,
        [contact.id]: String(chatId)
      };
      setChatIdByContact(updatedChatMap);
      localStorage.setItem('chatIdByContact', JSON.stringify(updatedChatMap));
    }

    // Connect to the chat
    console.log('Conectando ao chat:', chatId);
    socketRef.current.emit('joinChat', chatId);

    // Update the selected contact with the chat ID
    const updatedContact = {
      ...contact,
      chatId: String(chatId)
    };
    setSelectedContact(updatedContact);

    // Load messages
    console.log('Carregando mensagens para o chat:', chatId);
    const messages = await loadMessages(chatId);
    console.log('Mensagens carregadas:', messages);
    setMessages(messages || []);

  } catch (err) {
    console.error('Erro ao selecionar contato:', err);
    setError(err.message || 'Erro ao abrir o chat. Tente novamente.');
    setSelectedContact(null);
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
        // Adicionar um pequeno atraso para garantir que o estado foi atualizado
        setTimeout(logContactListStructure, 100);
        return;
      }

      console.log('Iniciando busca com termo:', searchTerm);
      setSearchLoading(true);
      
      try {
        // Obter o token do localStorage ou de onde estiver armazenado
        const token = localStorage.getItem('token');
        console.log('Token de autenticação:', token ? 'Token encontrado' : 'Token não encontrado');
        
        if (!token) {
          console.error('Token não encontrado no localStorage');
          setError('Usuário não autenticado');
          setSearchLoading(false);
          return;
        }

        console.log('Buscando médicos com o termo:', searchTerm);
        const result = await searchDoctors(searchTerm, token);
        console.log('Resposta da busca:', result);
        
        const { success, data, error } = result;
        
        if (success) {
          // A resposta vem com os médicos dentro da propriedade "Médicos"
          const doctorsList = data?.Médicos || [];
          console.log('Lista de médicos recebida:', doctorsList);
          
          if (!Array.isArray(doctorsList)) {
            console.error('A lista de médicos não é um array:', doctorsList);
            setError('Formato de dados inválido');
            setContacts([]);
            return;
          }
          
          const formattedDoctors = doctorsList.map(doctor => {
            console.log('Processando médico:', doctor);
            return {
              id: doctor.id_medico,
              nome: doctor.nome_medico || 'Médico sem nome',
              tipo: 'Médico',
              especialidade: doctor.crm ? `CRM: ${doctor.crm}` : 'Sem CRM informado',
              email: doctor.email,
              telefone: doctor.telefone
            };
          });
          
          console.log('Médicos formatados:', formattedDoctors);
          setContacts(formattedDoctors);
          
          // Verificar se há contatos após o setState
          setTimeout(() => {
            console.log('Estado atual de contacts:', contacts);
          }, 0);
        } else {
          console.error('Erro na busca:', error);
          setError(error || 'Erro ao buscar médicos');
          setContacts([]);
        }
      } catch (err) {
        console.error('Erro na busca:', err);
        setError('Erro ao buscar médicos');
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
                    placeholder="Buscar médicos..."
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
              onClick={() => window.location.href = '/consulta'}
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

export default Chat;
