import { useState } from 'react';
import { Heart, Send, ShoppingBag, Calendar, ExternalLink, Stethoscope, Utensils } from 'lucide-react';
import DonationCard from './DonationCard';

export default function DonationSection() {
  const [method, setMethod] = useState('monthly'); // 'monthly' o 'transfer'
  const [frequency, setFrequency] = useState('monthly');
  const [selectedAmount, setSelectedAmount] = useState('5000');
  // 🔗 Tus links reales de Ualá Bis ya integrados
  const monthlyLinks = {
    '2000': 'https://pagar.ualabis.com.ar/order/8713b03df846b9dca73a1c05df2367d72107cd1df9e396db',
    '5000': 'https://pagar.ualabis.com.ar/order/5049362176ddabfd9306859e62eae6aaba73671666172c42',
    '10000': 'https://pagar.ualabis.com.ar/order/f1e1487e774ae4a81525a93ba138a0bbd9e50b423508f4ec'
  };

  const impactCards = [
    { icon: <Utensils size={20} />, title: 'Alimento', text: 'Una ración nutritiva para recuperar fuerzas.' },
    { icon: <Stethoscope size={20} />, title: 'Atención médica', text: 'Vacunas, curaciones y tratamientos urgentes.' },
    { icon: <Heart size={20} />, title: 'Una segunda oportunidad', text: 'Tránsito, abrigo y tiempo para volver a confiar.' }
  ];

  return (
    <section style={{ maxWidth: '850px', margin: '0 auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Encabezado */}
      <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)', border: '1px solid #bbf7d0', borderRadius: '20px', padding: '28px 20px' }}>
        <div style={{ background: '#ffffff', color: '#ef4444', display: 'inline-flex', padding: '12px', borderRadius: '50%', marginBottom: '8px', boxShadow: '0 4px 12px rgba(22,101,52,0.12)' }}>
          <Heart size={28} />
        </div>
        <h2 style={{ margin: '4px 0 8px', color: '#14532d', fontSize: '1.65rem' }}>Una huella pequeña puede cambiar toda una vida</h2>
        <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: '1.55' }}>
          Cada aporte brinda comida, refugio y atención médica a un animal indefenso. Gracias a vos, un rescate puede convertirse en un hogar y una historia difícil, en una segunda oportunidad.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
        {impactCards.map((item) => (
          <div key={item.title} style={{ background: '#fffaf5', border: '1px solid #ecd8cb', borderRadius: '14px', padding: '14px', color: '#d96b43' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontWeight: 'bold' }}>{item.icon} {item.title}</div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', lineHeight: '1.4' }}>{item.text}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', background: '#f2dfd2', padding: '4px', borderRadius: '12px' }}>
        {['monthly', 'once'].map((option) => (
          <button key={option} onClick={() => setFrequency(option)} style={{ flex: 1, border: 'none', padding: '10px', borderRadius: '9px', background: frequency === option ? '#ffffff' : 'transparent', color: frequency === option ? '#d96b43' : '#806b62', fontWeight: 'bold', cursor: 'pointer' }}>
            {option === 'monthly' ? 'Donación mensual' : 'Donación única'}
          </button>
        ))}
      </div>

      {/* Selector de Método de Pago */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#f2dfd2', padding: '4px', borderRadius: '12px' }}>
        <button
          onClick={() => setMethod('monthly')}
          style={{
            border: 'none',
            padding: '10px',
            borderRadius: '10px',
            background: method === 'monthly' ? '#ffffff' : 'transparent',
            color: method === 'monthly' ? '#4a2e2b' : '#806b62',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Calendar size={16} color="#d96b43" /> Apadrinar / Donar
        </button>
        <button
          onClick={() => setMethod('transfer')}
          style={{
            border: 'none',
            padding: '10px',
            borderRadius: '10px',
            background: method === 'transfer' ? '#ffffff' : 'transparent',
            color: method === 'transfer' ? '#4a2e2b' : '#806b62',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Send size={16} color="#d96b43" /> Transferencia / Alias
        </button>
      </div>

      {/* VISTA 1: Donación Directa por Link Ualá Bis */}
      {method === 'monthly' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#8f4935', display: 'flex', alignItems: 'center', gap: '8px' }}>
            💚 Convertite en Padrino o Madrina
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#64748b' }}>
            {frequency === 'monthly' ? 'Tu ayuda mensual nos permite planificar alimento y tratamientos con tranquilidad.' : 'Elegí un aporte único para acompañar una urgencia o necesidad puntual.'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
            {['2000', '5000', '10000'].map((amount) => (
              <button key={amount} type="button" onClick={() => setSelectedAmount(amount)} style={{ border: selectedAmount === amount ? '2px solid #16a34a' : '1px solid #bbf7d0', background: selectedAmount === amount ? '#dcfce7' : '#f0fdf4', color: '#166534', padding: '10px 6px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>${Number(amount).toLocaleString('es-AR')}</button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { amount: '2000', label: '$2.000', desc: 'Aporta 1 kg de alimento balanceado' },
              { amount: '5000', label: '$5.000', desc: 'Cubre vacunas y desparasitación' },
              { amount: '10000', label: '$10.000', desc: 'Financia atenciones médicas y remedios' }
            ].map((plan) => (
              <a
                key={plan.amount}
                href={monthlyLinks[plan.amount]}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: plan.amount === selectedAmount ? '#dcfce7' : '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#14532d'
                }}
              >
                <div>
                  <strong style={{ fontSize: '1rem', display: 'block' }}>{plan.label}</strong>
                  <span style={{ fontSize: '0.78rem', color: '#166534' }}>{plan.desc}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#16a34a', color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  Donar <ExternalLink size={14} />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 2: Transferencia Bancaria Directa */}
      {method === 'transfer' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={18} color="#2563eb" /> Transferencia directa (Ualá / Bancos)
          </h3>
          <DonationCard />

          {/* Tip de Transferencia Programada */}
          <div style={{ marginTop: '14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '10px 12px', fontSize: '0.78rem', color: '#1e3a8a' }}>
            💡 <strong>Tip:</strong> Desde la app de tu banco o billetera virtual podés elegir <em>"Programar transferencia mensual"</em> hacia nuestro Alias para donar automáticamente todos los meses.
          </div>
        </div>
      )}

      {/* BLOQUE: Destino del dinero */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={18} color="#16a34a" /> Transparencia: ¿Qué compramos?
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#166534' }}>
            <span>🥣 1 kg de alimento balanceado</span>
            <strong>$2.000</strong>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#166534' }}>
            <span>💉 Vacunas y desparasitación</span>
            <strong>$5.000</strong>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#166534' }}>
            <span>🏥 Consulta / Medicamentos</span>
            <strong>$10.000</strong>
          </div>
        </div>
      </div>

    </section>
  );
}