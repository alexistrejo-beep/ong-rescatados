import React, { useState } from 'react';
import { Heart, Trophy, Trash2, CheckCircle, MessageSquare, Sparkles } from 'lucide-react';

export default function AnimalGallery({ animals, onUpdateAnimal, onDeleteAnimal, onAddStory }) {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [storyText, setStoryText] = useState('');
  const [awardTitle, setAwardTitle] = useState('¡El Rey de la Casa! 👑');

  const handleAdopt = (id) => {
    onUpdateAnimal(id, { adopted: true });
  };

  const handleAddStorySubmit = (e) => {
    e.preventDefault();
    if (!storyText.trim() || !selectedAnimal) return;

    const newStory = {
      id: Date.now(),
      date: new Date().toLocaleDateString('es-AR'),
      text: storyText,
      award: awardTitle
    };

    const currentStories = selectedAnimal.stories || [];
    onUpdateAnimal(selectedAnimal.id, {
      stories: [newStory, ...currentStories],
      adopted: true // Al publicar un seguimiento feliz, se asume adoptado
    });

    setStoryText('');
    setSelectedAnimal(null);
  };

  if (animals.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Aún no hay animalitos registrados en el refugio.</p>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Ve a la pestaña **Reportar** para publicar el primero.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ color: '#166534', margin: 0, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🐾 Animalitos en el Refugio y Historias de Éxito
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {animals.map((animal) => (
          <div
            key={animal.id}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: animal.adopted ? '2px solid #16a34a' : '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              position: 'relative'
            }}
          >
            {/* Badge de Adoptado */}
            {animal.adopted && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: '#16a34a',
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                zIndex: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}>
                <Trophy size={14} color="#fef08a" /> ¡ADOPTADO!
              </div>
            )}

            {/* Imagen del Animal */}
            {animal.image && (
              <img
                src={animal.image}
                alt={animal.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
            )}

            <div style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '1.2rem' }}>
                {animal.name || 'Sin nombre'}
              </h3>
              <p style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '0.9rem' }}>
                {animal.description}
              </p>

              {/* Botones de Acción */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {!animal.adopted ? (
                  <button
                    onClick={() => handleAdopt(animal.id)}
                    style={{
                      flex: 1,
                      background: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <CheckCircle size={15} /> Marcar Adoptado
                  </button>
                ) : null}

                <button
                  onClick={() => setSelectedAnimal(animal)}
                  style={{
                    flex: 1,
                    background: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    padding: '8px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Sparkles size={15} color="#d97706" /> Seguimiento / Premio
                </button>

                <button
                  onClick={() => onDeleteAnimal(animal.id)}
                  style={{
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    padding: '8px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                  title="Eliminar publicación"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Historias / Premios publicados */}
              {animal.stories && animal.stories.length > 0 && (
                <div style={{ marginTop: '12px', background: '#f8fafc', padding: '10px', borderRadius: '10px', borderLeft: '3px solid #d97706' }}>
                  <strong style={{ fontSize: '0.8rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Trophy size={14} /> {animal.stories[0].award}
                  </strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#334155', italic: 'true' }}>
                    "{animal.stories[0].text}"
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Formulario para Agregar Seguimiento y Premio */}
      {selectedAnimal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 1000
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '450px',
            width: '100%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ marginTop: 0, color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy color="#d97706" /> Publicar Seguimiento para {selectedAnimal.name}
            </h3>

            <form onSubmit={handleAddStorySubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                  Premio / Título de Transformación:
                </label>
                <select
                  value={awardTitle}
                  onChange={(e) => setAwardTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="¡El Rey de la Casa! 👑">¡El Rey de la Casa! 👑</option>
                  <option value="¡De Abandonado a Consentido! 🐾">¡De Abandonado a Consentido! 🐾</option>
                  <option value="¡Graduado del Refugio! 🎓">¡Graduado del Refugio! 🎓</option>
                  <option value="¡Amor Infinito Encontrado! ❤️">¡Amor Infinito Encontrado! ❤️</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}>
                  Escribe la historia o actualización de cómo vive hoy:
                </label>
                <textarea
                  rows="4"
                  placeholder="Ej: Braulio dejó de ser un abandonado, ¡ahora duerme en el sillón y es el rey de la casa!"
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedAnimal(null)}
                  style={{ flex: 1, padding: '10px', background: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', background: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Publicar Premio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}