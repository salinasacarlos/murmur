import type { FunctionalArea } from "@/lib/types"
import { filterVerticalSlugsForIndustrySlug } from "@/lib/leaf-catalog"

/** Industria principal (perfil / búsqueda): una sola. */
export interface IndustryDefinition {
  slug: string
  label: string
  sortOrder: number
  mapsTo: FunctionalArea
}

/** Expertise dentro de la industria elegida (máx. 5 en UI). */
export interface ExpertiseDefinition {
  slug: string
  label: string
  sortOrder: number
  mapsTo: FunctionalArea
}

export interface TalentDefinition {
  slug: string
  label: string
  sortOrder: number
}

function slugify(label: string): string {
  return label
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

type Seed = {
  slug: string
  label: string
  mapsTo: FunctionalArea
  expertiseLabels: readonly string[]
}

const INDUSTRY_SEEDS: readonly Seed[] = [
  {
    slug: "tecnologia-ia",
    label: "Tecnología e IA",
    mapsTo: "tecnico",
    expertiseLabels: [
      "Software",
      "Hardware",
      "Ciberseguridad",
      "Datos",
      "Nube",
      "Robótica",
      "IA generativa",
      "IoT",
      "Blockchain",
      "Realidad virtual/aumentada",
      "Semiconductores",
      "Telecomunicaciones",
      "Automatización",
      "Desarrollo web/móvil",
      "Open source",
      "MLOps y ML en producción",
      "Visión por computadora",
      "Procesamiento de lenguaje natural",
      "Edge computing",
      "Observabilidad y SRE",
      "Platform engineering",
      "FinOps y costos en nube",
      "APIs e integraciones",
      "QA y automatización de pruebas",
      "Producto técnico (TPM/PM)",
      "Ingeniería de datos y pipelines",
      "Analytics engineering y BI",
      "AdTech y MarTech",
      "CRM y sistemas comerciales",
      "Sistemas embebidos y firmware",
      "Cómputo científico e HPC",
      "OT, SCADA y sistemas industriales",
      "Audio, voz y speech tech",
      "Identity y gestión de acceso (IAM)",
      "Gobernanza de datos y privacidad",
    ],
  },
  {
    slug: "salud-biotech",
    label: "Salud y biotech",
    mapsTo: "ciencia",
    expertiseLabels: [
      "Medicina clínica",
      "Farmacéutica",
      "Genómica",
      "Salud mental",
      "Dispositivos médicos",
      "Telemedicina",
      "Neurociencia",
      "Oncología",
      "Salud preventiva",
      "Nutrición clínica",
      "Rehabilitación",
      "Salud pública",
      "Bioingeniería",
      "Laboratorios",
      "Medicina tradicional/alternativa",
      "Enfermería y cuidados especializados",
      "Cardiología",
      "Dermatología",
      "Pediatría",
      "Inmunología",
      "Radiología e imagen médica",
      "Patología clínica",
      "Salud digital y apps clínicas",
      "Longevidad y medicina antienvejecimiento",
      "Odontología",
      "Oftalmología y optometría",
      "Medicina veterinaria y One Health",
      "Ensayos clínicos y CRO",
      "Farmacovigilancia",
      "Biomarcadores y diagnóstico avanzado",
      "Salud materno-infantil",
      "Epidemiología",
      "Salud ocupacional",
      "Terapia física y ocupacional",
      "Bienestar laboral y salud corporativa",
    ],
  },
  {
    slug: "educacion",
    label: "Educación",
    mapsTo: "producto",
    expertiseLabels: [
      "Educación básica/media",
      "Universitaria",
      "Formación corporativa",
      "Edtech",
      "Educación alternativa",
      "Pedagogía",
      "Orientación vocacional",
      "Educación especial",
      "Idiomas",
      "Tutorías",
      "Certificaciones profesionales",
      "Educación a distancia",
      "Bibliotecología",
      "STEM y divulgación científica",
      "Evaluación y medición del aprendizaje",
      "Currículo y diseño instruccional",
      "Plataformas LMS y contenido digital",
      "Gestión y dirección escolar",
      "Inclusión, equidad y diversidad",
      "Educación infantil y primera infancia",
      "Educación de adultos y MAYEB",
      "Bootcamps y entrenamiento intensivo",
      "Comunidades de práctica y aprendizaje",
      "Investigación educativa",
      "Intercambios y movilidad estudiantil",
      "Arte y cultura en el currículo",
      "Bibliotecas y recursos digitales",
      "Acreditación y aseguramiento de calidad",
      "Psicología educativa",
      "Comunicación y relaciones educativas",
      "Alfabetización y competencias digitales",
      "Neuroeducación",
      "Educación intercultural y comunitaria",
    ],
  },
  {
    slug: "finanzas-fintech",
    label: "Finanzas y fintech",
    mapsTo: "negocio",
    expertiseLabels: [
      "Banca",
      "Inversión",
      "Seguros",
      "Cripto",
      "Pagos digitales",
      "Finanzas personales",
      "Capital de riesgo",
      "Fondos de inversión",
      "Contabilidad",
      "Auditoría financiera",
      "Microfinanzas",
      "Mercados de capitales",
      "Economía conductual",
      "Planeación fiscal",
      "Wealth management",
      "Private equity",
      "Family office",
      "FX, tesorería y mercados globales",
      "Riesgo crediticio y scoring",
      "RegTech",
      "AML, KYC y compliance financiero",
      "Neobanca y banca digital",
      "BNPL y crédito punto de venta",
      "Factoring, leasing y arrendamiento financiero",
      "Reaseguros y gestión actuarial",
      "FP&A y finanzas corporativas",
      "Valuación de activos y fairness opinion",
      "Trading cuantitativo y mercados",
      "Inversión sostenible y ESG",
      "Crowdfunding y capital semilla regulado",
      "Cobranza y recuperación de cartera",
      "Operaciones y middle/back office",
      "Research y estrategia de mercados",
      "Structured finance y project finance",
    ],
  },
  {
    slug: "entretenimiento-medios",
    label: "Entretenimiento y medios",
    mapsTo: "producto",
    expertiseLabels: [
      "Cine",
      "Música",
      "Videojuegos",
      "Streaming",
      "Podcasting",
      "Prensa digital",
      "Teatro",
      "Televisión",
      "Animación",
      "Cómics/novela gráfica",
      "Eventos en vivo",
      "Realidad virtual inmersiva",
      "Producción audiovisual",
      "Relaciones públicas",
      "Esports y competición",
      "Creators, UGC y comunidades de fans",
      "Marketing y management musical",
      "Festivales, giras y venue management",
      "Derechos, licencias y clearances",
      "Postproducción, color y VFX",
      "Desarrollo de guion e IP",
      "Casting y representación de talento",
      "Distribución multiplataforma",
      "Locución, voice-over y audio para medios",
      "Fotografía editorial y lifestyle",
      "Diseño de sonido y música para medios",
      "Experiencias inmersivas y museografía",
      "Brand integration y branded content",
      "Publishing y edición independiente",
      "Stand-up, comedia en vivo y clubes",
      "Moda y contenido lifestyle",
      "No ficción y formatos documentales",
      "Radio tradicional y syndication",
      "Representación artística y booking",
    ],
  },
  {
    slug: "artes-diseno-creativo",
    label: "Artes y diseño creativo",
    mapsTo: "producto",
    expertiseLabels: [
      "Diseño gráfico",
      "Arquitectura",
      "Moda",
      "Fotografía",
      "Arte contemporáneo",
      "Artesanía",
      "Ilustración",
      "Diseño industrial",
      "Diseño UX/UI",
      "Escultura",
      "Muralismo",
      "Joyería",
      "Cerámica",
      "Dirección de arte",
      "Diseño editorial",
      "Tipografía y lettering",
      "Motion graphics y animación gráfica",
      "Branding e identidad visual",
      "Packaging y unboxing experience",
      "Diseño de espacios expositivos",
      "Arte digital y cultura web3",
      "Restauración y conservación",
      "Curaduría y producción de exposiciones",
      "Producción escénica y stagework",
      "Textiles, patronaje y confección autoral",
      "Storyboard y previsualización",
      "Concept art y visdev",
      "Diseño de producto y prototipado",
      "Bellas artes académicas",
      "Artes mixtas e instalación",
      "Comisariado independiente",
      "Diseño regenerativo y materiales",
      "Fotografía documental y ensayo",
      "Videoarte y nuevos medios",
      "Performance y arte en vivo",
    ],
  },
  {
    slug: "construccion-inmobiliario",
    label: "Construcción e inmobiliario",
    mapsTo: "operaciones",
    expertiseLabels: [
      "Desarrollo urbano",
      "Infraestructura",
      "Proptech",
      "Diseño de interiores",
      "Ingeniería civil",
      "Gestión de obra",
      "Valuación",
      "Urbanismo",
      "Paisajismo",
      "Arquitectura sustentable",
      "Facility management",
      "Vivienda social",
      "BIM, gemelos digitales y colaboración 3D",
      "Prefabricación, modular y construcción industrializada",
      "Costos, control presupuestal y quantity surveying",
      "Contratación, licitaciones y claims",
      "Seguridad, higiene y medio ambiente en obra",
      "Certificaciones LEED, BREEAM y construcción verde",
      "Ingeniería estructural de precisión",
      "Instalaciones MEP y especialidades",
      "Project finance y estructuración inmobiliaria",
      "Asset y property management",
      "Brokerage y transacciones comerciales",
      "Desarrollo de loteos y uso de suelo mixto",
      "Logística industrial y parques",
      "Hospitality real estate y mixed-use",
      "Due diligence técnica y estudios de prefactibilidad",
      "Mantenimiento predictivo de inmuebles",
      "Edificios inteligentes y sistemas integrados",
      "Topografía, levantamientos y lidar",
      "Permisos, impacto urbano y compliance regulatorio",
      "Real estate proptech y captación digital",
    ],
  },
  {
    slug: "manufactura-industria",
    label: "Manufactura e industria",
    mapsTo: "operaciones",
    expertiseLabels: [
      "Automotriz",
      "Electrónica",
      "Textil",
      "Química",
      "Logística",
      "Aeroespacial",
      "Impresión 3D",
      "Control de calidad",
      "Cadena de suministro",
      "Empaque",
      "Metalmecánica",
      "Industria naval",
      "Maquinaria pesada",
      "Industria del plástico",
      "Lean manufacturing y mejora continua",
      "TPM y confiabilidad operativa",
      "Industria 4.0, sensórica y analytics de planta",
      "Robotización y cobots",
      "Química fina y especialidades",
      "Farmoquímica y síntesis industrial",
      "Bebidas y agua embotellada",
      "Cosmética, fragrance y cuidado personal industrial",
      "Papel, celulosa y embalajes fibra",
      "Vidrio, cerámica técnica y refractarios",
      "Minería, metalurgia y fundición",
      "Simulación de planta y plant layout",
      "Compras estratégicas y sourcing global",
      "Manufactura para exportación y nearshoring",
      "Esquemas de maquila y subcontratación",
      "Materiales compuestos y biopolímeros",
      "Energía térmica y utilities de planta",
      "Calibración metrológica y laboratorio industrial",
      "Reverse logistics industrial",
      "Puesta en marcha y commissioning",
    ],
  },
  {
    slug: "agro-alimentacion",
    label: "Agro y alimentación",
    mapsTo: "operaciones",
    expertiseLabels: [
      "Agricultura",
      "Ganadería",
      "Procesamiento de alimentos",
      "Agritech",
      "Restauración",
      "Acuacultura",
      "Viticultura",
      "Industria orgánica",
      "Agroexportación",
      "Packaging alimentario",
      "Investigación agrícola",
      "Silvicultura",
      "Food design",
      "Hidroponía, invernaderos y agricultura vertical",
      "Agricultura de precisión y agrodrones",
      "Semillas, biotecnología vegetal y fitomejoramiento",
      "Insumos, fertilización y nutrición de cultivos",
      "Fitosanidad y manejo integrado de plagas",
      "Lácteos, quesos y derivados industriales",
      "Cárnicos, aves y productos transformados",
      "Panadería, molinos y harinas industriales",
      "Cacao, café y commodity de altura",
      "Retail alimentario y abasto moderno",
      "Inocuidad HACCP y cultura de calidad",
      "Trazabilidad, cadena de frío y última milla alimentaria",
      "Bebidas fermentadas y destilados artesanales",
      "Pesca, acuicultura industrial y valor agregado",
      "Apicultura y polinización comercial",
      "Forestería comercial y aserradero",
      "Biocombustibles y oleoquímicos agrícolas",
      "Comercialización agrícola y desk de commodities",
      "Cooperativas, asociaciones y extensionismo",
      "Nutrición animal y formulación de alimento balanceado",
    ],
  },
  {
    slug: "gobierno-sector-publico",
    label: "Gobierno y sector público",
    mapsTo: "negocio",
    expertiseLabels: [
      "Política pública",
      "Administración",
      "Seguridad",
      "Justicia",
      "Diplomacia",
      "Gestión municipal",
      "Planeación urbana",
      "Transparencia",
      "Relaciones internacionales",
      "Defensa",
      "Servicios sociales",
      "Salud pública",
      "Migración",
      "Regulación",
      "Protección civil y gestión de emergencias",
      "Procuración e impartición de justicia",
      "Hacienda pública y finanzas gubernamentales",
      "Compras públicas y adquisiciones estratégicas",
      "Datos abiertos e interoperabilidad",
      "Gobierno digital y servicios en línea",
      "Participación ciudadana y presupuesto participativo",
      "Ordenamiento territorial y uso de suelo",
      "Políticas educativas públicas",
      "Infraestructura pública y APP",
      "Áreas naturales protegidas y ANP",
      "Cultura, patrimonio y memoria",
      "Estadística oficial y censos",
      "Planeación del desarrollo",
      "Cooperación internacional para el desarrollo",
      "Capital humano y carrera administrativa",
      "Organismos autónomos y reguladores sectoriales",
      "Innovación pública y laboratorios de política",
      "Seguridad nacional y enfoque multidimensional",
      "Fomento económico y clusters regionales",
    ],
  },
  {
    slug: "turismo-hospitalidad",
    label: "Turismo y hospitalidad",
    mapsTo: "negocio",
    expertiseLabels: [
      "Hotelería",
      "Viajes",
      "Gastronomía",
      "Experiencias",
      "Turismo de aventura",
      "Turismo cultural",
      "Agencias de viaje",
      "Guías turísticos",
      "Turismo médico",
      "Turismo sustentable",
      "Cruceros",
      "Aerolíneas",
      "Concierge",
      "Revenue management y distribución hotelera",
      "Housekeeping y operaciones de habitaciones",
      "F&B hotelero y banquetería",
      "MICE y congresos",
      "Oficinas de turismo y gestión de destino",
      "Turismo religioso y peregrinaciones",
      "Turismo de naturaleza y observación",
      "Ecoturismo certificado",
      "Rentas vacacionales y hospitality alternativo",
      "Hostels, glamping y coliving viajero",
      "Hospitalidad de lujo y personalización",
      "Integración de casino-resort y entretenimiento",
      "Parques temáticos y atracciones",
      "Wellness tourism y spas destino",
      "Turismo deportivo y megaeventos",
      "Turismo LGBTQ+ friendly",
      "Turismo accesible y diseño inclusivo",
      "Producto digital y apps de destino",
      "Asistencia al viajero y seguros turísticos",
      "Experiencias gastronómicas destacadas",
    ],
  },
  {
    slug: "energia-sustentabilidad",
    label: "Energía y sustentabilidad",
    mapsTo: "ciencia",
    expertiseLabels: [
      "Energías renovables",
      "Oil & gas",
      "Gestión ambiental",
      "Economía circular",
      "Eficiencia energética",
      "Energía solar",
      "Eólica",
      "Hidrógeno verde",
      "Gestión de residuos",
      "Movilidad eléctrica",
      "Carbono neutro",
      "Consultoría ambiental",
      "Almacenamiento distribuido y BESS",
      "Redes inteligentes y flexibilidad",
      "Geotermia y bombeo térmico",
      "Biogás, digestión anaeróbica y gestión de finos",
      "Captura, uso y almacenamiento de carbono",
      "Mercados de carbono y MRV",
      "Certificaciones ambientales sectoriales",
      "Gestión hídrica y plantas de tratamiento",
      "Biodiversidad, offsets y bancos de hábitat",
      "Impacto ambiental y licencias sectoriales",
      "Due diligence ambiental y M&A verde",
      "Energía nuclear (servicios y regulación)",
      "Minería responsable y cierre de minas",
      "Transición justa y reconversión industrial",
      "Movilidad urbana baja en emisiones",
      "Edificaciones net-zero y envelopes eficientes",
      "Suelos y agricultura climáticamente inteligente",
      "Energía oceánica y mareomotriz",
      "Reportes TCFD y disclosure climático",
      "Generación distribuida y microrredes",
    ],
  },
  {
    slug: "retail-comercio",
    label: "Retail y comercio",
    mapsTo: "negocio",
    expertiseLabels: [
      "E-commerce",
      "Retail físico",
      "Supply chain",
      "Marcas",
      "Merchandising",
      "Experiencia del cliente",
      "Marketplaces",
      "Franquicias",
      "Comercio justo",
      "Retail media",
      "Distribución",
      "Importación/exportación",
      "Pricing y estrategia omnicanal",
      "Revenue management retail",
      "Planogramas, layout y shopper marketing",
      "Fulfillment, dark stores y última milla",
      "Quick commerce y entregas instantáneas",
      "Social commerce y live shopping",
      "Marcas D2C y flagship digital",
      "Outlet, off-price y inventarios estratégicos",
      "Mayoreo B2B y cash & carry",
      "Trade marketing y ejecución en punto de venta",
      "Analítica retail y forecasting de demanda",
      "Prevención de mermas y loss prevention",
      "Loyalty, CRM y datos first-party",
      "Tiendas concepto y flagship físicas",
      "Retail efímero y pop-up stores",
      "Retail en centros comerciales",
      "Retail internacional, aranceles y compliance",
      "Marca propia y sourcing de private label",
      "Canales informales, ferias y micromercados",
      "CDP, analítica omnicanal y personalización",
    ],
  },
  {
    slug: "legal-consultoria",
    label: "Legal y consultoría",
    mapsTo: "negocio",
    expertiseLabels: [
      "Derecho corporativo",
      "Consultoría estratégica",
      "RR.HH.",
      "Auditoría",
      "Propiedad intelectual",
      "Derecho laboral",
      "Notariado",
      "Mediación",
      "Compliance",
      "Derecho internacional",
      "Consultoría de innovación",
      "Gestión del cambio",
      "Litigio civil y mercantil",
      "Arbitraje nacional e internacional",
      "Derecho de familia y sucesiones",
      "Derecho inmobiliario y condominales",
      "Fusiones y adquisiciones (M&A)",
      "Capital markets y ofertas públicas",
      "Privacidad, datos personales y ciberlegal",
      "Contratos tecnológicos y outsourcing IT",
      "Derecho penal corporativo y compliance penal",
      "Planeación fiscal avanzada y controversia",
      "Consultoría operativa y mejoras de procesos",
      "Advisory tecnológico y transformación digital",
      "Executive search de alto nivel",
      "Cultura organizacional y engagement",
      "Desarrollo de liderazgo y coaching ejecutivo",
      "Gestión del desempeño y OKRs",
      "Compensación, nómina estratégica y equity",
      "People analytics y workforce planning",
      "Relaciones laborales, sindicales y negociación colectiva",
      "Servicios integrales de HR outsourcing",
    ],
  },
  {
    slug: "deporte-bienestar",
    label: "Deporte y bienestar",
    mapsTo: "producto",
    expertiseLabels: [
      "Fitness",
      "Nutrición",
      "Deportes profesionales",
      "Medicina deportiva",
      "Yoga/meditación",
      "Coaching",
      "Deportes electrónicos",
      "Gestión deportiva",
      "Psicología del deporte",
      "Biohacking",
      "Spas y wellness",
      "Deporte adaptado",
      "Entrenamiento personal y coaching one-on-one",
      "Fuerza, powerlifting y entrenamiento de rendimiento",
      "Running, trail y endurance",
      "Natación, triatlón y deportes acuáticos",
      "Ciclismo indoor, outdoor y indoor training tech",
      "Functional fitness y HIIT",
      "Danza fitness y coreografías grupales",
      "Artes marciales y combate deportivo",
      "Montañismo, escalada y outdoor sports",
      "Nutrición deportiva suplementada",
      "Fisioterapia y readaptación al esfuerzo",
      "Recuperación, contrast therapy y sueño",
      "Analítica de rendimiento y wearables",
      "Marketing deportivo y activaciones",
      "Patrocinios, naming rights y hospitality deportiva",
      "Derecho deportivo y agentes",
      "Diseño y operación de instalaciones deportivas",
      "Escuelas formativas y captación de talento joven",
      "Turismo activo y deporte experiencial",
      "Salud mental y mindfulness aplicado al deporte",
    ],
  },
] as const

function buildFromSeeds(): {
  industries: readonly IndustryDefinition[]
  expertiseByVertical: Readonly<Record<string, readonly ExpertiseDefinition[]>>
} {
  const industries: IndustryDefinition[] = []
  const expertiseByVertical: Record<string, ExpertiseDefinition[]> = {}
  let iOrd = 10
  for (const seed of INDUSTRY_SEEDS) {
    industries.push({
      slug: seed.slug,
      label: seed.label,
      sortOrder: iOrd,
      mapsTo: seed.mapsTo,
    })
    iOrd += 10
    const genKey = `${seed.slug}-general`
    const ex: ExpertiseDefinition[] = []
    let eOrd = 10
    const usedSlugs = new Set<string>()
    for (const label of seed.expertiseLabels) {
      let piece = slugify(label)
      let slug = `${seed.slug}-${piece}`
      let n = 2
      while (usedSlugs.has(slug)) {
        slug = `${seed.slug}-${piece}-${n}`
        n++
      }
      usedSlugs.add(slug)
      ex.push({
        slug,
        label,
        sortOrder: eOrd,
        mapsTo: seed.mapsTo,
      })
      eOrd += 10
    }
    expertiseByVertical[genKey] = ex
  }
  return { industries, expertiseByVertical }
}

const built = buildFromSeeds()

export const INDUSTRIES: readonly IndustryDefinition[] = built.industries

/** Expertise fino (nivel 3) por vertical; hoy todas las filas viven bajo `{industria}-general` en DB. */
export const EXPERTISE_BY_VERTICAL: Readonly<
  Record<string, readonly ExpertiseDefinition[]>
> = built.expertiseByVertical

/** @deprecated Usar EXPERTISE_BY_VERTICAL[`${ind}-general`] o expertiseListForIndustryVerticals. */
export const EXPERTISE_BY_INDUSTRY: Readonly<
  Record<string, readonly ExpertiseDefinition[]>
> = Object.fromEntries(
  INDUSTRIES.map((ind) => {
    const k = `${ind.slug}-general`
    return [ind.slug, built.expertiseByVertical[k] ?? []]
  })
) as Readonly<Record<string, readonly ExpertiseDefinition[]>>

export const ALL_EXPERTISE: readonly ExpertiseDefinition[] = Object.values(
  EXPERTISE_BY_VERTICAL
).flat()

export function expertiseSlugsForGeneralVertical(
  industrySlug: string
): string[] {
  const k = `${industrySlug}-general`
  return (EXPERTISE_BY_VERTICAL[k] ?? []).map((e) => e.slug)
}

/** Opciones de expertise (nivel 3) para las verticales elegidas; usa catálogo «General» como fallback por vertical sin filas propias. */
export function expertiseListForIndustryVerticals(
  industrySlug: string | null,
  verticalSlugs: readonly string[]
): readonly ExpertiseDefinition[] {
  if (!industrySlug || verticalSlugs.length === 0) return []
  const genKey = `${industrySlug}-general`
  const fallback = EXPERTISE_BY_VERTICAL[genKey] ?? []
  const bySlug = new Map<string, ExpertiseDefinition>()
  for (const v of verticalSlugs) {
    const list = EXPERTISE_BY_VERTICAL[v] ?? fallback
    for (const e of list) {
      bySlug.set(e.slug, e)
    }
  }
  return [...bySlug.values()].sort((a, b) => a.sortOrder - b.sortOrder)
}

const TALENT_LABELS: readonly string[] = [
  "Comunicación",
  "Liderazgo",
  "Pensamiento estratégico",
  "Creatividad",
  "Resolución de problemas",
  "Colaboración",
  "Adaptabilidad",
  "Gestión de proyectos",
  "Negociación",
  "Pensamiento analítico",
  "Facilitación",
  "Empatía",
  "Toma de decisiones",
  "Innovación",
  "Gestión del tiempo",
  "Visión de negocio",
  "Investigación",
  "Mentoría",
  "Storytelling",
  "Resiliencia",
  "Escucha activa",
  "Pensamiento crítico",
  "Gestión del cambio",
  "Inteligencia emocional",
  "Trabajo bajo presión",
  "Curiosidad",
  "Persuasión",
  "Síntesis de información",
  "Planificación",
  "Autonomía",
  "Networking",
  "Mediación de conflictos",
  "Pensamiento sistémico",
  "Orientación a resultados",
  "Aprendizaje continuo",
  "Proactividad",
  "Gestión de equipos",
  "Atención al detalle",
  "Visión de usuario",
  "Cocreación",
  "Priorización",
  "Gestión de la incertidumbre",
  "Pensamiento lateral",
  "Construcción de comunidad",
  "Influencia sin autoridad",
  "Gestión de stakeholders",
  "Conciencia cultural",
  "Ética profesional",
  "Generación de ideas",
  "Ejecución",
]

function buildTalentDefinitions(): TalentDefinition[] {
  const used = new Set<string>()
  const out: TalentDefinition[] = []
  let ord = 10
  for (const label of TALENT_LABELS) {
    let base = slugify(label)
    let slug = base
    let n = 2
    while (used.has(slug)) {
      slug = `${base}-${n}`
      n++
    }
    used.add(slug)
    out.push({ slug, label, sortOrder: ord })
    ord += 10
  }
  return out
}

export const TALENTS: readonly TalentDefinition[] = buildTalentDefinitions()

const INDUSTRY_MAP = new Map(INDUSTRIES.map((a) => [a.slug, a]))
const EXPERTISE_MAP = new Map(ALL_EXPERTISE.map((e) => [e.slug, e]))
const TALENT_MAP = new Map(TALENTS.map((t) => [t.slug, t]))

export function labelIndustrySlug(slug: string): string {
  return INDUSTRY_MAP.get(slug)?.label ?? slug
}

export function labelExpertiseSlug(slug: string): string {
  return EXPERTISE_MAP.get(slug)?.label ?? slug
}

export function labelTalentSlug(slug: string): string {
  return TALENT_MAP.get(slug)?.label ?? slug
}

export function mapsToForExpertiseSlug(slug: string): FunctionalArea | undefined {
  return EXPERTISE_MAP.get(slug)?.mapsTo
}

export function mapsToForIndustrySlug(slug: string): FunctionalArea | undefined {
  return INDUSTRY_MAP.get(slug)?.mapsTo
}

export function expertiseSlugsForIndustry(industrySlug: string): string[] {
  return (EXPERTISE_BY_INDUSTRY[industrySlug] ?? []).map((e) => e.slug)
}

export function resolveProfileArea(
  primaryIndustrySlug: string | null | undefined,
  expertiseSlugs: string[] | null | undefined
): FunctionalArea {
  const firstExpertise = expertiseSlugs?.[0]
  if (firstExpertise) {
    const m = mapsToForExpertiseSlug(firstExpertise)
    if (m) return m
  }
  if (primaryIndustrySlug) {
    const a = mapsToForIndustrySlug(primaryIndustrySlug)
    if (a) return a
  }
  return "negocio"
}

export function inferIndustryFromExpertiseSlugs(
  slugs: string[] | null | undefined
): string | null {
  if (!slugs?.length) return null
  for (const s of slugs) {
    for (const ind of INDUSTRIES) {
      const list = EXPERTISE_BY_INDUSTRY[ind.slug]
      if (list?.some((e) => e.slug === s)) return ind.slug
    }
  }
  return null
}

export function defaultIndustryForFunctionalArea(area: FunctionalArea): string {
  switch (area) {
    case "tecnico":
      return "tecnologia-ia"
    case "producto":
      return "artes-diseno-creativo"
    case "negocio":
      return "retail-comercio"
    case "operaciones":
      return "manufactura-industria"
    case "ciencia":
      return "salud-biotech"
    default:
      return "retail-comercio"
  }
}

/**
 * Industria de referencia del perfil (misma regla que la tarjeta / multiselect de expertise).
 * Debe coincidir con lo que usa la UI al elegir slugs, para que al guardar no se re-filtre distinto.
 */
export function resolveHeroIndustrySlug(input: {
  primaryIndustrySlug?: string | null
  expertiseSlugs?: string[] | null | undefined
  functionalAreaTags?: string[] | null | undefined
  area: FunctionalArea
}): string {
  return (
    input.primaryIndustrySlug ??
    inferIndustryFromExpertiseSlugs(
      input.expertiseSlugs?.length
        ? input.expertiseSlugs
        : input.functionalAreaTags
    ) ??
    defaultIndustryForFunctionalArea(input.area)
  )
}

export function deriveEditableTaxonomy(input: {
  primaryIndustrySlug?: string | null
  verticalSlugs?: string[] | null | undefined
  expertiseSlugs?: string[] | null | undefined
  functionalAreaTags?: string[] | null | undefined
  area?: FunctionalArea
}): {
  primaryIndustrySlug: string | null
  verticalSlugs: string[]
  expertiseSlugs: string[]
} {
  const inferred =
    input.primaryIndustrySlug ??
    inferIndustryFromExpertiseSlugs(
      input.expertiseSlugs?.length
        ? input.expertiseSlugs
        : input.functionalAreaTags ?? []
    ) ??
    (input.area ? defaultIndustryForFunctionalArea(input.area) : null)

  const verticalFiltered = filterVerticalSlugsForIndustrySlug(
    inferred,
    input.verticalSlugs,
    3
  )

  const vertsForExpertise =
    verticalFiltered.length > 0
      ? verticalFiltered
      : inferred
        ? [`${inferred}-general`]
        : []

  const expertOpts =
    inferred && vertsForExpertise.length > 0
      ? expertiseListForIndustryVerticals(inferred, vertsForExpertise)
      : []
  const allowedExpert = new Set(expertOpts.map((e) => e.slug))

  const raw =
    input.expertiseSlugs?.length
      ? input.expertiseSlugs
      : (input.functionalAreaTags ?? [])
  const expertiseFiltered =
    allowedExpert.size > 0
      ? raw.filter((s) => allowedExpert.has(s)).slice(0, 5)
      : [...raw].slice(0, 5)

  return {
    primaryIndustrySlug: inferred,
    verticalSlugs: verticalFiltered,
    expertiseSlugs: expertiseFiltered,
  }
}

/** Etiqueta legada para slugs antiguos no presentes en el catálogo actual. */
export function labelLegacyFunctionalTag(slug: string): string {
  return labelExpertiseSlug(slug)
}
