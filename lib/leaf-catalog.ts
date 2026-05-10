/**
 * Hojas del catálogo discover → industria de perfil. Sin deps (evita ciclos con profile-taxonomy).
 * Una sola tabla (VERTICAL_ROWS) alinea mapa y lista; ampliar aquí y en migraciones
 * `20260530120000_expand_industry_verticals.sql` + `20260602120000_expand_verticals_specialization.sql`.
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
