import React, { useState } from 'react';
import { Heart, ShieldCheck, CreditCard, CheckCircle2, Copy } from 'lucide-react';

export default function DonationSection() {
  const [selectedAmount, setSelectedAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState('');
  const [copied, setCopied] = useState(false);

  // Tu link directo de Mercado Pago
  const MERCADO_PAGO_LINK = "https://link.mercadopago.com.ar/donacionrefugio";
  
  // Tu alias de Mercado Pago para transferencias sin comisión
  const ALIAS_MP = "donacionrefugio.mp";

  const getImpactMessage = (amount) => {
    const val = Number(amount) || 0;
    if (val <= 0) return "Ingresa un monto para ver el impacto de tu donación.";
    if (val < 3000) return "Cubre raciones de alimento balanceado para 1 día.";
    if (val < 8000) return "Cubre alimento por una semana y desparasitación básica.";
    if (val < 15000) return "Financia una consulta veterinaria completa y vacunas.";
    return "Cubre una esterilización o tratamiento médico de urgencia.";
  };

  const activeAmount = customAmount !== '' ? customAmount : selectedAmount;

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(ALIAS_MP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayMercadoPago = () => {
    const amount = Number(activeAmount);
    if (!amount || amount <= 0) {
      alert("Por favor, ingresa un monto válido para donar.");
      return;
    }
    
    // Abre tu link oficial de Mercado Pago en una pestaña nueva
    window.open(MERCADO_PAGO_LINK, '_blank');
  };

  return (
    <section style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      padding: '24px',
      borderRadius: '20px',
      marginBottom: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
    }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', marginTop: 0, fontSize: '1.4rem' }}>
        <Heart color="#16a34a" fill="#16a34a" /> Haz tu donación
      </h2>
      <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '16px' }}>
        Elige o ingresa cuánto quieres aportar en Pesos Argentinos ($ ARS):
      </p>
      
      {/* Botones de montos sugeridos */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[2000, 5000, 10000, 20000].map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
            style={{
              flex: '1 1 100px',
              padding: '12px',
              borderRadius: '10px',
              border: selectedAmount === amt && customAmount === '' ? '2px solid #16a34a' : '1px solid #cbd5e1',
              cursor: 'pointer',
              background: selectedAmount === amt && customAmount === '' ? '#16a34a' : '#f8fafc',
              color: selectedAmount === amt && customAmount === '' ? '#ffffff' : '#1e293b',
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
          >
            ${amt.toLocaleString('es-AR')}
          </button>
        ))}
      </div>

      {/* Input de monto personalizado */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
          O ingresa el monto exacto que quieras donar:
        </label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '14px', top: '12px', color: '#64748b', fontWeight: 'bold' }}>$</span>
          <input
            type="number"
            placeholder="Ej: 3500"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            style={{
              padding: '12px 12px 12px 32px',
              borderRadius: '10px',
              border: customAmount !== '' ? '2px solid #16a34a' : '1px solid #cbd5e1',
              width: '100%',
              boxSizing: 'border-box',
              fontSize: '1rem',
              background: '#ffffff',
              color: '#0f172a',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Tarjeta de impacto */}
      <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #16a34a', marginBottom: '20px' }}>
        <strong style={{ color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={18} /> ¿En qué se usará tu dinero?
        </strong>
        <p style={{ margin: '6px 0 0 0', color: '#334155', fontSize: '0.95rem' }}>
          {getImpactMessage(activeAmount)}
        </p>
      </div>

      {/* Botón Principal: Redirección a Mercado Pago */}
      <button
        type="button"
        onClick={handlePayMercadoPago}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: '#009EE3',
          color: '#ffffff',
          border: 'none',
          padding: '14px',
          borderRadius: '12px',
          fontSize: '1.05rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 158, 227, 0.3)',
          marginBottom: '12px'
        }}
      >
        <CreditCard size={20} /> Donar ${Number(activeAmount || 0).toLocaleString('es-AR')} con Mercado Pago
      </button>

      {/* Transferencia por Alias */}
      <div style={{
        background: '#f8fafc',
        border: '1px dashed #cbd5e1',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '12px'
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Alias para transferencia directa:</span>
          <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{ALIAS_MP}</strong>
        </div>
        <button
          type="button"
          onClick={handleCopyAlias}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: copied ? '#16a34a' : '#e2e8f0',
            color: copied ? '#ffffff' : '#334155',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 'bold'
          }}
        >
          {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
          {copied ? '¡Copiado!' : 'Copiar'}
        </button>
      </div>

    </section>
  );
}