import React, { useState, useEffect } from 'react';
import DonationSection from './components/DonationSection';
import AnimalUploadForm from './components/AnimalUploadForm';
import AnimalGallery from './components/AnimalGallery';
import Transparency from './components/Transparency';
import { Heart, Home, Camera, ShieldCheck } from 'lucide-react';

export default function App() {
  // Pestaña inicial
  const [activeTab, setActiveTab] = useState('refugio');
  
  // Cargamos los animales guardados en el navegador (localStorage)
  const [animals, setAnimals] = useState(() => {
    const saved = localStorage.getItem('huellitas_animals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error al leer localStorage:", e);
        return [];
      }
    }
    // Animalito de ejemplo predeterminado
    return [
      {
        id: 1,
        name: 'Braulio',
        species: 'Perro',
        phone: '3764123456',
        location: 'Posadas, Misiones',
        description: 'Rescatado en la calle. Estaba muy flacuchento pero lleno de amor.',
        images: ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600'],
        date: '27/07/2026',
        adopted: true,
        stories: [
          {
            id: 101,
            date: '27/07/2026',
            award: '¡El Rey de la Casa! 👑',
            text: 'Braulio dejó de ser un abandonado, a ser el rey de la casa. ¡Le encanta dormir en la cama grande y jugar en el patio!'
          }
        ]
      }
    ];
  });

  // Guardar en localStorage cada vez que cambia la lista de animales
  useEffect(() => {
    localStorage.setItem('huellitas_animals', JSON.stringify(animals));
  }, [animals]);

  // Función que recibe los datos desde AnimalUploadForm.jsx
  const handleAddAnimal = (newAnimal) => {
    const animalWithDetails = {
      ...newAnimal,
      id: Date.now(),
      date: new Date().toLocaleDateString('es-AR'),
      adopted: false,
      stories: []
    };

    setAnimals(prev => [animalWithDetails, ...prev]);
    setActiveTab('refugio');
  };

  // FUNCIÓN CORREGIDA: Maneja tanto creación (id === null) como actualización
  const handleUpdateAnimal = (id, updatedData) => {
    if (!id) {
      // Si no viene ID, es una NUEVA publicación creada desde la galería
      setAnimals(prevAnimals => [updatedData, ...prevAnimals]);
    } else {
      // Si viene ID, actualizamos el registro existente (adopción, comentarios, etc.)
      setAnimals(prevAnimals =>
        prevAnimals.map(item => (item.id === id ? { ...item, ...updatedData } : item))
      );
    }
  };

  const handleDeleteAnimal = (id) => {
    if (window.confirm('¿Estás seguro de eliminar a este animalito de la lista?')) {
      setAnimals(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 4px 0', color: '#15803d', fontSize: '2rem' }}>🐾 Huellitas de Amor</h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>Rescates, refugio y donaciones transparentes</p>
      </header>

      {/* Menú de Navegación */}
      <nav style={{
        display: 'flex',
        gap: '8px',
        background: '#f1f5f9',
        padding: '6px',
        borderRadius: '16px',
        marginBottom: '24px',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveTab('donar')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px 14px',
            border: 'none',
            borderRadius: '12px',
            background: activeTab === 'donar' ? '#ffffff' : 'transparent',
            color: activeTab === 'donar' ? '#16a34a' : '#64748b',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          <Heart size={18} /> Donar
        </button>

        <button
          onClick={() => setActiveTab('transparencia')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px 14px',
            border: 'none',
            borderRadius: '12px',
            background: activeTab === 'transparencia' ? '#ffffff' : 'transparent',
            color: activeTab === 'transparencia' ? '#16a34a' : '#64748b',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          <ShieldCheck size={18} /> Transparencia
        </button>

        <button
          onClick={() => setActiveTab('refugio')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px 14px',
            border: 'none',
            borderRadius: '12px',
            background: activeTab === 'refugio' ? '#ffffff' : 'transparent',
            color: activeTab === 'refugio' ? '#16a34a' : '#64748b',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          <Home size={18} /> Refugio ({animals.length})
        </button>

        <button
          onClick={() => setActiveTab('reportar')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px 14px',
            border: 'none',
            borderRadius: '12px',
            background: activeTab === 'reportar' ? '#ffffff' : 'transparent',
            color: activeTab === 'reportar' ? '#16a34a' : '#64748b',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          <Camera size={18} /> Reportar
        </button>
      </nav>

      {/* Contenido Principal */}
      <main>
        {activeTab === 'donar' && <DonationSection />}
        {activeTab === 'transparencia' && <Transparency />}
        {activeTab === 'refugio' && (
          <AnimalGallery
            animals={animals}
            onUpdateAnimal={handleUpdateAnimal}
            onDeleteAnimal={handleDeleteAnimal}
          />
        )}
        {activeTab === 'reportar' && <AnimalUploadForm onAddAnimal={handleAddAnimal} />}
      </main>
    </div>
  );
}