/**
 * Hojas del catálogo discover → industria de perfil. Sin deps (evita ciclos con profile-taxonomy).
 * Una sola tabla (VERTICAL_ROWS) alinea mapa y lista; ampliar aquí y en migraciones
 * `20260530120000_expand_industry_verticals.sql` + `20260602120000_expand_verticals_specialization.sql`
 * + `20260603120000_expand_verticals_batch3.sql`.
 */

export interface IndustryLeaf {
  slug: string
  label: string
}

/** slug → industria de perfil (15 industrias). */
const VERTICAL_ROWS = [
  // —— Finanzas y fintech
  { slug: "fintech", label: "Fintech", industry: "finanzas-fintech" },
  { slug: "insurtech", label: "Insurtech", industry: "finanzas-fintech" },
  { slug: "crypto", label: "Crypto", industry: "finanzas-fintech" },
  { slug: "pagos", label: "Pagos", industry: "finanzas-fintech" },
  { slug: "lending", label: "Lending", industry: "finanzas-fintech" },
  { slug: "open-finance", label: "Open Finance", industry: "finanzas-fintech" },
  {
    slug: "finanzas-personales",
    label: "Finanzas personales",
    industry: "finanzas-fintech",
  },
  { slug: "seguros", label: "Seguros", industry: "finanzas-fintech" },
  {
    slug: "banca-tradicional-corporativa",
    label: "Banca retail y corporativa",
    industry: "finanzas-fintech",
  },
  {
    slug: "wealth-private-banking",
    label: "Private banking y family office",
    industry: "finanzas-fintech",
  },
  {
    slug: "contabilidad-cfo-outsourcing",
    label: "Contabilidad, CFO externo y outsourcing financiero",
    industry: "finanzas-fintech",
  },
  {
    slug: "mercados-derivados-prime",
    label: "Mercados, research y prime brokerage",
    industry: "finanzas-fintech",
  },
  {
    slug: "neobanca-embed-banking",
    label: "Neobanca y banking as a service",
    industry: "finanzas-fintech",
  },
  {
    slug: "tesoreria-liquidez-corporativa",
    label: "Tesorería y liquidez corporativa",
    industry: "finanzas-fintech",
  },
  {
    slug: "cobranza-recuperacion-cartera",
    label: "Cobranza y recuperación de cartera",
    industry: "finanzas-fintech",
  },
  {
    slug: "finanzas-sostenibles-esg",
    label: "Finanzas sostenibles y reporting ESG",
    industry: "finanzas-fintech",
  },
  {
    slug: "ratings-analisis-credito",
    label: "Ratings y análisis de crédito",
    industry: "finanzas-fintech",
  },
  {
    slug: "capital-riesgo-venture-debt",
    label: "Capital de riesgo y venture debt",
    industry: "finanzas-fintech",
  },
  {
    slug: "embedded-finance-b2b",
    label: "Embedded finance y pagos B2B",
    industry: "finanzas-fintech",
  },
  {
    slug: "fx-hedging-global",
    label: "FX, cobertura y tesorería internacional",
    industry: "finanzas-fintech",
  },
  {
    slug: "planeacion-patrimonial-sucesoria",
    label: "Planeación patrimonial y sucesoria",
    industry: "finanzas-fintech",
  },
  {
    slug: "consolidacion-reporting-ifrs",
    label: "Consolidación y reporting financiero (IFRS)",
    industry: "finanzas-fintech",
  },
  {
    slug: "activos-improductivos-npl",
    label: "NPL, activos improductivos y workout",
    industry: "finanzas-fintech",
  },
  {
    slug: "custodia-valores-post-trade",
    label: "Custodia, clearing y post‑trading",
    industry: "finanzas-fintech",
  },
  {
    slug: "seguros-corporativos-pyme",
    label: "Seguros corporativos y ramos especializados",
    industry: "finanzas-fintech",
  },
  {
    slug: "core-banking-tech-proveedores",
    label: "Core banking y plataformas financieras (proveedores)",
    industry: "finanzas-fintech",
  },
  {
    slug: "spinouts-corporate-venturing",
    label: "Corporate venturing y spinouts financieros",
    industry: "finanzas-fintech",
  },

  // —— Salud y biotech
  { slug: "healthtech", label: "Healthtech", industry: "salud-biotech" },
  { slug: "biotech", label: "Biotech", industry: "salud-biotech" },
  { slug: "salud", label: "Salud", industry: "salud-biotech" },
  {
    slug: "hospitales-clinicas",
    label: "Hospitales y clínicas",
    industry: "salud-biotech",
  },
  {
    slug: "farmacia-distribucion-salud",
    label: "Farmacia y distribución en salud",
    industry: "salud-biotech",
  },
  {
    slug: "salud-digital-clinica",
    label: "Salud digital y servicios clínicos remotos",
    industry: "salud-biotech",
  },
  {
    slug: "dispositivos-wearables-salud",
    label: "Wearables y monitoreo remoto",
    industry: "salud-biotech",
  },
  {
    slug: "salud-regulatoria-calidad",
    label: "Regulatorio, calidad y compliance en salud",
    industry: "salud-biotech",
  },
  {
    slug: "investigacion-preclinica",
    label: "Investigación preclínica y CRO",
    industry: "salud-biotech",
  },
  {
    slug: "odontologia-y-salud-bucal",
    label: "Odontología y salud bucal",
    industry: "salud-biotech",
  },
  {
    slug: "salud-mental-digital",
    label: "Salud mental y bienestar psicológico",
    industry: "salud-biotech",
  },
  {
    slug: "veterinaria-one-health",
    label: "Medicina veterinaria y One Health",
    industry: "salud-biotech",
  },
  {
    slug: "dispositivos-medicos-hardware",
    label: "Dispositivos médicos y hardware clínico",
    industry: "salud-biotech",
  },
  {
    slug: "diagnostico-imagen-laboratorio",
    label: "Diagnóstico por imagen y laboratorio clínico",
    industry: "salud-biotech",
  },
  {
    slug: "aseguradoras-planes-salud",
    label: "Aseguradoras y planes de salud",
    industry: "salud-biotech",
  },
  {
    slug: "medicina-estetica-dermatologia",
    label: "Medicina estética y dermatología clínica",
    industry: "salud-biotech",
  },
  {
    slug: "salud-ocupacional-seguridad-laboral",
    label: "Salud ocupacional y seguridad laboral",
    industry: "salud-biotech",
  },
  {
    slug: "atencion-primaria-comunitaria",
    label: "Atención primaria y medicina comunitaria",
    industry: "salud-biotech",
  },
  {
    slug: "urgencias-hospitalarias",
    label: "Urgencias y cuidados críticos hospitalarios",
    industry: "salud-biotech",
  },
  {
    slug: "medicina-deportiva-rehabilitacion",
    label: "Medicina deportiva y readaptación clínica",
    industry: "salud-biotech",
  },
  {
    slug: "genomica-terapias-avanzadas",
    label: "Genómica, terapias avanzadas y biofarmacéutica",
    industry: "salud-biotech",
  },
  {
    slug: "enfermeria-domiciliaria-paliativos",
    label: "Enfermería domiciliaria y cuidados paliativos",
    industry: "salud-biotech",
  },
  {
    slug: "salud-materno-infantil-vertical",
    label: "Salud materno infantil y neonatología",
    industry: "salud-biotech",
  },
  {
    slug: "optometria-salud-visual",
    label: "Optometría y salud visual",
    industry: "salud-biotech",
  },
  {
    slug: "patologia-clinica-especializada",
    label: "Patología clínica y laboratorio de alta complejidad",
    industry: "salud-biotech",
  },
  {
    slug: "logistica-suministro-hospitalario",
    label: "Logística y suministro hospitalario (healthcare supply)",
    industry: "salud-biotech",
  },
  {
    slug: "telefarmacia-cadena-frio",
    label: "Telefarmacia y cadena de frío farmacéutico",
    industry: "salud-biotech",
  },

  // —— Educación
  { slug: "edtech", label: "Edtech", industry: "educacion" },
  {
    slug: "educacion-instituciones-formales",
    label: "Instituciones y educación formal",
    industry: "educacion",
  },
  {
    slug: "k12-escuelas",
    label: "Educación básica y media (K-12)",
    industry: "educacion",
  },
  {
    slug: "universidad-posgrado",
    label: "Universidad, posgrado y doctorado",
    industry: "educacion",
  },
  {
    slug: "formacion-corporativa-lnd",
    label: "Capacitación corporativa y L&D",
    industry: "educacion",
  },
  {
    slug: "educacion-tecnica-profesional",
    label: "Educación técnica y profesional",
    industry: "educacion",
  },
  {
    slug: "idiomas-y-certificaciones",
    label: "Idiomas y certificaciones profesionales",
    industry: "educacion",
  },
  {
    slug: "bibliotecas-y-gestion-conocimiento",
    label: "Bibliotecas y gestión del conocimiento",
    industry: "educacion",
  },
  {
    slug: "educacion-artistica-cultural",
    label: "Educación artística y cultural",
    industry: "educacion",
  },
  {
    slug: "investigacion-academica-vertical",
    label: "Investigación y ciencia aplicada en academia",
    industry: "educacion",
  },
  {
    slug: "educacion-especial-inclusion",
    label: "Educación especial e inclusión",
    industry: "educacion",
  },
  {
    slug: "evaluacion-certificaciones-internacionales",
    label: "Evaluación y certificaciones internacionales",
    industry: "educacion",
  },
  {
    slug: "marketplace-cursos-digitales",
    label: "Marketplace de cursos y microcredenciales",
    industry: "educacion",
  },
  {
    slug: "experiencia-campus-hibrido",
    label: "Campus y experiencia educativa híbrida",
    industry: "educacion",
  },
  {
    slug: "preescolar-primera-infancia-edu",
    label: "Preescolar y primera infancia educativa",
    industry: "educacion",
  },
  {
    slug: "stem-robotica-maker",
    label: "STEM, robótica y makerspaces",
    industry: "educacion",
  },
  {
    slug: "coaching-certificaciones-profesionales",
    label: "Coaching y certificaciones profesionales reguladas",
    industry: "educacion",
  },
  {
    slug: "universidad-corporativa-academy",
    label: "Universidad corporativa y business academy",
    industry: "educacion",
  },
  {
    slug: "editorial-educativa-contenidos",
    label: "Editorial educativa y contenidos curriculares",
    industry: "educacion",
  },
  {
    slug: "becas-financiamiento-estudiantil",
    label: "Becas y financiamiento estudiantil",
    industry: "educacion",
  },
  {
    slug: "internacionalizacion-educativa",
    label: "Internacionalización y alianzas académicas",
    industry: "educacion",
  },
  {
    slug: "evaluacion-online-proctoring",
    label: "Evaluación digital y proctoring",
    industry: "educacion",
  },
  {
    slug: "desarrollo-docente-continua",
    label: "Desarrollo docente y formación del profesorado",
    industry: "educacion",
  },
  {
    slug: "operaciones-campus-servicios",
    label: "Operaciones de campus y servicios estudiantiles",
    industry: "educacion",
  },

  // —— Tecnología e IA
  { slug: "saas", label: "SaaS", industry: "tecnologia-ia" },
  { slug: "b2b-saas", label: "B2B SaaS", industry: "tecnologia-ia" },
  { slug: "devtools", label: "DevTools", industry: "tecnologia-ia" },
  { slug: "ai", label: "AI", industry: "tecnologia-ia" },
  { slug: "deeptech", label: "DeepTech", industry: "tecnologia-ia" },
  { slug: "infra", label: "Infra", industry: "tecnologia-ia" },
  { slug: "cybersecurity", label: "Cybersecurity", industry: "tecnologia-ia" },
  { slug: "data", label: "Data", industry: "tecnologia-ia" },
  { slug: "analytics", label: "Analytics", industry: "tecnologia-ia" },
  {
    slug: "productividad",
    label: "Productividad",
    industry: "tecnologia-ia",
  },
  { slug: "no-code", label: "No-code", industry: "tecnologia-ia" },
  { slug: "web3", label: "Web3", industry: "tecnologia-ia" },
  { slug: "iot", label: "IoT", industry: "tecnologia-ia" },
  { slug: "ar-vr", label: "AR/VR", industry: "tecnologia-ia" },
  { slug: "telecom", label: "Telecom", industry: "tecnologia-ia" },
  { slug: "hardware", label: "Hardware", industry: "tecnologia-ia" },
  { slug: "robotics", label: "Robotics", industry: "tecnologia-ia" },
  {
    slug: "consultoria-implementacion-tech",
    label: "Consultoría tecnológica e implementación",
    industry: "tecnologia-ia",
  },
  {
    slug: "nearshore-outsourcing-tech",
    label: "Nearshore, outsourcing y equipos distribuidos",
    industry: "tecnologia-ia",
  },
  {
    slug: "quantum-computing",
    label: "Computación cuántica y laboratorios avanzados",
    industry: "tecnologia-ia",
  },
  {
    slug: "martech-adtech-plataformas",
    label: "MarTech, AdTech y medición de campañas",
    industry: "tecnologia-ia",
  },
  {
    slug: "plataforma-datos-gobernanza",
    label: "Data platform y gobernanza de datos",
    industry: "tecnologia-ia",
  },
  {
    slug: "gemelos-digitales-industrial",
    label: "Gemelos digitales e ingeniería de simulación",
    industry: "tecnologia-ia",
  },
  {
    slug: "vertical-saas-por-industria",
    label: "SaaS vertical especializado por industria",
    industry: "tecnologia-ia",
  },
  {
    slug: "api-management-integraciones",
    label: "API management e integraciones empresariales",
    industry: "tecnologia-ia",
  },
  {
    slug: "edge-computing-industrial",
    label: "Edge computing y planta conectada",
    industry: "tecnologia-ia",
  },
  {
    slug: "pentesting-red-team",
    label: "Pentesting, red team y evaluación de seguridad",
    industry: "tecnologia-ia",
  },
  {
    slug: "observabilidad-apm",
    label: "Observabilidad, APM y confiabilidad de plataformas",
    industry: "tecnologia-ia",
  },
  {
    slug: "bi-visualizacion-enterprise",
    label: "BI, visualización y analítica enterprise",
    industry: "tecnologia-ia",
  },
  {
    slug: "erp-crm-implementacion",
    label: "Implementación ERP, CRM y partners de sistema",
    industry: "tecnologia-ia",
  },
  {
    slug: "multicloud-finops",
    label: "Multicloud, FinOps y optimización de nube",
    industry: "tecnologia-ia",
  },
  {
    slug: "low-code-bpm-orquestacion",
    label: "Low‑code, BPM y orquestación de procesos",
    industry: "tecnologia-ia",
  },
  {
    slug: "automatizacion-rpa",
    label: "Automatización RPA e hiperautomatización",
    industry: "tecnologia-ia",
  },
  {
    slug: "semiconductor-fabless-ip",
    label: "Semiconductores, IP cores y fabless",
    industry: "tecnologia-ia",
  },

  // —— Gobierno y sector público
  { slug: "govtech", label: "GovTech", industry: "gobierno-sector-publico" },
  {
    slug: "impacto-social",
    label: "Impacto social",
    industry: "gobierno-sector-publico",
  },
  { slug: "comunidad", label: "Comunidad", industry: "gobierno-sector-publico" },
  {
    slug: "defensa-seguridad-publica",
    label: "Defensa y seguridad ciudadana",
    industry: "gobierno-sector-publico",
  },
  {
    slug: "educacion-publica-sector",
    label: "Educación pública y políticas educativas",
    industry: "gobierno-sector-publico",
  },
  {
    slug: "salud-publica-sistema",
    label: "Salud pública y sistemas de salud",
    industry: "gobierno-sector-publico",
  },
  {
    slug: "infraestructura-publica-obras",
    label: "Infraestructura y obras públicas",
    industry: "gobierno-sector-publico",
  },
  {
    slug: "municipios-gobiernos-locales",
    label: "Municipios y gobiernos locales",
    industry: "gobierno-sector-publico",
  },
  {
    slug: "ong-filantropia-desarrollo",
    label: "ONG, filantropía y cooperación al desarrollo",
    industry: "gobierno-sector-publico",
  },
  {
    slug: "compras-publicas-digitales",
    label: "Compras y licitaciones públicas digitales",
    industry: "gobierno-sector-publico",
  },
  {
    slug: "justicia-digital-judicial",
    label: "Justicia digital y servicios judiciales en línea",
    industry: "gobierno-sector-publico",
  },
  {
    slug: "smart-cities-movilidad-urbana",
    label: "Smart cities y movilidad urbana pública",
    industry: "gobierno-sector-publico",
  },
  {
    slug: "privacidad-datos-sector-publico",
    label: "Protección de datos y privacidad en el sector público",
    industry: "gobierno-sector-publico",
  },
  {
    slug: "catastro-catastral-registro",
    label: "Catastro, registro y ordenamiento territorial",
    industry: "gobierno-sector-publico",
  },
  {
    slug: "archivos-nacionales-documentacion",
    label: "Archivos nacionales y gestión documental pública",
    industry: "gobierno-sector-publico",
  },
  {
    slug: "identidad-digital-ciudadania",
    label: "Identidad digital y trámites de ciudadanía",
    industry: "gobierno-sector-publico",
  },
  {
    slug: "cultura-artes-politica-publica",
    label: "Cultura, artes y políticas culturales públicas",
    industry: "gobierno-sector-publico",
  },
  {
    slug: "ciencia-tecnologia-politica-innovacion",
    label: "CTI, innovación pública y laboratorios de gobierno",
    industry: "gobierno-sector-publico",
  },
  {
    slug: "adquisiciones-defensa-industrial",
    label: "Adquisiciones de defensa e industria estratégica",
    industry: "gobierno-sector-publico",
  },
  {
    slug: "transicion-justa-energia-publica",
    label: "Transición energética justa (enfoque público)",
    industry: "gobierno-sector-publico",
  },
  {
    slug: "estadistica-oficial-encuestas",
    label: "Estadística oficial, censos y encuestas",
    industry: "gobierno-sector-publico",
  },
  {
    slug: "migracion-consular-servicios",
    label: "Migración, consulados y servicios en frontera",
    industry: "gobierno-sector-publico",
  },

  // —— Retail y comercio
  { slug: "marketplace", label: "Marketplace", industry: "retail-comercio" },
  { slug: "e-commerce", label: "E-commerce", industry: "retail-comercio" },
  { slug: "consumer", label: "Consumer", industry: "retail-comercio" },
  { slug: "b2b", label: "B2B", industry: "retail-comercio" },
  { slug: "retail", label: "Retail", industry: "retail-comercio" },
  { slug: "ventas", label: "Ventas", industry: "retail-comercio" },
  { slug: "marketing", label: "Marketing", industry: "retail-comercio" },
  {
    slug: "retail-alimentario-conveniencia",
    label: "Retail alimentario y conveniencia",
    industry: "retail-comercio",
  },
  {
    slug: "moda-belleza-lujo",
    label: "Moda, belleza y lujo",
    industry: "retail-comercio",
  },
  {
    slug: "electro-hogar-tecnologia-consumo",
    label: "Electro, hogar y tecnología de consumo",
    industry: "retail-comercio",
  },
  {
    slug: "marcas-directas-d2c",
    label: "Marcas directas (D2C) y suscripciones",
    industry: "retail-comercio",
  },
  {
    slug: "mayoreo-cash-carry",
    label: "Mayoreo, cash & carry y distribución",
    industry: "retail-comercio",
  },
  {
    slug: "trade-marketing-retail-media",
    label: "Trade marketing y retail media",
    industry: "retail-comercio",
  },
  {
    slug: "quick-commerce-dark-store",
    label: "Quick commerce y dark stores",
    industry: "retail-comercio",
  },
  {
    slug: "cpg-fmcg-gran-consumo",
    label: "CPG / FMCG y gran consumo",
    industry: "retail-comercio",
  },
  {
    slug: "travel-retail-duty-free",
    label: "Travel retail y duty free",
    industry: "retail-comercio",
  },
  {
    slug: "retail-financiero-corresponsalia",
    label: "Retail financiero y corresponsalía",
    industry: "retail-comercio",
  },
  {
    slug: "centros-comerciales-experiencia",
    label: "Centros comerciales y experiencia de shopping",
    industry: "retail-comercio",
  },
  {
    slug: "retail-automotriz-posventa",
    label: "Retail automotriz y posventa",
    industry: "retail-comercio",
  },
  {
    slug: "farmacia-parafarmacia-retail",
    label: "Farmacia, parafarmacia y dermocosmética en retail",
    industry: "retail-comercio",
  },
  {
    slug: "pet-care-retail",
    label: "Pet care, alimento y accesorios para mascotas",
    industry: "retail-comercio",
  },
  {
    slug: "hogar-muebles-decoracion",
    label: "Hogar, muebles y decoración",
    industry: "retail-comercio",
  },
  {
    slug: "deportes-outdoor-retail",
    label: "Deportes, outdoor y lifestyle activo",
    industry: "retail-comercio",
  },
  {
    slug: "optica-audio-retail",
    label: "Óptica, audio y salud en retail",
    industry: "retail-comercio",
  },
  {
    slug: "b2b-marketplace-mayoreo-digital",
    label: "B2B marketplace y mayoreo digital",
    industry: "retail-comercio",
  },
  {
    slug: "loss-prevention-seguridad-retail",
    label: "Loss prevention y seguridad en tienda",
    industry: "retail-comercio",
  },
  {
    slug: "libreria-papeleria-cultura-retail",
    label: "Librería, papelería y cultura en retail",
    industry: "retail-comercio",
  },

  // —— Entretenimiento y medios
  { slug: "gaming", label: "Gaming", industry: "entretenimiento-medios" },
  { slug: "media", label: "Media", industry: "entretenimiento-medios" },
  {
    slug: "entertainment",
    label: "Entertainment",
    industry: "entretenimiento-medios",
  },
  { slug: "cine", label: "Cine", industry: "entretenimiento-medios" },
  { slug: "teatro", label: "Teatro", industry: "entretenimiento-medios" },
  { slug: "musica", label: "Música", industry: "entretenimiento-medios" },
  {
    slug: "radio-y-podcast",
    label: "Radio y podcast",
    industry: "entretenimiento-medios",
  },
  { slug: "documental", label: "Documental", industry: "entretenimiento-medios" },
  { slug: "animacion", label: "Animación", industry: "entretenimiento-medios" },
  {
    slug: "video-y-produccion-audiovisual",
    label: "Video y producción audiovisual",
    industry: "entretenimiento-medios",
  },
  {
    slug: "escenografia-y-direccion-de-arte",
    label: "Escenografía y dirección de arte",
    industry: "entretenimiento-medios",
  },
  {
    slug: "videojuegos-y-narrativa-interactiva",
    label: "Videojuegos y narrativa interactiva",
    industry: "entretenimiento-medios",
  },
  {
    slug: "creator-economy",
    label: "Creator economy",
    industry: "entretenimiento-medios",
  },
  {
    slug: "streaming-plataformas",
    label: "Streaming y plataformas digitales",
    industry: "entretenimiento-medios",
  },
  {
    slug: "eventos-en-vivo-festivales",
    label: "Eventos en vivo y festivales",
    industry: "entretenimiento-medios",
  },
  {
    slug: "talentos-influencers",
    label: "Talento, agencias e influencia digital",
    industry: "entretenimiento-medios",
  },
  {
    slug: "esports-competitivo",
    label: "Esports y competición profesional",
    industry: "entretenimiento-medios",
  },
  {
    slug: "agencia-creativa-produccion",
    label: "Agencia creativa y producción integral",
    industry: "entretenimiento-medios",
  },
  {
    slug: "parques-tematicos-atracciones",
    label: "Parques temáticos y atracciones",
    industry: "entretenimiento-medios",
  },
  {
    slug: "editorial-suscriptores-memberships",
    label: "Editorial, suscriptores y memberships",
    industry: "entretenimiento-medios",
  },
  {
    slug: "locacion-espacios-audiovisuales",
    label: "Locación, renta de estudios y espacios",
    industry: "entretenimiento-medios",
  },
  {
    slug: "standup-comedy-clubes",
    label: "Stand‑up, comedia en vivo y clubes",
    industry: "entretenimiento-medios",
  },
  {
    slug: "venues-conciertos-en-vivo",
    label: "Venues, conciertos y música en vivo",
    industry: "entretenimiento-medios",
  },
  {
    slug: "management-artistico-booking",
    label: "Management artístico y booking",
    industry: "entretenimiento-medios",
  },
  {
    slug: "sync-licencias-musica-publicidad",
    label: "Sync, licencias musicales y publicidad",
    industry: "entretenimiento-medios",
  },
  {
    slug: "vfx-post-animation-studios",
    label: "VFX, posproducción y estudios de animación",
    industry: "entretenimiento-medios",
  },
  {
    slug: "doblaje-locucion-audiobooks",
    label: "Doblaje, locución y audiolibros",
    industry: "entretenimiento-medios",
  },
  {
    slug: "esports-franquicias-equipos",
    label: "Franquicias y operación de equipos esports",
    industry: "entretenimiento-medios",
  },
  {
    slug: "experiencias-inmersivas-xr",
    label: "Experiencias inmersivas XR y venue digital",
    industry: "entretenimiento-medios",
  },
  {
    slug: "film-commissions-locaciones",
    label: "Film commissions y atracción de rodajes",
    industry: "entretenimiento-medios",
  },
  {
    slug: "distribucion-exhibicion-audiovisual",
    label: "Distribución y exhibición audiovisual",
    industry: "entretenimiento-medios",
  },

  // —— Artes, diseño y creativo
  { slug: "arquitectura", label: "Arquitectura", industry: "artes-diseno-creativo" },
  { slug: "danza", label: "Danza", industry: "artes-diseno-creativo" },
  { slug: "diseno", label: "Diseño", industry: "artes-diseno-creativo" },
  { slug: "moda", label: "Moda", industry: "artes-diseno-creativo" },
  { slug: "fotografia", label: "Fotografía", industry: "artes-diseno-creativo" },
  { slug: "periodismo", label: "Periodismo", industry: "artes-diseno-creativo" },
  {
    slug: "museos-y-patrimonio",
    label: "Museos y patrimonio",
    industry: "artes-diseno-creativo",
  },
  { slug: "literatura", label: "Literatura", industry: "artes-diseno-creativo" },
  {
    slug: "artes-plasticas-y-visuales",
    label: "Artes plásticas y visuales",
    industry: "artes-diseno-creativo",
  },
  {
    slug: "artes-escenicas-teatro-musical",
    label: "Artes escénicas y teatro musical",
    industry: "artes-diseno-creativo",
  },
  {
    slug: "artesania-oficios-creativos",
    label: "Artesanía y oficios creativos",
    industry: "artes-diseno-creativo",
  },
  {
    slug: "contenido-comunidad-ugc",
    label: "Contenido de comunidad (UGC) y co-creación",
    industry: "artes-diseno-creativo",
  },
  {
    slug: "estudio-brand-identidad",
    label: "Estudio de marca e identidad visual",
    industry: "artes-diseno-creativo",
  },
  {
    slug: "diseno-industrial-producto-fisico",
    label: "Diseño industrial y producto físico",
    industry: "artes-diseno-creativo",
  },
  {
    slug: "arte-videojuegos-indie",
    label: "Arte y visdev para videojuegos",
    industry: "artes-diseno-creativo",
  },
  {
    slug: "gestion-patrimonio-cultural",
    label: "Gestión de patrimonio y proyectos culturales",
    industry: "artes-diseno-creativo",
  },
  {
    slug: "caligrafia-tipografia-edicion",
    label: "Caligrafía, tipografía y edición gráfica",
    industry: "artes-diseno-creativo",
  },
  {
    slug: "curaduria-exposiciones-temporales",
    label: "Curaduría y exposiciones temporales",
    industry: "artes-diseno-creativo",
  },
  {
    slug: "arte-urbano-intervencion-publica",
    label: "Arte urbano e intervención en espacio público",
    industry: "artes-diseno-creativo",
  },
  {
    slug: "talleres-arte-comunitario",
    label: "Talleres, residencias y arte comunitario",
    industry: "artes-diseno-creativo",
  },
  {
    slug: "fotografia-producto-ecommerce",
    label: "Fotografía de producto y e‑commerce visual",
    industry: "artes-diseno-creativo",
  },
  {
    slug: "joyeria-orfebreria-contemporanea",
    label: "Joyería y orfebrería contemporánea",
    industry: "artes-diseno-creativo",
  },
  {
    slug: "ceramica-artistica-mesa",
    label: "Cerámica artística y diseño de mesa",
    industry: "artes-diseno-creativo",
  },
  {
    slug: "performance-arte-accion",
    label: "Performance y arte de acción",
    industry: "artes-diseno-creativo",
  },
  {
    slug: "comic-ilustrado-narrativa-grafica",
    label: "Cómic, novela gráfica e ilustración editorial",
    industry: "artes-diseno-creativo",
  },
  {
    slug: "arte-digital-experimental",
    label: "Arte digital experimental y nuevos medios",
    industry: "artes-diseno-creativo",
  },

  // —— Construcción e inmobiliario
  {
    slug: "construccion",
    label: "Construcción",
    industry: "construccion-inmobiliario",
  },
  {
    slug: "real-estate",
    label: "Real Estate",
    industry: "construccion-inmobiliario",
  },
  { slug: "proptech", label: "Proptech", industry: "construccion-inmobiliario" },
  {
    slug: "urbanismo-ciudad",
    label: "Urbanismo y planeación territorial",
    industry: "construccion-inmobiliario",
  },
  {
    slug: "facility-property-management",
    label: "Facility y property management",
    industry: "construccion-inmobiliario",
  },
  {
    slug: "interiorismo-espacios",
    label: "Interiorismo y diseño de espacios",
    industry: "construccion-inmobiliario",
  },
  {
    slug: "obra-civil-ingenieria",
    label: "Obra civil e ingeniería de proyectos",
    industry: "construccion-inmobiliario",
  },
  {
    slug: "inversion-inmobiliaria-reits",
    label: "Inversión inmobiliaria, REITs y patrimonio",
    industry: "construccion-inmobiliario",
  },
  {
    slug: "edificios-inteligentes-operacion",
    label: "Edificios inteligentes y operación tecnológica",
    industry: "construccion-inmobiliario",
  },
  {
    slug: "due-diligence-tecnica-transacciones",
    label: "Due diligence técnica y transacciones",
    industry: "construccion-inmobiliario",
  },
  {
    slug: "restauracion-patrimonio-edificado",
    label: "Restauración de patrimonio edificado",
    industry: "construccion-inmobiliario",
  },
  {
    slug: "infraestructura-deportiva-publica",
    label: "Infraestructura deportiva y espacios públicos",
    industry: "construccion-inmobiliario",
  },
  {
    slug: "vivienda-renta-servicing",
    label: "Vivienda en renta, multifamily y servicing",
    industry: "construccion-inmobiliario",
  },
  {
    slug: "naves-industriales-logistica",
    label: "Naves industriales y desarrollo logístico",
    industry: "construccion-inmobiliario",
  },
  {
    slug: "mep-climatizacion-obra",
    label: "MEP, climatización e instalaciones en obra",
    industry: "construccion-inmobiliario",
  },
  {
    slug: "impermeabilizacion-especialidades-obra",
    label: "Impermeabilización y especialidades de obra",
    industry: "construccion-inmobiliario",
  },
  {
    slug: "demolicion-reciclaje-escombro",
    label: "Demolición selectiva y reciclaje de escombros",
    industry: "construccion-inmobiliario",
  },
  {
    slug: "geotecnia-cimentaciones",
    label: "Geotecnia y cimentaciones especiales",
    industry: "construccion-inmobiliario",
  },
  {
    slug: "seguros-obra-reclamaciones",
    label: "Seguros de obra, reclamaciones y garantías",
    industry: "construccion-inmobiliario",
  },
  {
    slug: "bim-coordinacion-vdc-obra",
    label: "BIM, coordinación multidisciplinaria y VDC en obra",
    industry: "construccion-inmobiliario",
  },

  // —— Manufactura e industria
  { slug: "manufactura", label: "Manufactura", industry: "manufactura-industria" },
  {
    slug: "supply-chain",
    label: "Supply Chain",
    industry: "manufactura-industria",
  },
  { slug: "logistica", label: "Logística", industry: "manufactura-industria" },
  { slug: "movilidad", label: "Movilidad", industry: "manufactura-industria" },
  { slug: "transporte", label: "Transporte", industry: "manufactura-industria" },
  {
    slug: "aeroespacial",
    label: "Aeroespacial",
    industry: "manufactura-industria",
  },
  {
    slug: "automotriz-y-movilidad-industrial",
    label: "Automotriz y componentes",
    industry: "manufactura-industria",
  },
  {
    slug: "industria-naval-maritima",
    label: "Naval, marítimo y astilleros",
    industry: "manufactura-industria",
  },
  {
    slug: "quimica-materiales-procesos",
    label: "Química, materiales y procesos industriales",
    industry: "manufactura-industria",
  },
  {
    slug: "embalaje-packaging-industrial",
    label: "Embalaje y packaging industrial",
    industry: "manufactura-industria",
  },
  {
    slug: "metalmecanica-industrial",
    label: "Metalmecánica y maquinados",
    industry: "manufactura-industria",
  },
  {
    slug: "automatizacion-industria-4",
    label: "Automatización, robótica industrial e Industria 4.0",
    industry: "manufactura-industria",
  },
  {
    slug: "industria-farmaceutica-manufactura",
    label: "Manufactura farmacéutica y bio",
    industry: "manufactura-industria",
  },
  {
    slug: "alimentos-procesados-industria",
    label: "Alimentos procesados y planta industrial",
    industry: "manufactura-industria",
  },
  {
    slug: "cogeneracion-utilities-planta",
    label: "Cogeneración y utilities de planta",
    industry: "manufactura-industria",
  },
  {
    slug: "maquila-export-manufactura",
    label: "Maquila, export manufacturing y nearshoring",
    industry: "manufactura-industria",
  },
  {
    slug: "textil-confeccion-industrial",
    label: "Textil, confección y moda industrial",
    industry: "manufactura-industria",
  },
  {
    slug: "muebleria-madera-industrial",
    label: "Mueblería, madera y carpintería industrial",
    industry: "manufactura-industria",
  },
  {
    slug: "vidrio-ceramica-industrial",
    label: "Vidrio, cerámica industrial y refractarios",
    industry: "manufactura-industria",
  },
  {
    slug: "papel-carton-empaque",
    label: "Papel, cartón y empaque sostenible",
    industry: "manufactura-industria",
  },
  {
    slug: "fundicion-forja-metalurgia",
    label: "Fundición, forja y metalurgia",
    industry: "manufactura-industria",
  },
  {
    slug: "plastico-extrusion-inyeccion",
    label: "Plástico, extrusión e inyección industrial",
    industry: "manufactura-industria",
  },
  {
    slug: "pinturas-recubrimientos-industriales",
    label: "Pinturas y recubrimientos industriales",
    industry: "manufactura-industria",
  },
  {
    slug: "caucho-neumaticos-componentes",
    label: "Caucho, neumáticos y componentes poliméricos",
    industry: "manufactura-industria",
  },
  {
    slug: "cosmetica-planta-cuidado-personal",
    label: "Cosmética y cuidado personal en planta",
    industry: "manufactura-industria",
  },
  {
    slug: "maquinaria-equipo-industrial-servicio",
    label: "Maquinaria, equipo industrial y servicio técnico",
    industry: "manufactura-industria",
  },

  // —— Energía y sustentabilidad
  { slug: "climate", label: "Climate", industry: "energia-sustentabilidad" },
  {
    slug: "sostenibilidad",
    label: "Sostenibilidad",
    industry: "energia-sustentabilidad",
  },
  { slug: "energia", label: "Energía", industry: "energia-sustentabilidad" },
  {
    slug: "energia-solar-y-renovable",
    label: "Solar y energías renovables distribuidas",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "eolica-offshore-utility-scale",
    label: "Eólica, offshore y proyectos utility scale",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "petroleo-gas-energeticos",
    label: "Petróleo, gas y energéticos tradicionales",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "utilities-redes-electricas",
    label: "Utilities, redes y operación del sistema",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "agua-saneamiento-hidrico",
    label: "Agua, saneamiento e hidráulica",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "residuos-reciclaje-valorizacion",
    label: "Residuos, reciclaje y valorización",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "carbono-mercados-ambientales",
    label: "Carbono, biodiversidad y mercados ambientales",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "economia-circular-industrial",
    label: "Economía circular y reuse industrial",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "hidrogeno-almacenamiento-energetico",
    label: "Hidrógeno, almacenamiento y flexibilidad",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "consultoria-impacto-ambiental",
    label: "Consultoría de impacto y estudios ambientales",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "biodiversidad-naturaleza-soluciones",
    label: "Biodiversidad y soluciones basadas en naturaleza",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "nuclear-servicios-combustible",
    label: "Servicios a centrales nucleares y ciclo del combustible",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "mineria-cierre-post-mineria",
    label: "Cierre de minas y rehabilitación post‑minería",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "eficiencia-energetica-edificaciones",
    label: "Eficiencia energética en edificaciones",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "demanda-respuesta-grid-flexibility",
    label: "Gestión de demanda y flexibilidad de red",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "mercado-mayorista-electrico",
    label: "Mercado mayorista y comercialización eléctrica",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "auditorias-certificacion-energetica",
    label: "Auditorías y certificación energética / normativa",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "agrivoltaica-energia-suelo",
    label: "Agrivoltaica y uso dual del suelo",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "baterias-segunda-vida-reciclaje",
    label: "Baterías, segunda vida y reciclaje de acumulación",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "compliance-ambiental-operacion",
    label: "Compliance ambiental de operación industrial",
    industry: "energia-sustentabilidad",
  },
  {
    slug: "infraestructura-recarga-movilidad-electrica",
    label: "Infraestructura de recarga y hubs de movilidad eléctrica",
    industry: "energia-sustentabilidad",
  },

  // —— Agro y alimentación
  { slug: "agtech", label: "Agtech", industry: "agro-alimentacion" },
  { slug: "foodtech", label: "Foodtech", industry: "agro-alimentacion" },
  {
    slug: "cultivos-semillas-agricultura",
    label: "Cultivos, semillas y agricultura de precisión",
    industry: "agro-alimentacion",
  },
  {
    slug: "ganaderia-lacteos-proteinas",
    label: "Ganadería, lácteos y proteínas",
    industry: "agro-alimentacion",
  },
  {
    slug: "acuicultura-pesca",
    label: "Acuicultura y pesca responsable",
    industry: "agro-alimentacion",
  },
  {
    slug: "bebidas-vinos-y-alcohol",
    label: "Bebidas, vinos y licores",
    industry: "agro-alimentacion",
  },
  {
    slug: "restaurantes-food-service",
    label: "Restaurantes, catering y food service",
    industry: "agro-alimentacion",
  },
  {
    slug: "distribucion-retail-alimentario",
    label: "Distribución y retail alimentario (B2B/B2C)",
    industry: "agro-alimentacion",
  },
  {
    slug: "inocuidad-trazabilidad-alimentaria",
    label: "Inocuidad, trazabilidad y normativa alimentaria",
    industry: "agro-alimentacion",
  },
  {
    slug: "nutricion-ingredientes-alimentarios",
    label: "Ingredientes, nutrición y formulación",
    industry: "agro-alimentacion",
  },
  {
    slug: "export-agro-commodities",
    label: "Exportación agro y trading de commodities",
    industry: "agro-alimentacion",
  },
  {
    slug: "organico-certificaciones-export",
    label: "Orgánico, certificaciones y exportación",
    industry: "agro-alimentacion",
  },
  {
    slug: "cooperativas-asociaciones-rurales",
    label: "Cooperativas y asociaciones rurales",
    industry: "agro-alimentacion",
  },
  {
    slug: "agricultura-regenerativa-suelo",
    label: "Agricultura regenerativa y salud del suelo",
    industry: "agro-alimentacion",
  },
  {
    slug: "riego-precision-agua",
    label: "Riego tecnificado y gestión hídrica agrícola",
    industry: "agro-alimentacion",
  },
  {
    slug: "bioinsumos-biocontrol",
    label: "Bioinsumos, biocontrol y agricultura biológica",
    industry: "agro-alimentacion",
  },
  {
    slug: "fruticultura-especializada",
    label: "Fruticultura de especialidad y berries",
    industry: "agro-alimentacion",
  },
  {
    slug: "cafe-cacao-origen",
    label: "Café, cacao y orígenes de altitud",
    industry: "agro-alimentacion",
  },
  {
    slug: "lacteos-procesamiento-rural",
    label: "Lácteos y queserías de escala regional",
    industry: "agro-alimentacion",
  },
  {
    slug: "carnicos-rastro-transformacion",
    label: "Cárnicos, rastro y transformación local",
    industry: "agro-alimentacion",
  },
  {
    slug: "food-safety-auditorias-terceros",
    label: "Food safety y auditorías de tercera parte",
    industry: "agro-alimentacion",
  },
  {
    slug: "packaging-alimentos-sostenible",
    label: "Packaging alimentario y materiales sostenibles",
    industry: "agro-alimentacion",
  },
  {
    slug: "agricultura-invernadero-controlado",
    label: "Agricultura protegida, invernadero y cultivo controlado",
    industry: "agro-alimentacion",
  },

  // —— Turismo y hospitalidad
  {
    slug: "traveltech",
    label: "Traveltech",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "hoteles-resorts",
    label: "Hoteles, resorts y cadenas",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "hostales-alojamiento-alternativo",
    label: "Hostales, boutique y alojamiento alternativo",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "gastronomia-restaurantes-bares",
    label: "Gastronomía, restaurantes y bares",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "turismo-cultural-patrimonio",
    label: "Turismo cultural, museos y rutas patrimoniales",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "ecoturismo-aventura-naturaleza",
    label: "Ecoturismo, aventura y naturaleza",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "aviacion-lineas-aereas",
    label: "Aviación comercial y low cost",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "cruceros-navegacion-recreativa",
    label: "Cruceros y navegación recreativa",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "agencias-viajes-ota",
    label: "Agencias de viajes y OTA",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "mice-congresos-convenciones",
    label: "MICE, congresos y convenciones",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "casinos-entretenimiento-turistico",
    label: "Casinos y entretenimiento regulado",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "spa-termal-wellness-turistico",
    label: "Spa, termal y wellness turístico",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "turismo-negocios-bleisure",
    label: "Turismo de negocios y bleisure",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "alquiler-vacacional-stays",
    label: "Alquiler vacacional y stays de corta estadía",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "turismo-deportivo-eventos-mayores",
    label: "Turismo deportivo y megaeventos",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "guias-interpretacion-idiomas",
    label: "Guías, interpretación e idiomas especializados",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "turismo-accesible-inclusivo",
    label: "Turismo accesible e inclusivo",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "turismo-lgbtq-segmento",
    label: "Turismo LGBTQ+ friendly y segmentos",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "turismo-educativo-workshops",
    label: "Turismo educativo, workshops y residencias",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "transporte-turistico-terrestre",
    label: "Transporte turístico terrestre y traslados",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "asistencia-viajero-insurtech",
    label: "Asistencia al viajero y seguros turísticos",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "revenue-hotelero-herramientas",
    label: "Revenue management y distribución hotelera",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "turismo-marino-buceo-nautico",
    label: "Turismo marino, buceo y náutica",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "turismo-rural-comunitario",
    label: "Turismo rural, comunitario y experiencias locales",
    industry: "turismo-hospitalidad",
  },
  {
    slug: "enoturismo-rutas-gastronomicas",
    label: "Enoturismo, destilados y rutas gastronómicas",
    industry: "turismo-hospitalidad",
  },

  // —— Legal y consultoría
  { slug: "legaltech", label: "Legaltech", industry: "legal-consultoria" },
  { slug: "hrtech", label: "HRTech", industry: "legal-consultoria" },
  { slug: "recruiting", label: "Recruiting", industry: "legal-consultoria" },
  {
    slug: "consultoria-estrategia-management",
    label: "Consultoría de estrategia y management",
    industry: "legal-consultoria",
  },
  {
    slug: "consultoria-operaciones-transformacion",
    label: "Operaciones y transformación organizacional",
    industry: "legal-consultoria",
  },
  {
    slug: "auditoria-risk-advisory",
    label: "Auditoría y risk advisory",
    industry: "legal-consultoria",
  },
  {
    slug: "fiscal-contable-asuntos-corporativos",
    label: "Fiscal, contable y asuntos societarios",
    industry: "legal-consultoria",
  },
  {
    slug: "people-advisory-y-rh-estrategico",
    label: "People advisory, compensación y RH estratégico",
    industry: "legal-consultoria",
  },
  {
    slug: "marketing-brand-consultoria",
    label: "Consultoría de marca, comunicación y growth",
    industry: "legal-consultoria",
  },
  {
    slug: "despacho-boutique-legal",
    label: "Despacho boutique y práctica de nicho",
    industry: "legal-consultoria",
  },
  {
    slug: "legal-operations-outsourcing",
    label: "Legal operations y outsourcing jurídico",
    industry: "legal-consultoria",
  },
  {
    slug: "ma-transacciones-corporativas",
    label: "M&A y transacciones corporativas (advisory)",
    industry: "legal-consultoria",
  },
  {
    slug: "compliance-penal-empresarial",
    label: "Compliance penal y gobierno corporativo",
    industry: "legal-consultoria",
  },
  {
    slug: "proteccion-consumidor-b2c",
    label: "Protección al consumidor y litigio B2C",
    industry: "legal-consultoria",
  },
  {
    slug: "competencia-antitrust",
    label: "Competencia económica y antitrust",
    industry: "legal-consultoria",
  },
  {
    slug: "privacidad-dpo-externo",
    label: "Privacidad, DPO externo y datos",
    industry: "legal-consultoria",
  },
  {
    slug: "contratacion-saas-tech-legal",
    label: "Contratación tecnológica, SaaS y licencias",
    industry: "legal-consultoria",
  },
  {
    slug: "laboral-sindical-colectivo",
    label: "Laboral sindical y negociación colectiva",
    industry: "legal-consultoria",
  },
  {
    slug: "legal-inmobiliario-transaccional",
    label: "Legal inmobiliario y transaccional",
    industry: "legal-consultoria",
  },
  {
    slug: "venture-startups-cap-table",
    label: "Venture, startups y cap table",
    industry: "legal-consultoria",
  },
  {
    slug: "propiedad-intelectual-patentes",
    label: "Propiedad intelectual y patentes",
    industry: "legal-consultoria",
  },
  {
    slug: "mediacion-arbitraje-comercial",
    label: "Mediación y arbitraje comercial",
    industry: "legal-consultoria",
  },

  // —— Deporte y bienestar
  { slug: "wellness", label: "Wellness", industry: "deporte-bienestar" },
  { slug: "sports", label: "Sports", industry: "deporte-bienestar" },
  {
    slug: "gimnasios-fitness-boutique",
    label: "Gimnasios, boutique fitness y franquicias",
    industry: "deporte-bienestar",
  },
  {
    slug: "deporte-profesional-ligas",
    label: "Deporte profesional y ligas",
    industry: "deporte-bienestar",
  },
  {
    slug: "deporte-amateur-comunidad",
    label: "Deporte amateur, escuelas y comunidad",
    industry: "deporte-bienestar",
  },
  {
    slug: "nutricion-deportiva-rendimiento",
    label: "Nutrición deportiva y alto rendimiento",
    industry: "deporte-bienestar",
  },
  {
    slug: "fisioterapia-recuperacion",
    label: "Fisioterapia, rehabilitación y recuperación",
    industry: "deporte-bienestar",
  },
  {
    slug: "mindfulness-coaching-bienestar",
    label: "Mindfulness, coaching y bienestar integral",
    industry: "deporte-bienestar",
  },
  {
    slug: "federaciones-organizadores-eventos",
    label: "Federaciones y organización de eventos deportivos",
    industry: "deporte-bienestar",
  },
  {
    slug: "tecnologia-wearables-health-fitness",
    label: "Wearables y tecnología aplicada al rendimiento",
    industry: "deporte-bienestar",
  },
  {
    slug: "centros-rehabilitacion-deportiva",
    label: "Centros de rehabilitación y readaptación",
    industry: "deporte-bienestar",
  },
  {
    slug: "padel-tenis-clubes-raqueta",
    label: "Pádel, tenis y clubes de raqueta",
    industry: "deporte-bienestar",
  },
  {
    slug: "yoga-pilates-mind-body-studios",
    label: "Yoga, pilates y estudios mind-body",
    industry: "deporte-bienestar",
  },
  {
    slug: "crossfit-hiit-boxes-funcional",
    label: "CrossFit, HIIT y entrenamiento funcional en box",
    industry: "deporte-bienestar",
  },
  {
    slug: "natacion-deportes-acuaticos-clubes",
    label: "Natación, deportes acuáticos y clubes",
    industry: "deporte-bienestar",
  },
  {
    slug: "ciclismo-running-triatlon-comunidades",
    label: "Ciclismo, running y triatlón (comunidades y eventos)",
    industry: "deporte-bienestar",
  },
  {
    slug: "artes-marciales-deportes-combate",
    label: "Artes marciales y deportes de combate",
    industry: "deporte-bienestar",
  },
  {
    slug: "deportes-invierno-montana-outdoor",
    label: "Deportes de invierno y outdoor de montaña",
    industry: "deporte-bienestar",
  },
  {
    slug: "esports-performance-comunidad",
    label: "Esports, rendimiento y comunidad competitiva",
    industry: "deporte-bienestar",
  },
  {
    slug: "spa-termal-wellness-destination",
    label: "Spa, termalismo y wellness destination",
    industry: "deporte-bienestar",
  },
  {
    slug: "suplementos-nutricion-fitness-comercio",
    label: "Suplementos y nutrición fitness (retail y omnicanal)",
    industry: "deporte-bienestar",
  },
] as const

function assertUniqueVerticalSlugs() {
  if (process.env.NODE_ENV === "production") return
  const seen = new Set<string>()
  for (const row of VERTICAL_ROWS) {
    if (seen.has(row.slug)) {
      throw new Error(`leaf-catalog: slug duplicado ${row.slug}`)
    }
    seen.add(row.slug)
  }
}
assertUniqueVerticalSlugs()

/** Cada hoja → industria de perfil (slug). */
export const LEAF_SLUG_TO_PROFILE_INDUSTRY: Readonly<Record<string, string>> =
  Object.fromEntries(VERTICAL_ROWS.map((r) => [r.slug, r.industry]))

export const ALL_INDUSTRY_LEAVES: readonly IndustryLeaf[] = VERTICAL_ROWS.map(
  ({ slug, label }) => ({ slug, label })
)

function assertLeafCoverage() {
  if (process.env.NODE_ENV === "production") return
  for (const leaf of ALL_INDUSTRY_LEAVES) {
    if (!LEAF_SLUG_TO_PROFILE_INDUSTRY[leaf.slug]) {
      throw new Error(`leaf-catalog: falta mapa para ${leaf.slug}`)
    }
  }
  for (const slug of Object.keys(LEAF_SLUG_TO_PROFILE_INDUSTRY)) {
    if (!ALL_INDUSTRY_LEAVES.some((l) => l.slug === slug)) {
      throw new Error(`leaf-catalog: slug extra en mapa: ${slug}`)
    }
  }
}
assertLeafCoverage()

/** Slugs de vertical (hoja + general) válidos para una industria de perfil. */
export function verticalSlugSetForProfileIndustry(industrySlug: string): Set<string> {
  const s = new Set<string>([`${industrySlug}-general`])
  for (const leaf of ALL_INDUSTRY_LEAVES) {
    if (LEAF_SLUG_TO_PROFILE_INDUSTRY[leaf.slug] === industrySlug) {
      s.add(leaf.slug)
    }
  }
  return s
}

export function filterVerticalSlugsForIndustrySlug(
  industrySlug: string | null | undefined,
  verticalSlugs: string[] | null | undefined,
  max = 3
): string[] {
  if (!industrySlug || !verticalSlugs?.length) return []
  const allowed = verticalSlugSetForProfileIndustry(industrySlug)
  return verticalSlugs.filter((x) => allowed.has(x)).slice(0, max)
}
