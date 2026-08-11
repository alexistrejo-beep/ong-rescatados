import React from 'react';

// --- Paleta de colores minimalista en tonos grises 🩶 ---
const COLORS = {
  bgLight: '#f4f4f5',        // Gris muy claro y limpio
  bgCard: '#ffffff',         // Blanco para las tarjetas
  primary: '#e4e4e7',        // Gris intermedio para el contenedor CTA
  primaryText: '#3f3f46',    // Gris oscuro para el texto del CTA
  accent: '#71717a',         // Gris oscuro destacado para botones principales
  accentDark: '#52525b',     // Gris más profundo para efectos
  textMain: '#27272a',       // Gris casi negro para lectura perfecta
  textMuted: '#71717a',      // Gris suave para los textos secundarios
  tagBg: '#e4e4e7',          // Fondo de etiquetas
};

// --- SUBCOMPONENTE: Tarjeta de Misión ---
const MisionCard = ({ titulo, descripcion }) => (
  <div style={styles.card}>
    <h4 style={styles.cardTitle}>{titulo}</h4>
    <p style={styles.cardText}>{descripcion}</p>
  </div>
);

// --- SUBCOMPONENTE: Tarjeta de Donación ---
const DonacionCard = ({ icono, titulo, desc }) => (
  <div style={{ ...styles.card, textAlign: 'center' }}>
    <div style={styles.cardIcon}>{icono}</div>
    <h4 style={styles.cardTitle}>{titulo}</h4>
    <p style={styles.cardText}>{desc}</p>
  </div>
);

// --- COMPONENTE PRINCIPAL (SIN IMÁGENES) ---
const HuellitasSection = ({ setActiveTab }) => {

  const misiones = [
    { titulo: "Rescate Activo", descripcion: "Sacamos a los animales de las calles en situaciones de riesgo o abandono." },
    { titulo: "Salud y Nutrición", descripcion: "Les brindamos alimento de calidad, refugio seguro y atención veterinaria." },
    { titulo: "Rehabilitación", descripcion: "Acompañamos la recuperación física y emocional de los rescatados." },
    { titulo: "Control Integral", descripcion: "Realizamos campañas de esterilización para evitar la sobrepoblación." }
  ];

  const impactosDonacion = [
    { icono: "🐾", titulo: "Alimento", desc: "Comida nutritiva para recuperar sus fuerzas." },
    { icono: "💊", titulo: "Medicamentos", desc: "Tratamientos esenciales para su salud." },
    { icono: "🩺", titulo: "Veterinaria", desc: "Consultas, vacunas y cirugías de urgencia." },
    { icono: "🏡", titulo: "Refugio", desc: "Un espacio seguro y cálido mientras esperan un hogar." }
  ];

  return (
    <section style={styles.container}>
      
      {/* 1. SECCIÓN NUESTRA HISTORIA */}
      <div style={styles.textBlockFull}>
        <span style={styles.tag}>Nuestras Raíces</span>
        <h2 style={styles.title}>El Comienzo de un Sueño</h2>
        <p style={styles.text}>
          Fundación Huellitas de Amor nació al ver la realidad de tantos animales desprotegidos en la calle. No pudimos mirar hacia otro lado y decidimos convertirnos en su refugio y segunda oportunidad.
        </p>
        <p style={styles.text}>
          Lo que empezó como un esfuerzo pequeño se transformó en una red de voluntarios. Hoy sanamos sus heridas y les demostramos que el mundo puede ser un lugar seguro y lleno de amor.
        </p>
      </div>

      {/* 2. SECCIÓN NUESTRA MISIÓN */}
      <div style={styles.sectionSpacing}>
        <div style={styles.centerHeader}>
          <h2 style={styles.title}>El Corazón de Nuestra Labor</h2>
          <p style={styles.subtitle}>Los pilares de nuestro compromiso diario por cuidar cada vida.</p>
        </div>
        <div style={styles.responsiveGrid}>
          {misiones.map((mision, index) => (
            <MisionCard key={index} titulo={mision.titulo} descripcion={mision.descripcion} />
          ))}
        </div>
      </div>

      {/* 3. SECCIÓN EL PROBLEMA / HÉROES DE CUATRO PATAS */}
      <div style={styles.textBlockFull}>
        <span style={styles.tag}>Transformando Vidas</span>
        <h2 style={styles.title}>De la Vulnerabilidad a la Valentía</h2>
        <p style={styles.text}>
          Muchos animales sobreviven diariamente en las calles expuestos al frío, el hambre y el olvido. Sin embargo, detrás de cada mirada vulnerable se esconde el potencial de un verdadero héroe.
        </p>
        <p style={styles.text}>
          Inspirados por grandes leyendas de rescate como Tsunami y tantos otros perros rescatistas que salvan vidas humanas en catástrofes, nosotros trabajamos desde la acción para salvarlos a ellos. Tu ayuda hace que estos pequeños guerreros recuperen su fuerza y su luz.
        </p>
      </div>

      {/* 4. SECCIÓN ¿EN QUÉ AYUDA TU DONACIÓN? */}
      <div style={styles.sectionSpacing}>
        <div style={styles.centerHeader}>
          <h2 style={styles.title}>Tu Impacto en Cada Huella</h2>
          <p style={styles.subtitle}>
            Cada aporte se transforma directamente en herramientas reales para cambiar su destino.
          </p>
        </div>
        <div style={styles.responsiveGrid}>
          {impactosDonacion.map((item, index) => (
            <DonacionCard key={index} icono={item.icono} titulo={item.titulo} desc={item.desc} />
          ))}
        </div>
      </div>

      {/* 5. LLAMADO A LA ACCIÓN FINAL */}
      <div style={styles.ctaContainer}>
        <h3 style={styles.ctaTitle}>Ellos nos necesitan</h3>
        <p style={styles.ctaText}>
          "Ellos no pueden pedir ayuda con palabras, pero nosotros podemos ser su voz. Con tu ayuda, una huellita puede dejar atrás la calle y encontrar una vida llena de amor."
        </p>
        <div style={styles.actionsFlex}>
          <button style={styles.btnPrimary} onClick={() => setActiveTab('donar')}>
            Quiero ayudar
          </button>
          <button style={styles.btnSecondary} onClick={() => setActiveTab('refugio')}>
            Ver Refugio
          </button>
        </div>
      </div>

    </section>
  );
};

// --- OBJETO DE ESTILOS AJUSTADO PARA DISEÑO SIN IMÁGENES ---
const styles = {
  container: {
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    color: COLORS.textMain,
    backgroundColor: COLORS.bgLight,
    padding: '40px 20px',
    lineHeight: '1.6',
    borderRadius: '16px',
  },
  textBlockFull: {
    maxWidth: '800px',
    margin: '0 auto 60px auto',
    textAlign: 'center', // Centrado para darle un estilo editorial limpio
  },
  title: {
    fontSize: '1.9rem',
    color: COLORS.textMain,
    marginBottom: '15px',
    fontWeight: '700',
    marginTop: '0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '1rem',
    color: COLORS.textMuted,
    maxWidth: '600px',
    margin: '0 auto',
  },
  text: {
    fontSize: '1rem',
    color: COLORS.textMuted,
    marginBottom: '15px',
  },
  tag: {
    display: 'inline-block',
    backgroundColor: COLORS.tagBg,
    color: COLORS.accentDark,
    padding: '4px 14px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: '12px',
    letterSpacing: '0.5px',
  },
  sectionSpacing: {
    maxWidth: '1100px',
    margin: '0 auto 60px auto',
  },
  centerHeader: {
    textAlign: 'center',
    marginBottom: '35px',
  },
  responsiveGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
    border: '1px solid rgba(113, 113, 122, 0.15)',
    flex: '1 1 220px',
    maxWidth: '260px',
    boxSizing: 'border-box',
    textAlign: 'left',
  },
  cardTitle: {
    fontSize: '1.1rem',
    margin: '0 0 10px 0',
    color: COLORS.textMain,
    fontWeight: '600',
  },
  cardText: {
    fontSize: '0.9rem',
    color: COLORS.textMuted,
    margin: '0',
  },
  cardIcon: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  ctaContainer: {
    maxWidth: '800px',
    margin: '40px auto 0 auto',
    backgroundColor: COLORS.primary,
    borderRadius: '12px',
    padding: '40px 20px',
    textAlign: 'center',
    color: COLORS.primaryText,
    boxSizing: 'border-box',
  },
  ctaTitle: {
    fontSize: '1.6rem',
    margin: '0 0 10px 0',
    fontWeight: '700',
  },
  ctaText: {
    fontSize: '1.1rem',
    fontStyle: 'italic',
    margin: '0 0 25px 0',
    opacity: '0.9',
  },
  actionsFlex: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    padding: '12px 28px',
    borderRadius: '25px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: COLORS.accent,
    color: '#ffffff',
    transition: 'background-color 0.2s ease',
  },
  btnSecondary: {
    padding: '12px 28px',
    borderRadius: '25px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: COLORS.primaryText,
    border: `2px solid ${COLORS.primaryText}`,
    transition: 'background-color 0.2s ease',
  },
};

export default HuellitasSection;