import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { createChat, sendMessage as sendMessageService, getChatMessages } from '../../services/chatService';
import './chat.css';

const API_BASE_URL = 'https://backend-sosbaby.onrender.com/v1/sosbaby';
const SOCKET_URL = 'https://backend-sosbaby.onrender.com';

const Chat = () => {
  const [contacts, setContacts] = useState([
    { id: '1', nome: 'Clínica Pediatra X', tipo: 'clinic' },
    { id: '2', nome: 'Dr. Souza', tipo: 'doctor' },
    
    { id: '3', nome: 'Hospitalis', tipo: 'hospital' }
  ]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState(() => {
    // Load messages from localStorage if they exist
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
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
  
  // Socket.io connection
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    
    socketRef.current.on('connect', () => {
      console.log('[socket] connected as', socketRef.current.id);
    });
    
    socketRef.current.on('connect_error', (err) => {
      console.log('[socket] connect_error', err && (err.message || err));
    });
    
    socketRef.current.on('disconnect', (reason) => {
      console.log('[socket] disconnected', reason);
    });
    
    // Handle incoming messages
    socketRef.current.on('receiveMessage', handleIncomingMessage);
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off('receiveMessage', handleIncomingMessage);
        socketRef.current.disconnect();
      }
    };
  }, []);
  
  // Handle incoming messages
  const handleIncomingMessage = useCallback((msg) => {
    if (!selectedContact) return;
    
    const chatId = selectedContact.id;
    const hasFlat = msg && (msg.conteudo !== undefined || msg.created_at !== undefined || msg.id_user !== undefined);
    const hasNested = msg && msg.mensagem_enviada;
    
    const text = hasFlat ? (msg.conteudo ?? '') : (hasNested ? (msg.mensagem_enviada.mensagem ?? '') : '');
    const createdRaw = hasFlat ? msg.created_at : (hasNested ? msg.mensagem_enviada.hora_envio : undefined);
    const idUser = hasFlat ? msg.id_user : undefined;
    
    let ts = '';
    if (createdRaw) {
      const d = new Date(createdRaw);
      ts = isNaN(d.getTime()) ? '' : d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    if (!ts) {
      ts = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    
    const message = {
      id: Date.now().toString(),
      text,
      sender: (idUser == 1) ? 'me' : 'them',
      time: ts
    };
    
    setMessages(prev => [...prev, message]);
  }, [selectedContact]);
  
  // Load messages for a chat
  const loadMessages = useCallback(async (chatId) => {
    try {
      const { success, data, error } = await getChatMessages(chatId);
      
      if (!success) {
        console.error("Erro ao buscar histórico do chat:", error);
        return [];
      }
      
      // Normalize different response formats
      let items = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data && Array.isArray(data.chat_message)) {
        items = data.chat_message;
      } else if (data && Array.isArray(data.chat_messages)) {
        items = data.chat_messages;
      } else if (data && typeof data === 'object') {
        items = [data];
      }
      
      return items.map(msg => {
        const hasFlat = msg && (msg.conteudo !== undefined || msg.created_at !== undefined || msg.id_user !== undefined);
        const hasNested = msg && msg.mensagem_enviada;
        
        const text = hasFlat ? (msg.conteudo ?? '') : (hasNested ? (msg.mensagem_enviada.mensagem ?? '') : '');
        const createdRaw = hasFlat ? msg.created_at : (hasNested ? msg.mensagem_enviada.hora_envio : undefined);
        const idUser = hasFlat ? msg.id_user : undefined;
        
        let ts = '';
        if (createdRaw) {
          const d = new Date(createdRaw);
          ts = isNaN(d.getTime()) ? '' : d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
        
        return {
          id: msg.id_message || msg.id || String(Math.random()),
          text,
          sender: (idUser == 1) ? 'me' : 'them',
          time: ts
        };
      });
    } catch (err) {
      console.error("Erro ao buscar histórico do chat:", err);
      return [];
    }
  }, []);
  
  // Create a new chat
  const createNewChat = async (contact) => {
    try {
      const response = await createChat(contact.nome);
      
      if (!response.success) {
        console.error('Failed to create chat:', response.error);
        return null;
      }
      
      const chatId = response.data?.id_chat || response.data?.id || response.data;
      
      if (!chatId) {
        console.error('Failed to get chat ID from response:', response);
        return null;
      }
      
      const newChatIdByContact = {
        ...chatIdByContact,
        [contact.id]: String(chatId)
      };
      
      setChatIdByContact(newChatIdByContact);
      localStorage.setItem('chatIdByContact', JSON.stringify(newChatIdByContact));
      
      return chatId;
    } catch (err) {
      console.error('Error creating chat:', err);
      return null;
    }
  };
  
  // Select a contact and load/create chat
  const selectContact = async (contact) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if chat already exists
      let chatId = chatIdByContact[contact.id];
      
      // If no chat exists, create one
      if (!chatId) {
        chatId = await createNewChat(contact);
        if (!chatId) {
          setError('Falha ao criar chat');
          setLoading(false);
          return;
        }
      }
      
      // Join the chat room
      socketRef.current.emit('joinChat', chatId);
      
      // Update state with the contact first (allow chat to open)
      setSelectedContact({ ...contact, id: String(chatId) });
      
      // Load messages (non-blocking - chat can still open if this fails)
      const chatMessages = await loadMessages(chatId);
      
      if (chatMessages.length > 0) {
        setMessages(chatMessages);
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
      } else {
        // If no messages loaded, check if it's because of an error or just no messages
        const { success, error: loadError } = await getChatMessages(chatId);
        if (!success && loadError) {
          setError(`Não foi possível carregar histórico: ${loadError}`);
        }
        // Still allow the chat to be open with empty messages
        setMessages([]);
      }
    } catch (err) {
      console.error('Error selecting contact:', err);
      setError('Erro ao abrir chat');
    } finally {
      setLoading(false);
    }
  };
  
  // Send a message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;
    
    const messageText = newMessage;
    const message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'me',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    
    // Update state and save to localStorage (optimistic update)
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    setNewMessage('');
    
    try {
      // Send message via API
      const response = await sendMessageService(selectedContact.id, {
        conteudo: messageText,
        id_user: 1
      });
      
      if (!response.success) {
        console.error('Error sending message:', response.error);
        setError(response.error || 'Erro ao enviar mensagem');
        // Revert on error
        setMessages(messages);
        setNewMessage(messageText);
        return;
      }
      
      setError(null);
      
      // Also send via socket for real-time updates
      if (socketRef.current) {
        socketRef.current.emit('SendMessage', {
          id_chat: selectedContact.id,
          conteudo: messageText,
          id_user: 1
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
      // Revert the message if sending fails
      setMessages(messages);
      setNewMessage(messageText);
    }
  };

  // Handle search with debounce
  const handleSearch = async (term) => {
    if (!term.trim()) {
      setContacts([]);
      return;
    }

    try {
      setSearchLoading(true);
      
      const token = localStorage.getItem('token') ||
                   localStorage.getItem('authToken') ||
                   localStorage.getItem('access_token') ||
                   '';

      // Make API call to search for contacts
      const response = await fetch(`${API_BASE_URL}/filter/nameDoctors`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: term })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching contacts:', errorData);
        setContacts([]);
        return;
      }

      const data = await response.json();
      
      // Transform the API response to match our contact structure
      if (data.Médicos && Array.isArray(data.Médicos)) {
        const mappedContacts = data.Médicos.map(medico => ({
          id: medico.id_medico || medico.id || Math.random().toString(),
          nome: medico.nome_medico || medico.nome || 'Médico sem nome',
          tipo: 'doctor',
          // Add any other fields you need from the API response
          ...medico
        }));
        setContacts(mappedContacts);
      } else {
        setContacts([]);
      }
    } catch (err) {
      console.error('Error searching contacts:', err);
      setContacts([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Handle Enter key for sending messages
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
              <div className="search-container w-full">
                <div className="icon-search-container">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Buscar contatos..."
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
            ) : contacts.length === 0 ? (
              <div className="text-center p-4 text-gray-500">
                Nenhum contato encontrado
              </div>
            ) : (
              contacts.map((contact) => (
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
            )}
          </div>
        </div>

        {/* Chat Area */}
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