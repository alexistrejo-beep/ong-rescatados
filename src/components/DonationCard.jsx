import { useState } from 'react';
import { Check, Copy, House, Share2, Soup, Stethoscope } from 'lucide-react';

const bankingData = [
  { key: 'alias', label: 'Alias', value: 'RESCATES.HUELLITAS', icon: <House size={18} /> },
  { key: 'cbu', label: 'CBU', value: '3840200500000029787630', icon: <Soup size={18} /> },
  { key: 'account', label: 'Número de cuenta', value: '38402000002978763', icon: <Stethoscope size={18} /> }
];

export default function DonationCard() {
  const [copiedField, setCopiedField] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  const copyText = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(''), 2000);
    } catch {
      setShareMessage('No se pudo copiar. Seleccioná el dato manualmente.');
    }
  };

  const shareBankingData = async () => {
    const message = bankingData.map(({ label, value }) => `${label}: ${value}`).join('\n');
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Datos para donar a Huellitas de Amor', text: message });
        setShareMessage('Datos listos para compartir.');
      } else {
        await navigator.clipboard.writeText(message);
        setShareMessage('Datos copiados al portapapeles.');
      }
      window.setTimeout(() => setShareMessage(''), 2500);
    } catch (error) {
      if (error.name !== 'AbortError') setShareMessage('No se pudieron compartir los datos.');
    }
  };

  return (
    <div style={{ background: '#fffaf5', border: '1px solid #edc4ad', borderRadius: '20px', padding: '16px', boxShadow: '0 12px 26px rgba(116, 66, 43, 0.1)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px', marginBottom: '14px', height: '130px' }}>
        <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=85&w=800" alt="Perro rescatado disfrutando un hogar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} />
        <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=85&w=500" alt="Gato rescatado descansando" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {bankingData.map(({ key, label, value, icon }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', background: '#ffffff', border: '1px solid #ecd8cb', borderRadius: '12px', padding: '10px 12px' }}>
            <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: '9px' }}>
              <span style={{ display: 'inline-flex', padding: '8px', color: '#d96b43', background: '#fff0e6', borderRadius: '10px' }}>{icon}</span>
              <span><span style={{ display: 'block', color: '#806b62', fontSize: '0.7rem', fontWeight: 'bold' }}>{label}</span><strong style={{ color: '#4a2e2b', fontSize: '0.9rem', wordBreak: 'break-all' }}>{value}</strong></span>
            </div>
            <button type="button" onClick={() => copyText(value, key)} aria-label={`Copiar ${label}`} title={`Copiar ${label}`} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '5px', background: copiedField === key ? '#5b8c5a' : '#d96b43', color: '#fff', border: 'none', padding: '7px 10px', borderRadius: '9px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>
              {copiedField === key ? <Check size={15} /> : <Copy size={15} />}
              {copiedField === key ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={shareBankingData} style={{ width: '100%', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#4a2e2b', color: '#fff', border: 'none', padding: '11px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
        <Share2 size={17} /> Compartir datos
      </button>
      {shareMessage && <p role="status" style={{ margin: '8px 0 0', color: '#166534', textAlign: 'center', fontSize: '0.78rem' }}>{shareMessage}</p>}
    </div>
  );
}