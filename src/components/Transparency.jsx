import React from 'react';
import { ShieldCheck, HeartPulse, Stethoscope, Utensils, Home, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export default function Transparency() {
  const expenses = [
    {
      category: 'Alimento y Nutrición',
      percent: '40%',
      icon: <Utensils color="#2563eb" size={24} />,
      bg: '#eff6ff',
      details: 'Bolsas de alimento balanceado para perros y gatos alojados en casas de tránsito y refugios.'
    },
    {
      category: 'Atención Vet. y Vacunas',
      percent: '35%',
      icon: <Stethoscope color="#059669" size={24} />,
      bg: '#ecfdf5',
      details: 'Consultas de urgencia, desparasitación, vacunas quintuples/antirrábicas y castraciones.'
    },
    {
      category: 'Cirugías y Casos Graves',
      percent: '15%',
      icon: <HeartPulse color="#dc2626" size={24} />,
      bg: '#fef2f2',
      details: 'Intervenciones quirúrgicas para animales atropellados o rescatados en estado crítico.'
    },
    {
      category: 'Insumos y Tránsito',
      percent: '10%',
      icon: <Home color="#d97706" size={24} />,
      bg: '#fffbeb',
      details: 'Piedritas sanitarias, mantas, pipetas antipulgas, transportadoras y medicamentos.'
    }
  ];

  const recentReceipts = [
    { date: 'Julio 2026', concept: 'Compra de 150kg de Alimento', amount: '$180.000 ARS', status: 'Verificado' },
    { date: 'Julio 2026', concept: 'Veterinaria: 3 Castraciones + Vacunas', amount: '$95.000 ARS', status: 'Verificado' },
    { date: 'Junio 2026', concept: 'Tratamiento Quirúrgico (Rescate "Manchas")', amount: '$120.000 ARS', status: 'Verificado' }
  ];

  return (
    <section style={{ marginBottom: '32px' }}>
      {/* Encabezado Principal */}
      <div style={{
        background: 'linear-gradient(135deg, #166534 0%, #15803d 100%)',
        color: '#ffffff',
        padding: '28px 24px',
        borderRadius: '20px',
        marginBottom: '24px',
        boxShadow: '0 10px 20px rgba(22, 101, 52, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <ShieldCheck size={30} color="#86efac" />
          <h2 style={{ margin: 0, fontSize: '1.6rem' }}>100% Transparencia en tu Donación</h2>
        </div>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '0.98rem', lineHeight: '1.5' }}>
          Cada peso donado va destinado directamente al bienestar, recuperación y alimento de los animales rescatados. Aquí te mostramos cómo distribuimos los fondos.
        </p>
      </div>

      {/* Distribución del Dinero (Tarjetas) */}
      <h3 style={{ color: '#1e293b', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FileText size={20} color="#16a34a" /> ¿Cómo se distribuyen tus aportes?
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {expenses.map((item, index) => (
          <div key={index} style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ background: item.bg, padding: '10px', borderRadius: '12px' }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#0f172a' }}>{item.percent}</span>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#1e293b' }}>{item.category}</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b', lineHeight: '1.4' }}>{item.details}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Historial de Gastos y Comprobantes */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
      }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', color: '#0f172a' }}>Últimos Gastos Registrados</h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '0.88rem', color: '#64748b' }}>
          Rendición de cuentas actualizada mes a mes para tranquilidad de la comunidad.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recentReceipts.map((rec, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #f1f5f9',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#1e293b' }}>{rec.concept}</strong>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{rec.date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: 'bold', color: '#15803d', fontSize: '0.95rem' }}>{rec.amount}</span>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '4px 8px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  <CheckCircle2 size={12} /> {rec.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}