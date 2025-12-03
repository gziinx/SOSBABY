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
        sender: idUser == 1 ? 'me' : 'them',
        time: ts
      };

      setMessages((prev) => {
        const updated = [...prev, message];
        localStorage.setItem(`chatMessages_${selectedContact.id}`, JSON.stringify(updated));
        return updated;
      });
    },
    [selectedContact]
  );

  // Carregar mensagens do backend
  const loadMessages = useCallback(async (chatId) => {
    try {
      const saved = localStorage.getItem(`chatMessages_${chatId}`);
      if (saved) {
        return JSON.parse(saved);
      }

      const { success, data } = await getChatMessages(chatId);
      if (!success) return [];

      let items = Array.isArray(data) ? data : data?.chat_messages || [];

      const formatted = items.map((msg) => {
        const text = msg.conteudo || msg?.mensagem_enviada?.mensagem || '';
        const createdRaw = msg.created_at || msg?.mensagem_enviada?.hora_envio;
        const idUser = msg.id_user;

        let ts = '';
        if (createdRaw) {
          const d = new Date(createdRaw);
          ts = !isNaN(d.getTime())
            ? d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            : '';
        }

        return {
          id: msg.id_message || msg.id || String(Math.random()),
          text,
          sender: idUser == 1 ? 'me' : 'them',
          time: ts
        };
      });

      localStorage.setItem(`chatMessages_${chatId}`, JSON.stringify(formatted));
      return formatted;
    } catch (err) {
      console.error(err);
      return [];
    }
  }, []);

  // Criar novo chat caso não exista
  const createNewChat = async (contact) => {
    try {
      const response = await createChat(contact.nome);
      if (!response.success) return null;

      const chatId = response.data?.id_chat || response.data?.id;
      if (!chatId) return null;

      const map = { ...chatIdByContact, [contact.id]: String(chatId) };

      setChatIdByContact(map);
      localStorage.setItem('chatIdByContact', JSON.stringify(map));

      return chatId;
    } catch {
      return null;
    }
  };

  // Selecionar contato
  const selectContact = async (contact) => {
    setLoading(true);
    setError(null);

    try {
      let chatId = chatIdByContact[contact.id];
      if (!chatId) {
        chatId = await createNewChat(contact);
        if (!chatId) {
          setError('Falha ao criar chat');
          setLoading(false);
          return;
        }
      }

      socketRef.current.emit('joinChat', chatId);
      setSelectedContact({ ...contact, id: chatId });

      const chatMessages = await loadMessages(chatId);
      setMessages(chatMessages);
    } catch (err) {
      setError('Erro ao abrir chat');
    } finally {
      setLoading(false);
    }
  };

  // Enviar mensagem
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    const msg = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem(`chatMessages_${selectedContact.id}`, JSON.stringify(updated));

    setNewMessage('');

    try {
      const response = await sendMessageService(selectedContact.id, {
        conteudo: msg.text,
        id_user: 1
      });

      if (!response.success) {
        setError('Falha ao enviar mensagem');
        return;
      }

      socketRef.current.emit('SendMessage', {
        id_chat: selectedContact.id,
        conteudo: msg.text,
        id_user: 1
      });
    } catch (err) {
      setError('Erro ao enviar mensagem');
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
                <div className="icon-search-container">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Buscar médicos..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
