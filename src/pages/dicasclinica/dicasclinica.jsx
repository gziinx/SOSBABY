  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import './dicasclinica.css';

  // Add this CSS for required field indicator
  const requiredStyle = {
    color: 'red',
    marginLeft: '4px'
  };

  const DicasClinica = () => {
    const [nomeCategoria, setNomeCategoria] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [dica, setDica] = useState({
      titulo: '',
      conteudo: '',
      imagem: null,
      id_categoria: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeCard, setActiveCard] = useState(null);
    const navigate = useNavigate();

    // Get auth token
    const getAuthToken = () => {
      return localStorage.getItem('token') || '';
    };

    // Fetch all categories
    const fetchCategorias = async () => {
      try {
        const response = await fetch('https://backend-sosbaby.onrender.com/v1/sosbaby/categorys', {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCategorias(data.data || []);
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    // Handle category creation
    const handleCriarCategoria = async (e) => {
      e.preventDefault();
      if (!nomeCategoria.trim()) return;

      try {
        setLoading(true);
        const response = await fetch('https://backend-sosbaby.onrender.com/v1/sosbaby/category/cadastro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({ nome_categoria: nomeCategoria })
        });

        if (response.ok) {
          setSuccess('Categoria criada com sucesso!');
          setNomeCategoria('');
          fetchCategorias();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao criar categoria');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Handle dica creation
    const handleCriarDica = async (e) => {
      e.preventDefault();
      
      // Reset previous messages
      setError('');
      setSuccess('');
      
      // Validate required fields
      if (!dica.titulo || !dica.conteudo || !dica.id_categoria || !dica.imagem) {
        setError('Preencha todos os campos obrigatórios, incluindo a imagem');
        return;
      }

      // Validate image type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (dica.imagem && !validImageTypes.includes(dica.imagem.type)) {
        setError('Por favor, envie uma imagem nos formatos: JPG, PNG, GIF ou WebP');
        return;
      }

    

      try {
        setLoading(true);
        const response = await fetch('https://backend-sosbaby.onrender.com/v1/sosbaby/tip/cadastro', {
           method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({
      titulo: dica.titulo.trim(),
      conteudo: dica.conteudo.trim(),
      id_categoria: dica.id_categoria,
      imagem: dica.imagem
    })
  }
);

        if (response.ok) {
          setSuccess('Dica criada com sucesso!');
          setDica({
            titulo: '',
            conteudo: '',
            imagem: null,
            id_categoria: ''
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao criar dica');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Handle file input change
    const handleFileChange = (e) => {
      setDica({ ...dica, imagem: e.target.files[0] });
    };

    // Load categories on component mount
    useEffect(() => {
      fetchCategorias();
    }, []);

    const toggleCard = (card) => {
      setActiveCard(activeCard === card ? null : card);
    };

    return (
      <div className="dicas-container">
        <h1>Gerenciar Dicas</h1>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <div className="cards-container">
          {/* Card Criar Categoria */}
          <div className={`card ${activeCard === 'categoria' ? 'active' : ''}`}>
            <div 
              className="card-header" 
              onClick={() => toggleCard('categoria')}
            >
              <span>Nova Categoria</span>
              <span className="arrow">▼</span>
            </div>
            <div className="card-content">
              <form onSubmit={handleCriarCategoria}>
                <div className="form-group">
                  <label htmlFor="nomeCategoria">Nome da Categoria</label>
                  <input
                    type="text"
                    id="nomeCategoria"
                    value={nomeCategoria}
                    onChange={(e) => setNomeCategoria(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Criando...' : 'Criar Categoria'}
                </button>
              </form>
            </div>
          </div>

          {/* Card Criar Dica */}
          <div className={`card ${activeCard === 'dica' ? 'active' : ''}`}>
            <div 
              className="card-header" 
              onClick={() => toggleCard('dica')}
            >
              <span>Nova Dica</span>
              <span className="arrow">▼</span>
            </div>
            <div className="card-content">
              <form onSubmit={handleCriarDica}>
                <div className="form-group">
                  <label htmlFor="titulo">Título</label>
                  <input
                    type="text"
                    id="titulo"
                    value={dica.titulo}
                    onChange={(e) => setDica({...dica, titulo: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="conteudo">Conteúdo</label>
                  <textarea
                    id="conteudo"
                    value={dica.conteudo}
                    onChange={(e) => setDica({...dica, conteudo: e.target.value})}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="categoria">Categoria</label>
                  <select
                    id="categoria"
                    value={dica.id_categoria}
                    onChange={(e) => setDica({...dica, id_categoria: e.target.value})}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nome_categoria}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="imagem">Imagem <span style={requiredStyle}>*</span></label>
                  <input
                    type="file"
                    id="imagem"
                    accept="image/jpeg, image/png, image/gif, image/webp"
                    required
                    onChange={handleFileChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Publicando...' : 'Publicar Dica'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default DicasClinica;