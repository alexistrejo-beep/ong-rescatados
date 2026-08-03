import React, { useState } from 'react';
import { Copy, Check, Heart, Send, ShoppingBag, ShieldCheck, CreditCard, Lock } from 'lucide-react';

export default function DonationSection() {
  const [method, setMethod] = useState('transfer'); // 'transfer' o 'card'
  const [copiedField, setCopiedField] = useState('');
  const [customAmount, setCustomAmount] = useState('2000');
  const [isProcessing, setIsProcessing] = useState(false);

  // Datos de tu cuenta Ualá Bank S.A.U.
  const ualaData = {
    alias: 'RESCATES.HUELLITAS',
    cbu: '3840200500000029787630',
    banco: 'Ualá Bank S.A.U.'
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2500);
  };

  // 🔴 AQUÍ ESTÁ EL PASO 2: Conexión REAL con tu archivo /api/process-payment.js
  const handleCardSubmit = async (e) => {
    e.preventDefault();
    
    if (!customAmount || Number(customAmount) <= 0) {
      alert('Por favor ingresá un monto válido para donar.');
      return;
    }

    setIsProcessing(true);

    try {
      // Llamamos a la API interna que creaste en la carpeta /api
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: customAmount,
          description: `Donación de $${customAmount} a Rescatados`
        })
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        // Redirige al donante al formulario seguro de Ualá Bis para pagar con tarjeta
        window.location.href = data.checkoutUrl;
      } else {
        alert('No se pudo iniciar el pago. Verificá que el monto sea correcto o reintentá en unos minutos.');
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Error al conectar con la pasarela de pagos.');
    } finally {
      setIsProcessing(false);
    }
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
        <button
          onClick={() => setMethod('card')}
          style={{
            border: 'none',
            padding: '10px',
            borderRadius: '10px',
            background: method === 'card' ? '#ffffff' : 'transparent',
            color: method === 'card' ? '#0f172a' : '#64748b',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <CreditCard size={16} color="#dc2626" /> Tarjeta de Débito/Crédito
        </button>
      </div>

      {/* Selector de Monto Libre */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#1e293b' }}>
          Monto a donar
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
          {['2000', '5000', '10000'].map((amt) => (
            <button
              key={amt}
              onClick={() => setCustomAmount(amt)}
              style={{
                background: customAmount === amt ? '#16a34a' : '#f8fafc',
                color: customAmount === amt ? '#ffffff' : '#334155',
                border: '1px solid #cbd5e1',
                padding: '8px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              ${parseInt(amt).toLocaleString('es-AR')}
            </button>
          ))}
        </div>

        <div>
          <input
            type="number"
            placeholder="Otro monto ($ ARS)"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* VISTA 1: Transferencia Bancaria */}
      {method === 'transfer' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={18} color="#2563eb" /> Transferencia directa (Cualquier Banco/Billetera)
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
                style={{ background: copiedField === 'alias' ? '#dc2626' : '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
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
                style={{ background: copiedField === 'cbu' ? '#dc2626' : '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {copiedField === 'cbu' ? <Check size={14} /> : <Copy size={14} />}
                {copiedField === 'cbu' ? '¡Copiado!' : 'Copiar CBU'}
              </button>
            </div>
          </div>
          <p style={{ marginTop: '10px', fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>Entidad: {ualaData.banco}</p>
        </div>
      )}

      {/* VISTA 2: Botón para donar con Tarjeta vía Ualá Bis */}
      {method === 'card' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={18} color="#dc2626" /> Pagar con Tarjeta mediante Ualá Bis
          </h3>
          
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
            Al hacer clic abajo, se abrirá la pasarela de pagos segura de Ualá donde podrás ingresar los datos de tu tarjeta de crédito o débito.
          </p>

          <form onSubmit={handleCardSubmit}>
            <button
              type="submit"
              disabled={isProcessing}
              style={{
                width: '100%',
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                padding: '14px',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: isProcessing ? 'wait' : 'pointer',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Lock size={18} />
              {isProcessing 
                ? 'Conectando con Ualá...' 
                : `Donar $${parseInt(customAmount || '0').toLocaleString('es-AR')} con Tarjeta`}
            </button>
          </form>
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