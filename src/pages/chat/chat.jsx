import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './chat.css';

const API_BASE_URL = 'https://backend-sosbaby.onrender.com/v1/sosbaby';
const SOCKET_URL = 'https://backend-sosbaby.onrender.com';

// ... (previous imports remain the same)

const Chat = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // ... (socket initialization and other effects remain the same)

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

    const response = await fetch(`${API_BASE_URL}/filter/nameDoctors`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ nome: term })
});

const data = await response.json();

// DEBUG TEMPORÁRIO
console.log("ENVIADO PARA O BACK:", { nome: term });
console.log("RESPOSTA DO BACK:", data);

    // SE O BACK RETORNAR STATUS 500
    if (!response.ok) {
      console.error('Erro do servidor:', data);
      setContacts([]);
      return;
    }

    // SE ACHOU MÉDICOS
    if (data.Médicos && Array.isArray(data.Médicos)) {
      setContacts(data.Médicos);
    } else {
      setContacts([]);
    }

  } catch (err) {
    console.error('Erro ao buscar médicos:', err);
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

    if (searchTerm.trim() === '') {
      setContacts([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500); // 500ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // ... (rest of the component remains the same, but update the JSX to show search state)

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
                  placeholder="Buscar médicos..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
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
                {searchTerm ? 'Nenhum médico encontrado' : 'Digite para buscar médicos'}
              </div>
            ) : (
              contacts.map((contact) => (
                <div 
                  key={contact.id} 
                  className={`contact-item ${selectedContact?.id === contact.id ? 'selected' : ''}`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="contact-avatar">
                    {contact.nome?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="contact-name">{contact.nome}</div>
                    <div className="contact-type">Médico(a)</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Chat;