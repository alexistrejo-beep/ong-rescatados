import React, { useState, useEffect } from 'react';
import DonationSection from './components/DonationSection';
import AnimalUploadForm from './components/AnimalUploadForm';
import AnimalGallery from './components/AnimalGallery';
import Transparency from './components/Transparency';
import HuellitasSection from './components/HuellitasSection';
import { Heart, Home, Camera, ShieldCheck, Info } from 'lucide-react'; 

export default function App() {
  // Pestaña inicial por defecto
  const [activeTab, setActiveTab] = useState('conocenos');
  
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

  // Maneja tanto creación (id === null) como actualización
  const handleUpdateAnimal = (id, updatedData) => {
    if (!id) {
      setAnimals(prevAnimals => [updatedData, ...prevAnimals]);
    } else {
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

  // Colores de la app adaptados a la nueva estética gris minimalista
  const themeColors = {
    textHeader: '#27272a',
    textMuted: '#71717a',
    navBg: '#e4e4e7',
    navBtnActive: '#ffffff',
    navBtnTextActive: '#27272a',
    navBtnTextInactive: '#71717a'
  };

  return (
    <div style={{ 
      maxWidth: activeTab === 'conocenos' ? '1200px' : '800px', 
      margin: '0 auto', 
      padding: '16px', 
      fontFamily: "'Segoe UI', Roboto, system-ui, sans-serif",
      transition: 'max-width 0.3s ease'
    }}>
      
      {/* Header en tonos grises */}
      <header style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 4px 0', color: themeColors.textHeader, fontSize: '2rem', fontWeight: '700' }}>🐾 Huellitas de Amor</h1>
        <p style={{ margin: 0, color: themeColors.textMuted, fontSize: '0.95rem' }}>Rescates, refugio y donaciones transparentes</p>
      </header>

      {/* Menú de Navegación en tonos grises */}
      <nav style={{
        display: 'flex',
        gap: '8px',
        background: themeColors.navBg,
        padding: '6px',
        borderRadius: '16px',
        marginBottom: '24px',
        overflowX: 'auto'
      }}>
        {/* Botón: Conocenos */}
        <button
          onClick={() => setActiveTab('conocenos')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px 14px',
            border: 'none',
            borderRadius: '12px',
            background: activeTab === 'conocenos' ? themeColors.navBtnActive : 'transparent',
            color: activeTab === 'conocenos' ? themeColors.navBtnTextActive : themeColors.navBtnTextInactive,
            fontWeight: 'bold',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Info size={18} /> Conocenos
        </button>

        {/* Botón: Donar */}
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
            background: activeTab === 'donar' ? themeColors.navBtnActive : 'transparent',
            color: activeTab === 'donar' ? themeColors.navBtnTextActive : themeColors.navBtnTextInactive,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          <Heart size={18} /> Donar
        </button>

        {/* Botón: Transparencia */}
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
            background: activeTab === 'transparencia' ? themeColors.navBtnActive : 'transparent',
            color: activeTab === 'transparencia' ? themeColors.navBtnTextActive : themeColors.navBtnTextInactive,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          <ShieldCheck size={18} /> Transparencia
        </button>

        {/* Botón: Refugio */}
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
            background: activeTab === 'refugio' ? themeColors.navBtnActive : 'transparent',
            color: activeTab === 'refugio' ? themeColors.navBtnTextActive : themeColors.navBtnTextInactive,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          <Home size={18} /> Refugio ({animals.length})
        </button>

        {/* Botón: Reportar */}
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
            background: activeTab === 'reportar' ? themeColors.navBtnActive : 'transparent',
            color: activeTab === 'reportar' ? themeColors.navBtnTextActive : themeColors.navBtnTextInactive,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          <Camera size={18} /> Reportar
        </button>
      </nav>

      {/* Contenido Principal */}
      <main>
        {/* SOLUCIÓN AL PROBLEMA: Ahora le pasamos setActiveTab como prop al componente */}
        {activeTab === 'conocenos' && <HuellitasSection setActiveTab={setActiveTab} />}
        
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