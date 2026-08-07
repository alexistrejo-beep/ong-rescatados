import React, { useState } from 'react';
import { Copy, Check, Heart, Send, ShoppingBag, Calendar, ExternalLink } from 'lucide-react';

export default function DonationSection() {
  const [method, setMethod] = useState('monthly'); // 'monthly' o 'transfer'
  const [copiedField, setCopiedField] = useState('');

  // Datos de tu cuenta Ualá Bank S.A.U.
  const ualaData = {
    alias: 'RESCATES.HUELLITAS',
    cbu: '3840200500000029787630',
    banco: 'Ualá Bank S.A.U.'
  };

  // 🔗 Tus links reales de Ualá Bis ya integrados
  const monthlyLinks = {
    '2000': 'https://pagar.ualabis.com.ar/order/8713b03df846b9dca73a1c05df2367d72107cd1df9e396db',
    '5000': 'https://pagar.ualabis.com.ar/order/5049362176ddabfd9306859e62eae6aaba73671666172c42',
    '10000': 'https://pagar.ualabis.com.ar/order/f1e1487e774ae4a81525a93ba138a0bbd9e50b423508f4ec'
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2500);
  };

  return (
    <section style={{ maxWidth: '600px', margin: '0 auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Encabezado */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ background: '#fef2f2', color: '#ef4444', display: 'inline-flex', padding: '12px', borderRadius: '50%', marginBottom: '8px' }}>
          <Heart size={28} />
        </div>
        <h2 style={{ margin: '4px 0', color: '#0f172a', fontSize: '1.4rem' }}>Ayudanos a seguir salvando vidas</h2>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
          Tus donaciones se transforman de inmediato en alimento y atención médica.
        </p>
      </div>

      {/* Selector de Método de Pago */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#e2e8f0', padding: '4px', borderRadius: '12px' }}>
        <button
          onClick={() => setMethod('monthly')}
          style={{
            border: 'none',
            padding: '10px',
            borderRadius: '10px',
            background: method === 'monthly' ? '#ffffff' : 'transparent',
            color: method === 'monthly' ? '#0f172a' : '#64748b',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Calendar size={16} color="#16a34a" /> Apadrinar / Donar
        </button>
        <button
          onClick={() => setMethod('transfer')}
          style={{
            border: 'none',
            padding: '10px',
            borderRadius: '10px',
            background: method === 'transfer' ? '#ffffff' : 'transparent',
            color: method === 'transfer' ? '#0f172a' : '#64748b',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Send size={16} color="#2563eb" /> Transferencia / Alias
        </button>
      </div>

      {/* VISTA 1: Donación Directa por Link Ualá Bis */}
      {method === 'monthly' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
            💚 Convertite en Padrino o Madrina
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#64748b' }}>
            Elegí el monto con el que querés colaborar. Al hacer clic te dirigiremos al checkout oficial de Ualá Bis:
          </p>

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
                  background: '#f0fdf4',
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Alias */}
            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontWeight: 'bold' }}>ALIAS</span>
                <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>{ualaData.alias}</strong>
              </div>
              <button
                onClick={() => handleCopy(ualaData.alias, 'alias')}
                style={{ background: copiedField === 'alias' ? '#16a34a' : '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {copiedField === 'alias' ? <Check size={14} /> : <Copy size={14} />}
                {copiedField === 'alias' ? '¡Copiado!' : 'Copiar Alias'}
              </button>
            </div>

            {/* CBU */}
            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontWeight: 'bold' }}>CBU</span>
                <strong style={{ color: '#0f172a', fontSize: '0.8rem', wordBreak: 'break-all' }}>{ualaData.cbu}</strong>
              </div>
              <button
                onClick={() => handleCopy(ualaData.cbu, 'cbu')}
                style={{ background: copiedField === 'cbu' ? '#16a34a' : '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {copiedField === 'cbu' ? <Check size={14} /> : <Copy size={14} />}
                {copiedField === 'cbu' ? '¡Copiado!' : 'Copiar CBU'}
              </button>
            </div>
          </div>
          <p style={{ marginTop: '10px', fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>Entidad: {ualaData.banco}</p>

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