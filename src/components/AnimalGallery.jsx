import { useState } from 'react';
import { Heart, MapPin, Plus, Trash2, Shield, Send, Flag, X, ZoomIn, CheckCircle, ImageOff, Upload, MessageCircle } from 'lucide-react';
import useAdminAuth from '../hooks/useAdminAuth';
import AdminAuthGuard from './AdminAuthGuard';

export default function RefugioSection({ animals = [], onUpdateAnimal, onDeleteAnimal }) {
  const { isAdmin, loading: adminLoading, error: adminError, login: loginAdmin, logout: logoutAdmin } = useAdminAuth();
  const [adminInputPass, setAdminInputPass] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedImageModal, setSelectedImageModal] = useState(null);

  // Formulario nueva publicación
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newSize, setNewSize] = useState('Mediano');
  const [newHealth, setNewHealth] = useState('');
  const [uploadedBase64, setUploadedBase64] = useState('');
  const [formError, setFormError] = useState('');

  // Datos usuario
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
  const [newCommentText, setNewCommentText] = useState({});
  const [activeReactions, setActiveReactions] = useState({});

  // Validar Contraseña Admin
  const handleAdminLogin = (e) => {
    e.preventDefault();
    loginAdmin(adminInputPass).then((success) => {
      if (success) {
        setShowAdminModal(false);
        setAdminInputPass('');
      }
    });
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setAdminInputPass('');
  };

  // Manejar selección de archivo local (PC / Celular)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024 && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || file.size > 2 * 1024 * 1024 || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => setUploadedBase64(reader.result);
    reader.readAsDataURL(file);
  };

  // Alternar estado de Adopción
  const toggleAdoptedStatus = (animal) => {
    const isCurrentlyAdopted = animal.status === 'Adoptado' || animal.adopted;
    const updatedData = {
      ...animal,
      adopted: !isCurrentlyAdopted,
      status: isCurrentlyAdopted ? 'En Adopción' : 'Adoptado'
    };
    if (onUpdateAnimal) {
      onUpdateAnimal(animal.id, updatedData);
    }
  };

  // Crear Publicación local desde el componente
  const handleCreatePost = (e) => {
    e.preventDefault();
    
    if (!newName.trim() || !newAge.trim() || !newLocation.trim() || !newHealth.trim() || !uploadedBase64) {
      setFormError('Completá nombre, edad, ubicación, salud/vacunas y una foto.');
      return;
    }
    setFormError('');

    const newPost = {
      id: Date.now(),
      name: newName,
      age: newAge,
      size: newSize,
      health: newHealth,
      location: newLocation,
      status: 'En Adopción',
      images: [uploadedBase64],
      description: newDescription.trim(),
      reactions: { hearts: 0, paws: 0 },
      comments: []
    };

    if (onUpdateAnimal) {
      onUpdateAnimal(null, newPost);
    }
    
    // Resetear formulario
    setNewName('');
    setNewLocation('');
    setNewDescription('');
    setNewAge('');
    setNewSize('Mediano');
    setNewHealth('');
    setUploadedBase64('');
    setFormError('');
    setShowForm(false);
  };

  // Eliminar Comentario
  const handleDeleteComment = (animal, commentId) => {
    if (window.confirm('¿Eliminar este comentario?')) {
      const updatedComments = (animal.comments || []).filter(c => c.id !== commentId);
      onUpdateAnimal(animal.id, { ...animal, comments: updatedComments });
    }
  };

  // Reportar Comentario
  const handleReportComment = (animal, commentId) => {
    const updatedComments = (animal.comments || []).map(c => 
      c.id === commentId ? { ...c, reported: true } : c
    );
    onUpdateAnimal(animal.id, { ...animal, comments: updatedComments });
    alert('🚩 Comentario reportado para moderación.');
  };

  // Agregar Comentario
  const handleAddComment = (animal) => {
    const text = newCommentText[animal.id];
    if (!text || !text.trim()) return;

    const newComment = {
      id: Date.now(),
      user: userName.trim() || 'Anónimo',
      text: text.trim(),
      reported: false
    };

    const updatedComments = [newComment, ...(animal.comments || [])];
    onUpdateAnimal(animal.id, { ...animal, comments: updatedComments });
    setNewCommentText({ ...newCommentText, [animal.id]: '' });
  };

  const handleReaction = (animal, reaction) => {
    const reactions = { ...(animal.reactions || {}) };
    const reactionKey = `${animal.id}:${reaction}`;
    const isActive = Boolean(activeReactions[reactionKey]);
    reactions[reaction] = Math.max(0, (reactions[reaction] || 0) + (isActive ? -1 : 1));
    setActiveReactions((current) => ({ ...current, [reactionKey]: !isActive }));
    onUpdateAnimal(animal.id, { ...animal, reactions });
  };

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto', padding: '16px', fontFamily: 'sans-serif' }}>
      
      {/* Barra de Usuario y Admin */}
      <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b' }}>Tu nombre para comentar:</label>
          <input
            type="text"
            placeholder="Ej: María"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              localStorage.setItem('userName', e.target.value);
            }}
            style={{ display: 'block', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '2px' }}
          />
        </div>

        <div>
          {isAdmin ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: '#dcfce7', color: '#15803d', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={14} /> Moderador Activo
              </span>
              <button onClick={() => { logoutAdmin(); setShowForm(false); }} style={{ background: '#f1f5f9', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>Salir del modo admin</button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdminModal(true)}
              style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
            >
              🔒 Modo Admin
            </button>
          )}
        </div>
      </div>

      {/* Modal Admin */}
      {showAdminModal && (
        <div onMouseDown={(e) => { if (e.target === e.currentTarget) closeAdminModal(); }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div onMouseDown={(e) => e.stopPropagation()} style={{ background: '#fff', padding: '24px', borderRadius: '16px', maxWidth: '400px', width: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Acceso Administrador</h3>
              <button type="button" aria-label="Cerrar acceso administrador" onClick={closeAdminModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAdminLogin}>
              <input
                type="password"
                placeholder="Contraseña..."
                value={adminInputPass}
                onChange={(e) => setAdminInputPass(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '14px', boxSizing: 'border-box' }}
              />
              {adminError && <p style={{ color: '#dc2626', fontSize: '0.8rem', margin: '-6px 0 10px' }}>{adminError}</p>}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={closeAdminModal} style={{ flex: 1, background: '#e2e8f0', color: '#1e293b', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" disabled={adminLoading} style={{ flex: 1, background: '#16a34a', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {adminLoading ? 'Validando...' : 'Ingresar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.3rem' }}>Historias de Rescate ({animals.length})</h2>
        <AdminAuthGuard isAdmin={isAdmin} fallback={<span style={{ color: '#64748b', fontSize: '0.78rem' }}>Ingresá como admin para publicar</span>}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Publicar Rescatado
          </button>
        </AdminAuthGuard>
      </div>

      {/* Formulario Corregido */}
      {showForm && isAdmin && (
        <form onSubmit={handleCreatePost} style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>Registrar nuevo animalito</h3>
          <input type="text" placeholder="Nombre del animal" value={newName} onChange={(e) => setNewName(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input type="text" placeholder="Edad o etapa (Ej: 2 años)" value={newAge} onChange={(e) => setNewAge(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
            <select value={newSize} onChange={(e) => setNewSize(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}><option>Pequeño</option><option>Mediano</option><option>Grande</option></select>
          </div>
          <input type="text" placeholder="Ubicación (Ej: Posadas, Misiones)" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
          <input type="text" placeholder="Salud y vacunas (Ej: vacunado, castrado)" value={newHealth} onChange={(e) => setNewHealth(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
          <textarea placeholder="Historia del rescate..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '70px' }} required />

          {/* Carga de Imagen */}
          <div onDragOver={(e) => e.preventDefault()} onDrop={handleFileDrop} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Upload size={14} /> Seleccionar archivo desde tu dispositivo:
            </label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload}
              style={{ fontSize: '0.8rem', color: '#334155' }}
            />

            {uploadedBase64 && (
              <div style={{ marginTop: '4px', fontSize: '0.75rem', color: '#16a34a', fontWeight: 'bold' }}>
                ✓ Imagen cargada correctamente desde dispositivo.
              </div>
            )}

            {uploadedBase64 && <img src={uploadedBase64} alt="Vista previa del animal" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '8px' }} />}
          </div>

          {formError && <p style={{ color: '#dc2626', fontSize: '0.8rem', margin: 0 }}>{formError}</p>}
          <button type="submit" style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>Guardar y Publicar</button>
        </form>
      )}

      {/* Lista de Tarjetas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {animals.map((animal) => {
          const isAdopted = animal.status === 'Adoptado' || animal.adopted;

          // Normalización de Imágenes
          const rawImages = animal.images && animal.images.length > 0 
            ? animal.images 
            : (animal.image ? [animal.image] : (animal.imageUrl ? [animal.imageUrl] : []));
          
          const imagesList = Array.isArray(rawImages)
            ? rawImages.filter(img => img && typeof img === 'string' && img.trim() !== '')
            : [];

          return (
            <div 
              key={animal.id} 
              style={{ 
                position: 'relative',
                background: '#ffffff', 
                borderRadius: '16px', 
                border: isAdopted ? '2px solid #86efac' : '1px solid #e2e8f0', 
                overflow: 'hidden', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'all 0.3s ease'
              }}
            >
              
              {/* Banner Flotante de Adoptado */}
              {isAdopted && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  zIndex: 20,
                  background: '#16a34a',
                  color: '#ffffff',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  boxShadow: '0 4px 10px rgba(22, 163, 74, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <CheckCircle size={16} /> ¡ADOPTADO!
                </div>
              )}

              {/* Cabecera */}
              <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isAdopted ? '#f0fdf4' : '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.05rem' }}>{animal.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <MapPin size={12} /> {animal.location || 'Posadas, Misiones'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: isAdopted ? '110px' : '0px' }}>
                  <span style={{ 
                    background: isAdopted ? '#dcfce7' : '#fef3c7', 
                    color: isAdopted ? '#15803d' : '#b45309', 
                    padding: '4px 10px', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold' 
                  }}>
                    {isAdopted ? 'Adoptado' : (animal.status || 'En Adopción')}
                  </span>

                  {isAdmin && onDeleteAnimal && (
                    <button onClick={() => onDeleteAnimal(animal.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Galería de Imágenes */}
              <div style={{ 
                padding: '12px 16px', 
                background: isAdopted ? '#f8fafc' : '#f1f5f9',
                filter: isAdopted ? 'blur(1.5px) opacity(0.7)' : 'none',
                transition: 'filter 0.3s ease'
              }}>
                {imagesList.length > 0 ? (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: `repeat(${Math.min(imagesList.length, 3)}, minmax(0, 1fr))`, 
                    gap: '8px', 
                    justifyContent: 'center' 
                  }}>
                    {imagesList.map((img, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedImageModal(img)}
                        style={{ 
                          position: 'relative', 
                          height: '220px', 
                          borderRadius: '10px', 
                          overflow: 'hidden', 
                          cursor: 'pointer',
                          border: '1px solid #cbd5e1',
                          background: '#000'
                        }}
                      >
                        <img 
                          src={img} 
                          alt={animal.name} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            transition: 'transform 0.2s ease-in-out'
                          }} 
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600';
                          }}
                          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: '6px',
                          right: '6px',
                          background: 'rgba(0,0,0,0.6)',
                          color: '#fff',
                          borderRadius: '50%',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <ZoomIn size={12} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#e2e8f0',
                    borderRadius: '10px',
                    color: '#64748b',
                    fontSize: '0.85rem',
                    gap: '6px'
                  }}>
                    <ImageOff size={16} /> Sin imagen disponible
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div style={{ padding: '16px', filter: isAdopted ? 'opacity(0.85)' : 'none' }}>
                
                {/* Botón para Tildar como Adoptado */}
                <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                  {animal.phone && (animal.status === 'Animal perdido' || animal.status === 'Perdido') && (
                    <a href={`https://wa.me/${String(animal.phone).replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ marginRight: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e8f5e9', color: '#287d3c', padding: '6px 10px', borderRadius: '9px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      <MessageCircle size={14} /> Contactar por WhatsApp
                    </a>
                  )}
                  <button
                    onClick={() => toggleAdoptedStatus(animal)}
                    style={{
                      background: isAdopted ? '#f1f5f9' : '#16a34a',
                      color: isAdopted ? '#475569' : '#ffffff',
                      border: isAdopted ? '1px solid #cbd5e1' : 'none',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: isAdopted ? 'none' : '0 2px 6px rgba(22, 163, 74, 0.3)'
                    }}
                  >
                    <CheckCircle size={14} />
                    {isAdopted ? 'Cambiar a En Adopción' : '🏠 ¡Ya fue Adoptado!'}
                  </button>
                </div>

                <p style={{ margin: '0 0 12px 0', color: '#334155', fontSize: '0.88rem', lineHeight: '1.45', whiteSpace: 'pre-line' }}>{animal.description}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }} aria-label="Reacciones">
                  {[['heart', '❤️'], ['sad', '🥺'], ['pray', '🙏'], ['paws', '🐾'], ['home', '🏠']].map(([reaction, emoji]) => (
                    <button
                      key={reaction}
                      type="button"
                      onClick={() => handleReaction(animal, reaction)}
                      aria-label={`Reaccionar con ${emoji}`}
                      style={{ background: activeReactions[`${animal.id}:${reaction}`] ? '#fef2f2' : '#fff', border: activeReactions[`${animal.id}:${reaction}`] ? '1px solid #fca5a5' : '1px solid #e2e8f0', borderRadius: '18px', padding: '5px 9px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>{emoji}</span><small>{animal.reactions?.[reaction] || 0}</small>
                    </button>
                  ))}
                  <span style={{ color: '#64748b', fontSize: '0.78rem' }}><Heart size={14} fill="#ef4444" color="#ef4444" /> Apoyá esta historia</span>
                </div>

                {/* Comentarios */}
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#64748b' }}>
                    Comentarios ({animal.comments ? animal.comments.length : 0})
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                    {(animal.comments || []).map((c) => (
                      <div key={c.id} style={{ fontSize: '0.8rem', background: c.reported ? '#fef2f2' : '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <strong style={{ color: '#0f172a' }}>{c.user}: </strong>
                          <span style={{ color: '#475569' }}>{c.text}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button onClick={() => handleReportComment(animal, c.id)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                            <Flag size={12} />
                          </button>
                          {isAdmin && (
                            <button onClick={() => handleDeleteComment(animal, c.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '4px', borderRadius: '4px', cursor: 'pointer' }}>
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="text"
                      placeholder="Escribí un comentario..."
                      value={newCommentText[animal.id] || ''}
                      onChange={(e) => setNewCommentText({ ...newCommentText, [animal.id]: '' + e.target.value })}
                      style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    />
                    <button onClick={() => handleAddComment(animal)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}>
                      <Send size={14} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Zoom Foto */}
      {selectedImageModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '16px' }} onClick={() => setSelectedImageModal(null)}>
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img src={selectedImageModal} alt="Expandida" style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', objectFit: 'contain' }} />
            <span style={{ color: '#fff', fontSize: '0.8rem', textAlign: 'center', display: 'block', marginTop: '8px', opacity: 0.8 }}>Haz clic en cualquier parte para cerrar</span>
          </div>
        </div>
      )}

    </div>
  );
}