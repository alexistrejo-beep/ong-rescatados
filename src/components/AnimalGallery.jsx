import React, { useState } from 'react';
import { Trophy, Trash2, CheckCircle, Sparkles, MessageCircle, Send, User, Flag, ChevronDown } from 'lucide-react';

export default function AnimalGallery({ animals, onUpdateAnimal, onDeleteAnimal }) {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('huellitas_username') || '');
  const [tempUsername, setTempUsername] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [storyText, setStoryText] = useState('');
  const [awardTitle, setAwardTitle] = useState('¡El Rey de la Casa! 👑');
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [visibleCount, setVisibleCount] = useState(5);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!tempUsername.trim()) return;
    localStorage.setItem('huellitas_username', tempUsername.trim());
    setCurrentUser(tempUsername.trim());
    showToast(`👤 Nombre guardado como @${tempUsername.trim()}`);
  };

  const handleReaction = (animal, reactionType) => {
    if (!currentUser) return showToast('⚠️ Ingresa un nombre de usuario arriba para reaccionar.');
    const currentReactions = animal.reactions || {};
    const count = (currentReactions[reactionType] || 0) + 1;
    onUpdateAnimal(animal.id, { reactions: { ...currentReactions, [reactionType]: count } });
  };

  const handleReportAnimal = (animal) => {
    const currentReports = (animal.reports || 0) + 1;
    onUpdateAnimal(animal.id, { reports: currentReports });
    if (currentReports >= 3) {
      showToast('🚩 Publicación ocultada por recibir múltiples reportes.');
    } else {
      showToast('🚩 Reporte enviado. Gracias por ayudar a moderar.');
    }
  };

  const handleReportComment = (animal, commentId) => {
    const updatedComments = (animal.comments || []).map((c) => {
      if (c.id === commentId) {
        return { ...c, reports: (c.reports || 0) + 1 };
      }
      return c;
    });
    onUpdateAnimal(animal.id, { comments: updatedComments });
    showToast('🚩 Comentario reportado.');
  };

  const handleAddComment = (e, animal) => {
    e.preventDefault();
    const commentText = commentInputs[animal.id];
    if (!commentText || !commentText.trim()) return;
    if (!currentUser) return showToast('⚠️ Ingresa tu usuario arriba para comentar.');

    const newComment = {
      id: Date.now(),
      user: currentUser,
      text: commentText.trim(),
      date: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      reports: 0
    };

    onUpdateAnimal(animal.id, { comments: [...(animal.comments || []), newComment] });
    setCommentInputs({ ...commentInputs, [animal.id]: '' });
    showToast('💬 Comentario publicado');
  };

  const toggleExpandComments = (animalId) => {
    setExpandedComments((prev) => ({ ...prev, [animalId]: !prev[animalId] }));
  };

  const visibleAnimals = animals.filter((a) => (a.reports || 0) < 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '10px 16px',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
          zIndex: 1000,
          fontSize: '0.85rem',
          fontWeight: 'bold'
        }}>
          {toast}
        </div>
      )}

      {/* Registro de Usuario */}
      <div style={{
        background: '#ffffff',
        padding: '12px 16px',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#dcfce7', color: '#15803d', padding: '6px', borderRadius: '50%' }}>
              <User size={16} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Usuario activo:</span>
              <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>@{currentUser}</strong>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveUser} style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
            <User size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Escribe tu nombre para interactuar..."
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              aria-label="Nombre de usuario para interactuar"
              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem' }}
              required
            />
            <button
              type="submit"
              aria-label="Guardar usuario"
              style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Guardar
            </button>
          </form>
        )}

        {currentUser && (
          <button
            onClick={() => { localStorage.removeItem('huellitas_username'); setCurrentUser(''); }}
            aria-label="Cambiar nombre de usuario"
            style={{ background: 'transparent', border: 'none', color: '#dc2626', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Cambiar nombre
          </button>
        )}
      </div>

      <h2 style={{ color: '#166534', margin: 0, fontSize: '1.2rem' }}>
        🐾 Comunidad y Rescatados
      </h2>

      {visibleAnimals.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#64748b', padding: '30px 16px', background: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
          <p style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: '#334155' }}>Aún no hay publicaciones visibles.</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem' }}>¡Sé el primero en reportar un animal en la pestaña "Reportar"!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {visibleAnimals.slice(0, visibleCount).map((animal) => {
            const reactions = animal.reactions || {};
            const activeComments = (animal.comments || []).filter((c) => (c.reports || 0) < 3);
            const isExpanded = expandedComments[animal.id];
            const commentsToDisplay = isExpanded ? activeComments : activeComments.slice(-2);

            return (
              <article
                key={animal.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                {/* Cabecera */}
                <div style={{ padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>{animal.name || 'Sin nombre'}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>📍 {animal.location || 'Sin ubicación'}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {animal.adopted && (
                      <span style={{ background: '#16a34a', color: '#fff', padding: '3px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Trophy size={11} color="#fef08a" /> ADOPTADO
                      </span>
                    )}

                    {/* Botón de reporte MÁS NOTORIO */}
                    <button
                      onClick={() => handleReportAnimal(animal)}
                      aria-label="Reportar publicación inadecuada"
                      title="Reportar contenido inapropiado"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}
                    >
                      <Flag size={13} color="#dc2626" /> Reportar
                    </button>
                  </div>
                </div>

                {/* Imagen reducida en tamaño vertical */}
                {(animal.imagePreview || animal.image) && (
                  <img
                    src={animal.imagePreview || animal.image}
                    alt={`Foto de ${animal.name || 'animal'}`}
                    style={{ width: '100%', maxHeight: '220px', objectFit: 'cover' }}
                  />
                )}

                {/* Reacciones compactas */}
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '6px', background: '#fafafa' }}>
                  {[
                    { type: 'heart', emoji: '❤️' },
                    { type: 'paws', emoji: '🐾' },
                    { type: 'sad', emoji: '🥺' },
                    { type: 'party', emoji: '🎉' }
                  ].map(({ type, emoji }) => (
                    <button
                      key={type}
                      onClick={() => handleReaction(animal, type)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        padding: '4px 8px',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <span>{emoji}</span>
                      <strong style={{ fontSize: '0.75rem', color: '#475569' }}>{reactions[type] || 0}</strong>
                    </button>
                  ))}
                </div>

                {/* Contenido principal */}
                <div style={{ padding: '12px' }}>
                  <p style={{ margin: '0 0 10px 0', color: '#334155', fontSize: '0.88rem', lineHeight: '1.3' }}>
                    {animal.description}
                  </p>

                  <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    {!animal.adopted && (
                      <button
                        onClick={() => onUpdateAnimal(animal.id, { adopted: true })}
                        style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.78rem' }}
                      >
                        <CheckCircle size={12} style={{ verticalAlign: 'middle', marginRight: '3px' }} /> Adoptado
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedAnimal(animal)}
                      style={{ background: '#fffbeb', border: '1px solid #fcd34d', color: '#b45309', padding: '6px 10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.78rem' }}
                    >
                      <Sparkles size={12} style={{ verticalAlign: 'middle', marginRight: '3px' }} /> Premia
                    </button>

                    <button
                      onClick={() => onDeleteAnimal(animal.id)}
                      aria-label="Eliminar publicación"
                      style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', marginLeft: 'auto' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Historias / Premios */}
                  {(animal.stories || []).length > 0 && (
                    <div style={{ background: '#fffbeb', padding: '8px 10px', borderRadius: '8px', borderLeft: '3px solid #d97706', marginBottom: '10px' }}>
                      <strong style={{ color: '#b45309', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Trophy size={12} /> {animal.stories[0].award}
                      </strong>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#334155' }}>
                        "{animal.stories[0].text}"
                      </p>
                    </div>
                  )}

                  {/* Sección de Comentarios Compacta */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MessageCircle size={14} /> Comentarios ({activeComments.length})
                      </span>
                      {activeComments.length > 2 && (
                        <button
                          onClick={() => toggleExpandComments(animal.id)}
                          style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.75rem', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}
                        >
                          {isExpanded ? 'Ocultar' : `Ver +${activeComments.length - 2}`}
                        </button>
                      )}
                    </div>

                    {activeComments.length === 0 ? (
                      <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', margin: '4px 0' }}>
                        Sin comentarios aún. ¡Sé el primero!
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                        {commentsToDisplay.map((c) => (
                          <div key={c.id} style={{ background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <strong style={{ color: '#0f172a', marginRight: '4px' }}>@{c.user}:</strong>
                              <span style={{ color: '#334155' }}>{c.text}</span>
                            </div>
                            <button
                              onClick={() => handleReportComment(animal, c.id)}
                              aria-label="Reportar comentario"
                              title="Reportar este comentario"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                                background: '#fef2f2',
                                border: '1px solid #fecaca',
                                color: '#dc2626',
                                cursor: 'pointer',
                                padding: '2px 5px',
                                borderRadius: '4px',
                                fontSize: '0.68rem',
                                marginLeft: '6px'
                              }}
                            >
                              <Flag size={10} color="#dc2626" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Formulario de Comentario */}
                    <form onSubmit={(e) => handleAddComment(e, animal)} style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        placeholder={currentUser ? "Comentar..." : "Ingresa nombre arriba..."}
                        disabled={!currentUser}
                        value={commentInputs[animal.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [animal.id]: e.target.value })}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '16px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
                      />
                      <button
                        type="submit"
                        disabled={!currentUser}
                        aria-label="Enviar comentario"
                        style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: currentUser ? 'pointer' : 'not-allowed', opacity: currentUser ? 1 : 0.5 }}
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  </div>

                </div>
              </article>
            );
          })}

          {visibleAnimals.length > visibleCount && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '10px',
                borderRadius: '10px',
                fontWeight: 'bold',
                color: '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                fontSize: '0.85rem'
              }}
            >
              <ChevronDown size={16} /> Cargar más publicaciones
            </button>
          )}
        </div>
      )}

      {/* Modal para Premiar */}
      {selectedAnimal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', maxWidth: '400px', width: '100%' }}>
            <h3 style={{ marginTop: 0, color: '#166534', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.1rem' }}>
              <Trophy color="#d97706" size={20} /> Premio para {selectedAnimal.name}
            </h3>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!storyText.trim() || !selectedAnimal) return;
              const newStory = { id: Date.now(), date: new Date().toLocaleDateString('es-AR'), text: storyText, award: awardTitle, author: currentUser || 'Anónimo' };
              onUpdateAnimal(selectedAnimal.id, { stories: [newStory, ...(selectedAnimal.stories || [])], adopted: true });
              setStoryText('');
              setSelectedAnimal(null);
              showToast('🏆 ¡Premio registrado!');
            }}>
              <div style={{ marginBottom: '10px' }}>
                <label htmlFor="award-select" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>Premio:</label>
                <select id="award-select" value={awardTitle} onChange={(e) => setAwardTitle(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}>
                  <option value="¡El Rey de la Casa! 👑">¡El Rey de la Casa! 👑</option>
                  <option value="¡De Abandonado a Consentido! 🐾">¡De Abandonado a Consentido! 🐾</option>
                  <option value="¡Graduado del Refugio! 🎓">¡Graduado del Refugio! 🎓</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label htmlFor="award-text" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>Mensaje:</label>
                <textarea id="award-text" rows="3" placeholder="Escribe un mensaje..." value={storyText} onChange={(e) => setStoryText(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '0.85rem' }} required />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => setSelectedAnimal(null)} style={{ flex: 1, padding: '8px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: '8px', background: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}