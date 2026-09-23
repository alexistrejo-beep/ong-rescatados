import { useState } from 'react';
import { Camera, MapPin, Send, Phone } from 'lucide-react';

export default function AnimalUploadForm({ onAddAnimal }) {
  const [form, setForm] = useState({
    name: '',
    type: 'Perro',
    location: '',
    phone: '',
    lostDate: '',
    description: '',
    imagePreview: null
  });
  const [toast, setToast] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validación de peso máximo de imagen (2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast('⚠️ La imagen es demasiado pesada. Elige una menor a 2MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, imagePreview: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.imagePreview) {
      showToast('⚠️ Por favor sube una foto del animal.');
      return;
    }

    setIsSubmitting(true);
    try {
      onAddAnimal({
        ...form,
        images: [form.imagePreview],
        image: form.imagePreview,
        species: form.type,
        status: 'Animal perdido',
        reactions: { heart: 0, paws: 0, sad: 0, party: 0 },
        comments: [],
        reports: 0
      });
      setForm({ name: '', type: 'Perro', location: '', phone: '', lostDate: '', description: '', imagePreview: null });
      showToast('✨ ¡Aviso de animal perdido publicado!');
    } catch {
      showToast('No se pudo publicar el aviso. Intentá nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
      marginBottom: '32px',
      position: 'relative'
    }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
          zIndex: 1000,
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '12px', color: '#2563eb' }}>
          <Camera size={24} />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#1e293b' }}>Reportar Animal Perdido</h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>Publicá un aviso para ayudar a encontrarlo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
          <div>
            <label htmlFor="animal-name" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
              Nombre / Referencia
            </label>
            <input
              id="animal-name"
              type="text"
              placeholder="Ej: Manchitas"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label htmlFor="animal-type" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
              Especie
            </label>
            <select
              id="animal-type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', boxSizing: 'border-box' }}
            >
              <option value="Perro">🐶 Perro</option>
              <option value="Gato">🐱 Gato</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="animal-phone" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
            Teléfono / WhatsApp de contacto
          </label>
          <div style={{ position: 'relative' }}>
            <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            <input
              id="animal-phone"
              type="tel"
              placeholder="Ej: 3764123456"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              style={{ width: '100%', padding: '12px 12px 12px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label htmlFor="lost-date" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>Fecha de pérdida</label>
            <input id="lost-date" type="date" value={form.lostDate} onChange={(e) => setForm({ ...form, lostDate: e.target.value })} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label htmlFor="lost-description" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>Descripción</label>
            <textarea id="lost-description" placeholder="Señas particulares, collar, etc." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required style={{ width: '100%', minHeight: '44px', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>
        </div>

        <div>
          <label htmlFor="animal-location" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
            Ubicación / Barrio
          </label>
          <div style={{ position: 'relative' }}>
            <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            <input
              id="animal-location"
              type="text"
              placeholder="Ej: Posadas, Misiones"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
              style={{ width: '100%', padding: '12px 12px 12px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="animal-photo" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
            Foto del Animal (Máximo 2MB)
          </label>
          <input
            id="animal-photo"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            aria-label="Cargar foto del animal"
            style={{ fontSize: '0.9rem', color: '#64748b' }}
          />
          {form.imagePreview && (
            <div style={{ marginTop: '12px', borderRadius: '12px', overflow: 'hidden', maxHeight: '180px' }}>
              <img src={form.imagePreview} alt={`Previsualización de ${form.name || 'animal'}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>

        <button
          type="submit"
          aria-label="Publicar reporte de animal"
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
          <Send size={18} /> {isSubmitting ? 'Publicando...' : 'Publicar aviso'}
        </button>
      </form>
    </section>
  );
}