import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  HeartPulse, 
  Stethoscope, 
  Utensils, 
  Home, 
  CheckCircle2, 
  FileText, 
  Shield, 
  X, 
  CreditCard, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Camera
} from 'lucide-react';
import useAdminAuth from '../hooks/useAdminAuth';

export default function Transparency() {
  const { isAdmin, loading: adminLoading, error: adminError, login: loginAdmin, logout: logoutAdmin, clearError } = useAdminAuth();
  const [adminInputPass, setAdminInputPass] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  
  // Estado para copiar Alias o CBU
  const [copiedField, setCopiedField] = useState(null);

  // Datos Bancarios Extraídos de la Imagen
  const bankData = {
    alias: 'RESCATES.HUELLITAS',
    cbu: '3840200500000029787630',
    accountNumber: '38402000002978763'
  };

  // Porcentajes de Distribución de Fondos
  const expensesDistribution = [
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
      details: 'Consultas de urgencia, desparasitación, vacunas quíntuples/antirrábicas y castraciones.'
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
      details: 'Piedritas sanitarias, mantas, casitas, pipetas antipulgas, transportadoras y medicamentos.'
    }
  ];

  // Historial de Movimientos / Gastos
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('refugio_transparencia_v3');
    return saved ? JSON.parse(saved) : [
      { id: 1, type: 'egreso', concept: 'Compra de 150kg de Alimento', amount: 180000, date: 'Julio 2026', status: 'Verificado' },
      { id: 2, type: 'egreso', concept: 'Veterinaria: 3 Castraciones + Vacunas', amount: 95000, date: 'Julio 2026', status: 'Verificado' },
      { id: 3, type: 'egreso', concept: 'Tratamiento Quirúrgico (Rescate "Manchas")', amount: 120000, date: 'Junio 2026', status: 'Verificado' }
    ];
  });

  // Galería de Fotos de Casitas, Vida y Cuidados de los Animales
  const [gallery, setGallery] = useState(() => {
    const saved = localStorage.getItem('refugio_galeria_v1');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: 'Casitas y refugio térmico',
        description: 'Casitas acondicionadas con mantas y techos impermeables para protegerlos del frío y la lluvia.',
        url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 2,
        title: 'Alimentación e Higiene',
        description: 'Platos limpios con agua fresca y alimento balanceado de primera calidad diario.',
        url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 3,
        title: 'Espacios de juego y recreación',
        description: 'Patio seguro donde corren, interactúan y reciben su proceso de socialización y amor.',
        url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=600'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('refugio_transparencia_v3', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('refugio_galeria_v1', JSON.stringify(gallery));
  }, [gallery]);

  // Formulario Administrador Gastos
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newConcept, setNewConcept] = useState('');
  const [newAmount, setNewAmount] = useState('');

  // Formulario Administrador Galería
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoDesc, setNewPhotoDesc] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // Login Administrador
  const handleAdminLogin = (e) => {
    e.preventDefault();
    loginAdmin(adminInputPass).then((success) => {
      if (success) {
        setShowAdminModal(false);
        setAdminInputPass('');
      }
    });
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setAdminInputPass('');
    clearError();
  };

  // Copiar al Portapapeles
  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Agregar Gasto (Admin)
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newConcept || !newAmount || Number(newAmount) <= 0) return;

    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const now = new Date();
    const formattedDate = `${meses[now.getMonth()]} ${now.getFullYear()}`;

    const newEntry = {
      id: Date.now(),
      type: 'egreso',
      concept: newConcept,
      amount: parseFloat(newAmount),
      date: formattedDate,
      status: 'Verificado'
    };

    setTransactions([newEntry, ...transactions]);
    setNewConcept('');
    setNewAmount('');
    setShowExpenseForm(false);
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('¿Deseas eliminar este registro de gasto?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  // Agregar Foto a la Galería (Admin)
  const handleAddPhoto = (e) => {
    e.preventDefault();
    if (!newPhotoTitle || !newPhotoUrl) return;

    const newPhoto = {
      id: Date.now(),
      title: newPhotoTitle,
      description: newPhotoDesc,
      url: newPhotoUrl
    };

    setGallery([newPhoto, ...gallery]);
    setNewPhotoTitle('');
    setNewPhotoDesc('');
    setNewPhotoUrl('');
    setShowPhotoForm(false);
  };

  // Cargar imagen local si el usuario selecciona un archivo
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePhoto = (id) => {
    if (window.confirm('¿Deseas borrar esta imagen de la galería?')) {
      setGallery(gallery.filter(g => g.id !== id));
    }
  };

  return (
    <section style={{ maxWidth: '850px', margin: '0 auto', padding: '16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Top Bar Admin Status */}
      <div style={{ background: '#f8fafc', padding: '10px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
          Portal de Transparencia & Rendición de Cuentas
        </span>

        {isAdmin ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={14} /> Modo Admin Activo
            </span>
            <button onClick={() => { logoutAdmin(); setShowExpenseForm(false); setShowPhotoForm(false); }} style={{ background: '#cbd5e1', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Salir del modo admin</button>
          </div>
        ) : (
          <button
            onClick={() => setShowAdminModal(true)}
            style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
          >
            🔒 Ingreso Admin
          </button>
        )}
      </div>

      {/* Modal Admin */}
      {showAdminModal && (
        <div onMouseDown={(e) => { if (e.target === e.currentTarget) closeAdminModal(); }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div onMouseDown={(e) => e.stopPropagation()} style={{ background: '#fff', padding: '24px', borderRadius: '16px', maxWidth: '380px', width: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Acceso Administrador</h3>
              <button type="button" aria-label="Cerrar acceso administrador" onClick={closeAdminModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAdminLogin}>
              <input
                type="password"
                placeholder="Contraseña..."
                value={adminInputPass}
                onChange={(e) => setAdminInputPass(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '14px', boxSizing: 'border-box' }}
              />
              {adminError && <p style={{ color: '#dc2626', fontSize: '0.8rem', margin: '-6px 0 10px' }}>{adminError}</p>}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={closeAdminModal} style={{ flex: 1, background: '#e2e8f0', color: '#1e293b', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" disabled={adminLoading} style={{ flex: 1, background: '#16a34a', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {adminLoading ? 'Validando...' : 'Ingresar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          <ShieldCheck size={32} color="#86efac" />
          <h2 style={{ margin: 0, fontSize: '1.6rem' }}>100% Transparencia en tu Donación</h2>
        </div>
        <p style={{ margin: 0, opacity: 0.92, fontSize: '0.98rem', lineHeight: '1.5' }}>
          Cada peso donado va destinado directamente al bienestar, recuperación, alimento y refugio de los animales rescatados.
        </p>
      </div>

      {/* Tarjeta Oficial de Cuentas y Datos de Depósito */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '32px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <CreditCard color="#2563eb" size={24} />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>Datos de la Caja de Ahorro</h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>Con estos datos podés realizar aportes e impresiones de transferencias directas</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Fila Alias */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', display: 'block' }}>ALIAS DE LA CUENTA</span>
              <strong style={{ fontSize: '1.05rem', color: '#166534', letterSpacing: '0.5px' }}>{bankData.alias}</strong>
            </div>
            <button
              onClick={() => handleCopy(bankData.alias, 'alias')}
              style={{ background: copiedField === 'alias' ? '#16a34a' : '#0f172a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', transition: '0.2s' }}
            >
              {copiedField === 'alias' ? <Check size={16} /> : <Copy size={16} />}
              {copiedField === 'alias' ? '¡Alias Copiado!' : 'Copiar Alias'}
            </button>
          </div>

          {/* Fila CBU */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', display: 'block' }}>CBU</span>
              <span style={{ fontSize: '0.95rem', color: '#1e293b', fontFamily: 'monospace', fontWeight: 'bold' }}>{bankData.cbu}</span>
            </div>
            <button
              onClick={() => handleCopy(bankData.cbu, 'cbu')}
              style={{ background: copiedField === 'cbu' ? '#16a34a' : '#e2e8f0', color: copiedField === 'cbu' ? '#fff' : '#1e293b', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', transition: '0.2s' }}
            >
              {copiedField === 'cbu' ? <Check size={16} /> : <Copy size={16} />}
              {copiedField === 'cbu' ? '¡CBU Copiado!' : 'Copiar CBU'}
            </button>
          </div>

          {/* Fila Número de cuenta */}
          <div style={{ padding: '8px 16px', background: '#fff', border: '1px border #f1f5f9', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Número de Cuenta: <strong>{bankData.accountNumber}</strong></span>
          </div>

        </div>
      </div>

      {/* SECCIÓN NUEVA: Galería de Casitas y Cuidados Actuales */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ color: '#1e293b', fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Camera size={22} color="#16a34a" /> ¿Cómo viven y cómo los cuidamos?
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#64748b' }}>
              Imágenes reales de sus casitas, instalaciones y cuidados diarios.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowPhotoForm(!showPhotoForm)}
              style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
            >
              <Plus size={16} /> Subir Foto / Casita
            </button>
          )}
        </div>

        {/* Formulario Administrador para Galería */}
        {isAdmin && showPhotoForm && (
          <form onSubmit={handleAddPhoto} style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #cbd5e1', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a' }}>Agregar imagen a la galería de instalaciones</h4>

            <input
              type="text"
              placeholder="Título de la imagen (Ej: Nuevas casitas térmicas)"
              value={newPhotoTitle}
              onChange={(e) => setNewPhotoTitle(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              required
            />

            <input
              type="text"
              placeholder="Descripción breve..."
              value={newPhotoDesc}
              onChange={(e) => setNewPhotoDesc(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Subir archivo desde el dispositivo o pegar URL:</label>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ fontSize: '0.8rem' }} />
              <input
                type="url"
                placeholder="O pega la URL de la imagen (http...)"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            {newPhotoUrl && (
              <div style={{ textAlign: 'center' }}>
                <img src={newPhotoUrl} alt="Vista previa" style={{ maxHeight: '120px', borderRadius: '8px', objectFit: 'cover' }} />
              </div>
            )}

            <button type="submit" style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Guardar Foto
            </button>
          </form>
        )}

        {/* Grilla de Galería */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '18px' }}>
          {gallery.map((item) => (
            <div key={item.id} style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              position: 'relative'
            }}>
              <img
                src={item.url}
                alt={item.title}
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
              />
              <div style={{ padding: '16px' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: '#0f172a' }}>{item.title}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: '1.4' }}>{item.description}</p>
              </div>

              {isAdmin && (
                <button
                  onClick={() => handleDeletePhoto(item.id)}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Distribución del Dinero (Tarjetas) */}
      <h3 style={{ color: '#1e293b', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FileText size={20} color="#16a34a" /> ¿Cómo se distribuyen tus aportes?
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {expensesDistribution.map((item, index) => (
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', color: '#0f172a' }}>Últimos Gastos Registrados</h3>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
              Rendición de cuentas actualizada mes a mes para tranquilidad de la comunidad.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowExpenseForm(!showExpenseForm)}
              style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
            >
              <Plus size={16} /> Cargar Gasto
            </button>
          )}
        </div>

        {/* Formulario Administrador Gastos */}
        {isAdmin && showExpenseForm && (
          <form onSubmit={handleAddTransaction} style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a' }}>Registrar nuevo gasto / comprobante</h4>
            
            <input
              type="number"
              placeholder="Monto ($ ARS)"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              required
            />

            <input
              type="text"
              placeholder="Concepto (Ej: Veterinaria, Alimento, Casitas...)"
              value={newConcept}
              onChange={(e) => setNewConcept(e.target.value)}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              required
            />

            <button type="submit" style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              Guardar en Historial
            </button>
          </form>
        )}

        {/* Lista de Registros */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {transactions.map((rec) => (
            <div key={rec.id} style={{
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
                <span style={{ fontWeight: 'bold', color: '#15803d', fontSize: '0.95rem' }}>
                  ${rec.amount.toLocaleString('es-AR')} ARS
                </span>

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
                  <CheckCircle2 size={12} /> {rec.status || 'Verificado'}
                </span>

                {isAdmin && (
                  <button
                    onClick={() => handleDeleteTransaction(rec.id)}
                    style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}