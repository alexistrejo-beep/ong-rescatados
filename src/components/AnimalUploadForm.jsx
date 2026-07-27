import React, { useState } from 'react';
import { Camera, MapPin, Send, Phone } from 'lucide-react';

export default function AnimalUploadForm({ onAddAnimal }) {
  const [form, setForm] = useState({
    name: '',
    type: 'Perro',
    location: '',
    phone: '',
    imagePreview: null
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, imagePreview: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.imagePreview) return alert('Por favor sube una foto del animal.');
    
    onAddAnimal({ ...form, id: Date.now() });
    setForm({ name: '', type: 'Perro', location: '', phone: '', imagePreview: null });
    alert('¡Animal registrado con éxito!');
  };

  return (
    <section style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
      marginBottom: '32px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '12px', color: '#2563eb' }}>
          <Camera size={24} />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#1e293b' }}>Reportar Animal Encontrado</h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>Completa los datos para que te contacten</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
        
        {/* Nombre y Especie */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
              Nombre / Referencia
            </label>
            <input
              type="text"
              placeholder="Ej: Manchitas"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
              Especie
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', boxSizing: 'border-box' }}
            >
              <option value="Perro">🐶 Perro</option>
              <option value="Gato">🐱 Gato</option>
            </select>
          </div>
        </div>

        {/* Teléfono de contacto */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
            Teléfono / WhatsApp de contacto
          </label>
          <div style={{ position: 'relative' }}>
            <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            <input
              type="tel"
              placeholder="Ej: 3764123456 (sin 0 ni 15)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              style={{ width: '100%', padding: '12px 12px 12px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Ubicación */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
            Ubicación / Barrio
          </label>
          <div style={{ position: 'relative' }}>
            <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            <input
              type="text"
              placeholder="Ej: Posadas, Misiones"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
              style={{ width: '100%', padding: '12px 12px 12px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Carga de Foto */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
            Foto del Animal
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            style={{ fontSize: '0.9rem', color: '#64748b' }}
          />
          {form.imagePreview && (
            <div style={{ marginTop: '12px', borderRadius: '12px', overflow: 'hidden', maxHeight: '180px' }}>
              <img src={form.imagePreview} alt="Previsualización" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '14px',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          <Send size={18} /> Publicar para Buscar Refugio
        </button>
      </form>
    </section>
  );
}