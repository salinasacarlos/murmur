import type { FunctionalArea } from "@/lib/types"

/** Fila de catálogo: slug final = `{industria.slug}-{slugSuffix}`. */
export type ExpertiseRoleSeedRow = { slugSuffix: string; label: string }

export type IndustryExpertiseRoleSeed = {
  slug: string
  label: string
  mapsTo: FunctionalArea
  expertise: readonly ExpertiseRoleSeedRow[]
}

/**
 * Expertise por industria = **roles** (p. ej. PM, developer, director médico).
 * Entre ~18 y ~24 por industria; alineado con migración SQL de expertise_catalog.
 */
export const INDUSTRY_EXPERTISE_ROLE_SEEDS: readonly IndustryExpertiseRoleSeed[] =
  [
    {
      slug: "tecnologia-ia",
      label: "Tecnología e IA",
      mapsTo: "tecnico",
      expertise: [
        { slugSuffix: "product-manager", label: "Product manager" },
        { slugSuffix: "product-owner", label: "Product owner" },
        { slugSuffix: "project-manager", label: "Project manager / entrega" },
        { slugSuffix: "engineering-manager", label: "Engineering manager" },
        { slugSuffix: "tech-lead", label: "Tech lead" },
        {
          slugSuffix: "staff-principal-engineer",
          label: "Staff / principal engineer",
        },
        { slugSuffix: "cto-vp-engineering", label: "CTO / VP Engineering" },
        { slugSuffix: "backend-developer", label: "Backend developer" },
        { slugSuffix: "frontend-developer", label: "Frontend developer" },
        { slugSuffix: "fullstack-developer", label: "Full‑stack developer" },
        { slugSuffix: "mobile-developer", label: "Mobile developer" },
        { slugSuffix: "devops-sre", label: "DevOps / SRE" },
        { slugSuffix: "data-engineer", label: "Data engineer" },
        { slugSuffix: "ml-engineer", label: "Machine learning engineer" },
        { slugSuffix: "qa-engineer", label: "QA / tester" },
        { slugSuffix: "security-engineer", label: "Security engineer" },
        { slugSuffix: "ux-designer", label: "UX designer" },
        { slugSuffix: "ui-designer", label: "UI designer" },
        { slugSuffix: "ux-researcher", label: "UX researcher" },
        { slugSuffix: "solution-architect", label: "Solution architect" },
        { slugSuffix: "technical-writer", label: "Technical writer" },
        {
          slugSuffix: "solutions-sales-engineer",
          label: "Solutions / sales engineer",
        },
      ],
    },
    {
      slug: "salud-biotech",
      label: "Salud y biotech",
      mapsTo: "ciencia",
      expertise: [
        { slugSuffix: "medico-clinico", label: "Médico(a) clínico(a)" },
        { slugSuffix: "enfermeria-practica", label: "Enfermería (práctica)" },
        { slugSuffix: "cirujano", label: "Cirujano(a)" },
        {
          slugSuffix: "investigador-clinico",
          label: "Investigador(a) clínico(a) / CRO",
        },
        { slugSuffix: "farmaceutico", label: "Farmacéutico(a)" },
        {
          slugSuffix: "tecnico-laboratorio-biomedico",
          label: "Técnico(a) / biólogo(a) de laboratorio",
        },
        { slugSuffix: "fisioterapeuta", label: "Fisioterapeuta" },
        { slugSuffix: "psicologo-clinico", label: "Psicólogo(a) clínico(a)" },
        { slugSuffix: "director-medico", label: "Director(a) médico(a)" },
        { slugSuffix: "gestor-sanitario", label: "Gestor(a) sanitario(a)" },
        {
          slugSuffix: "regulatory-affairs",
          label: "Regulatory affairs / calidad clínica",
        },
        { slugSuffix: "msl-medical-science", label: "MSL / medical affairs" },
        { slugSuffix: "epidemiologo", label: "Epidemiología / salud pública" },
        { slugSuffix: "veterinario", label: "Veterinario(a)" },
        { slugSuffix: "odontologo", label: "Odontólogo(a)" },
        {
          slugSuffix: "jefe-enfermeria",
          label: "Jefe(a) / coordinación de enfermería",
        },
        {
          slugSuffix: "tecnico-imagen-radiologia",
          label: "Técnico(a) de imagen / radiología",
        },
        { slugSuffix: "nutricionista-clinico", label: "Nutrición clínica" },
        {
          slugSuffix: "gerente-operaciones-clinica",
          label: "Gerente operaciones clínica / hospital",
        },
        {
          slugSuffix: "product-manager-salud-digital",
          label: "Product manager salud digital",
        },
        {
          slugSuffix: "data-analyst-salud",
          label: "Data analyst en salud",
        },
      ],
    },
    {
      slug: "educacion",
      label: "Educación",
      mapsTo: "producto",
      expertise: [
        { slugSuffix: "docente-aula", label: "Docente frente a grupo" },
        {
          slugSuffix: "coordinador-academico",
          label: "Coordinador(a) académico(a)",
        },
        {
          slugSuffix: "director-escuela",
          label: "Director(a) de escuela / centro",
        },
        {
          slugSuffix: "gestion-universitaria",
          label: "Gestión universitaria / rectoría",
        },
        {
          slugSuffix: "disenador-instruccional",
          label: "Diseñador(a) instruccional / currículo",
        },
        { slugSuffix: "tutor-acompanamiento", label: "Tutor(a) / acompañamiento" },
        {
          slugSuffix: "investigador-educativo",
          label: "Investigación educativa",
        },
        {
          slugSuffix: "bibliotecario-educativo",
          label: "Bibliotecario(a) / recursos de aprendizaje",
        },
        {
          slugSuffix: "especialista-lms-edtech",
          label: "Especialista LMS / plataformas (Edtech)",
        },
        {
          slugSuffix: "psicopedagogo-orientacion",
          label: "Psicopedagogía / orientación",
        },
        {
          slugSuffix: "gerente-formacion-corporativa",
          label: "Gerente formación corporativa (L&D)",
        },
        { slugSuffix: "facilitador-trainer", label: "Facilitador(a) / trainer" },
        {
          slugSuffix: "evaluacion-acreditacion",
          label: "Evaluación y acreditación",
        },
        {
          slugSuffix: "instructor-idiomas",
          label: "Instructor(a) de idiomas",
        },
        {
          slugSuffix: "direccion-artistica-educativa",
          label: "Dirección artística educativa",
        },
        {
          slugSuffix: "admisiones-registro",
          label: "Admisiones y registro académico",
        },
        { slugSuffix: "product-manager-edtech", label: "Product manager Edtech" },
        {
          slugSuffix: "marketing-comunicacion-educativa",
          label: "Marketing y comunicación educativa",
        },
        {
          slugSuffix: "movilidad-becas",
          label: "Movilidad, becas e intercambios",
        },
      ],
    },
    {
      slug: "finanzas-fintech",
      label: "Finanzas y fintech",
      mapsTo: "negocio",
      expertise: [
        { slugSuffix: "analista-financiero", label: "Analista financiero" },
        { slugSuffix: "contador", label: "Contador(a)" },
        { slugSuffix: "auditor", label: "Auditor(a)" },
        { slugSuffix: "tesoreria", label: "Tesorería / cash management" },
        { slugSuffix: "fp-a", label: "FP&A / planeación financiera" },
        { slugSuffix: "risk-manager", label: "Riesgos (risk manager)" },
        { slugSuffix: "compliance-financiero", label: "Compliance financiero" },
        {
          slugSuffix: "investment-banking",
          label: "Investment banking / corporate finance",
        },
        {
          slugSuffix: "portfolio-asset-manager",
          label: "Portfolio / asset manager",
        },
        { slugSuffix: "private-banker", label: "Private banker / wealth" },
        { slugSuffix: "actuario", label: "Actuario(a)" },
        { slugSuffix: "fiscalista", label: "Fiscalista" },
        { slugSuffix: "trader", label: "Trader / mercados" },
        { slugSuffix: "credito-analyst", label: "Crédito / scoring" },
        { slugSuffix: "product-manager-fintech", label: "Product manager fintech" },
        { slugSuffix: "cfo-director-financiero", label: "CFO / director(a) financiero(a)" },
        { slugSuffix: "controller", label: "Controller" },
        {
          slugSuffix: "relationship-manager-banca",
          label: "Relationship manager banca",
        },
        {
          slugSuffix: "operaciones-back-office",
          label: "Operaciones / middle y back office",
        },
        {
          slugSuffix: "data-cuant-finanzas",
          label: "Data / cuant en finanzas",
        },
        { slugSuffix: "venture-analyst", label: "Venture / VC analyst" },
        { slugSuffix: "ma-advisory", label: "M&A / advisory" },
      ],
    },
    {
      slug: "entretenimiento-medios",
      label: "Entretenimiento y medios",
      mapsTo: "producto",
      expertise: [
        { slugSuffix: "productor-audiovisual", label: "Productor(a) audiovisual / evento" },
        { slugSuffix: "director-creativo", label: "Director(a) creativo(a)" },
        { slugSuffix: "director-arte-medios", label: "Director(a) de arte" },
        { slugSuffix: "editor-post", label: "Editor(a) / postproducción" },
        { slugSuffix: "sonidista", label: "Sonido / diseño sonoro" },
        { slugSuffix: "guionista", label: "Guionista / IP" },
        { slugSuffix: "manager-talento", label: "Manager / booker de talento" },
        {
          slugSuffix: "distribucion-adquisiciones",
          label: "Distribución / adquisiciones",
        },
        {
          slugSuffix: "community-social-fans",
          label: "Community / social de fans",
        },
        { slugSuffix: "host-presentador", label: "Presentador(a) / host" },
        { slugSuffix: "fotografo-editorial", label: "Fotografía editorial" },
        { slugSuffix: "motion-designer", label: "Motion / motion designer" },
        { slugSuffix: "game-developer", label: "Developer videojuegos" },
        { slugSuffix: "game-designer", label: "Game designer" },
        { slugSuffix: "esports-manager", label: "Esports / competitivo" },
        {
          slugSuffix: "marketing-contenidos",
          label: "Marketing de contenidos",
        },
        {
          slugSuffix: "brand-partnerships",
          label: "Alianzas y branded content",
        },
        { slugSuffix: "legal-clearance", label: "Legal / clearance" },
        {
          slugSuffix: "operaciones-venue-gira",
          label: "Operaciones de venue / gira",
        },
        {
          slugSuffix: "insights-audiencia",
          label: "Data / insights de audiencia",
        },
      ],
    },
    {
      slug: "artes-diseno-creativo",
      label: "Artes y diseño creativo",
      mapsTo: "producto",
      expertise: [
        { slugSuffix: "disenador-grafico", label: "Diseñador(a) gráfico(a)" },
        { slugSuffix: "disenador-producto", label: "Diseñador(a) de producto" },
        { slugSuffix: "ilustrador", label: "Ilustrador(a)" },
        { slugSuffix: "director-arte", label: "Dirección de arte" },
        { slugSuffix: "fotografo-artistico", label: "Fotógrafo(a)" },
        { slugSuffix: "artesano-maker", label: "Artesano(a) / maker" },
        { slugSuffix: "curador", label: "Curador(a)" },
        { slugSuffix: "interiorista", label: "Interiorismo" },
        {
          slugSuffix: "moda-patronaje",
          label: "Moda / patronaje / confección",
        },
        { slugSuffix: "orfebre-joyero", label: "Joyería / orfebrería" },
        { slugSuffix: "ceramista", label: "Cerámica / materiales" },
        {
          slugSuffix: "tipografia-branding",
          label: "Tipografía / branding",
        },
        { slugSuffix: "motion-arte", label: "Motion / arte digital" },
        { slugSuffix: "artista-escenico", label: "Artista escénico / performer" },
        { slugSuffix: "escritor-copy", label: "Escritor(a) / copy creativo" },
        {
          slugSuffix: "gestion-cultural",
          label: "Gestión cultural / producción independiente",
        },
        { slugSuffix: "arquitecto", label: "Arquitecto(a)" },
        {
          slugSuffix: "practicante-arte",
          label: "Estudiante / practicante arte",
        },
      ],
    },
    {
      slug: "construccion-inmobiliario",
      label: "Construcción e inmobiliario",
      mapsTo: "operaciones",
      expertise: [
        { slugSuffix: "arquitecto-proyecto", label: "Arquitecto(a) de proyecto" },
        { slugSuffix: "ingeniero-civil", label: "Ingeniero(a) civil" },
        { slugSuffix: "supervisor-obra", label: "Supervisor(a) / maestro de obra" },
        {
          slugSuffix: "project-manager-obra",
          label: "Project manager construcción",
        },
        {
          slugSuffix: "costos-presupuestos",
          label: "Costos / presupuestos / quantity",
        },
        { slugSuffix: "seguridad-obra", label: "Seguridad e higiene en obra" },
        { slugSuffix: "topografo", label: "Topografía / levantamientos" },
        { slugSuffix: "bim-modelado", label: "BIM / modelado" },
        { slugSuffix: "facility-manager", label: "Facility / asset management" },
        { slugSuffix: "broker-inmobiliario", label: "Broker / corredor(a)" },
        {
          slugSuffix: "desarrollador-inmobiliario",
          label: "Desarrollador(a) inmobiliario",
        },
        { slugSuffix: "valuador", label: "Valuación" },
        { slugSuffix: "urbanista", label: "Urbanismo" },
        {
          slugSuffix: "mantenimiento-inmuebles",
          label: "Mantenimiento de inmuebles",
        },
        {
          slugSuffix: "compras-licitaciones",
          label: "Compras / licitaciones",
        },
        {
          slugSuffix: "ambiental-permisos",
          label: "Impacto ambiental / permisos",
        },
        {
          slugSuffix: "interiorista-ejecutivo",
          label: "Interiorista ejecutivo",
        },
        { slugSuffix: "legal-obra", label: "Legal obra e inmobiliario" },
      ],
    },
    {
      slug: "manufactura-industria",
      label: "Manufactura e industria",
      mapsTo: "operaciones",
      expertise: [
        { slugSuffix: "gerente-planta", label: "Gerente de planta" },
        {
          slugSuffix: "supervisor-produccion",
          label: "Supervisor(a) de producción",
        },
        {
          slugSuffix: "ingeniero-procesos",
          label: "Ingeniero(a) de procesos",
        },
        {
          slugSuffix: "mantenimiento-confiabilidad",
          label: "Mantenimiento / confiabilidad",
        },
        { slugSuffix: "gerente-calidad", label: "Calidad / QA planta" },
        {
          slugSuffix: "supply-chain-manager",
          label: "Supply chain / compras planta",
        },
        {
          slugSuffix: "lean-mejora-continua",
          label: "Lean / mejora continua",
        },
        { slugSuffix: "hseq-planta", label: "HSEQ planta" },
        {
          slugSuffix: "ingeniero-automatizacion",
          label: "Automatización / controles",
        },
        {
          slugSuffix: "ingeniero-layout-planta",
          label: "Layout de planta / industrial",
        },
        {
          slugSuffix: "coordinador-logistica-almacen",
          label: "Logística / almacén",
        },
        {
          slugSuffix: "operario-tecnico-planta",
          label: "Operario(a) / técnico(a) de planta",
        },
        {
          slugSuffix: "product-manager-industrial",
          label: "Product manager industrial / B2B",
        },
        {
          slugSuffix: "ambiente-planta",
          label: "Ambiente y permisos planta",
        },
        { slugSuffix: "herramental", label: "Herramental / tooling" },
        { slugSuffix: "planeacion-mrp", label: "Planeación / MRP" },
        {
          slugSuffix: "npi-lanzamiento",
          label: "NPI / lanzamiento de producto",
        },
        { slugSuffix: "metrologia-lab", label: "Metrología / lab planta" },
        {
          slugSuffix: "gerente-compras",
          label: "Compras estratégicas",
        },
        { slugSuffix: "gerente-almacen-wms", label: "Almacén / WMS" },
      ],
    },
    {
      slug: "agro-alimentacion",
      label: "Agro y alimentación",
      mapsTo: "operaciones",
      expertise: [
        { slugSuffix: "agronomo", label: "Agrónomo(a)" },
        { slugSuffix: "zootecnista", label: "Zootecnia / ganadero técnico" },
        { slugSuffix: "veterinario-campo", label: "Veterinario(a) de campo" },
        {
          slugSuffix: "calidad-inocuidad-alimentos",
          label: "Calidad e inocuidad alimentaria",
        },
        { slugSuffix: "i-d-alimentos", label: "I+D de alimentos" },
        {
          slugSuffix: "produccion-planta-alimentos",
          label: "Producción / planta alimentos",
        },
        { slugSuffix: "comercial-agro", label: "Comercial agro / trader" },
        { slugSuffix: "extensionista", label: "Extensión / campo" },
        {
          slugSuffix: "operaciones-restaurante",
          label: "Operaciones restaurante / F&B",
        },
        {
          slugSuffix: "cadena-frio-logistica",
          label: "Cadena de frío / logística alimentos",
        },
        {
          slugSuffix: "sustentabilidad-agro",
          label: "Sustentabilidad agro",
        },
        {
          slugSuffix: "categoria-bebidas",
          label: "Bebidas / categoría",
        },
        {
          slugSuffix: "tecnico-acuicultura",
          label: "Técnico(a) acuicultura",
        },
        { slugSuffix: "compras-insumos", label: "Compras de insumos" },
        {
          slugSuffix: "marketing-marca-alimentos",
          label: "Marketing marca alimentos",
        },
        {
          slugSuffix: "direccion-agrifood",
          label: "Dirección / fundador(a) agrifood",
        },
        { slugSuffix: "data-precision-agro", label: "Data / precision ag" },
        {
          slugSuffix: "regulatorio-alimentos",
          label: "Regulatorio etiquetado / importación",
        },
      ],
    },
    {
      slug: "gobierno-sector-publico",
      label: "Gobierno y sector público",
      mapsTo: "negocio",
      expertise: [
        {
          slugSuffix: "servidor-publico-operativo",
          label: "Servidor(a) público(a) operativo(a)",
        },
        {
          slugSuffix: "directivo-publico",
          label: "Directivo(a) público(a)",
        },
        {
          slugSuffix: "analista-politica-publica",
          label: "Analista de políticas públicas",
        },
        { slugSuffix: "compras-publicas", label: "Compras públicas" },
        {
          slugSuffix: "transparencia-datos",
          label: "Transparencia y datos abiertos",
        },
        { slugSuffix: "urbanismo-publico", label: "Planeación urbana pública" },
        {
          slugSuffix: "cooperacion-internacional",
          label: "Cooperación internacional",
        },
        {
          slugSuffix: "seguridad-ciudadana-op",
          label: "Seguridad ciudadana (operativo)",
        },
        {
          slugSuffix: "procuracion-justicia",
          label: "Procuración / justicia",
        },
        {
          slugSuffix: "trabajo-social-programas",
          label: "Trabajo social / programas",
        },
        {
          slugSuffix: "comunicacion-social",
          label: "Comunicación social / prensa",
        },
        {
          slugSuffix: "project-manager-obra-publica",
          label: "Gestión de obra pública",
        },
        { slugSuffix: "regulador-sectorial", label: "Regulación sectorial" },
        { slugSuffix: "hacienda-publica", label: "Hacienda / finanzas públicas" },
        {
          slugSuffix: "innovacion-gobierno",
          label: "Innovación / laboratorio público",
        },
        {
          slugSuffix: "enlace-municipal",
          label: "Enlace municipal / territorial",
        },
        {
          slugSuffix: "consultor-sector-publico",
          label: "Consultor(a) sector público",
        },
      ],
    },
    {
      slug: "turismo-hospitalidad",
      label: "Turismo y hospitalidad",
      mapsTo: "negocio",
      expertise: [
        {
          slugSuffix: "gerente-hotel-resort",
          label: "Gerente general hotel / resort",
        },
        {
          slugSuffix: "revenue-front-office",
          label: "Revenue / front office",
        },
        {
          slugSuffix: "housekeeping",
          label: "Housekeeping / habitaciones",
        },
        { slugSuffix: "director-f-b", label: "Director(a) F&B" },
        { slugSuffix: "chef", label: "Chef / cocina" },
        { slugSuffix: "sommelier-bar", label: "Sommelier / bar manager" },
        { slugSuffix: "guia-turistico", label: "Guía turístico(a)" },
        { slugSuffix: "agente-viajes", label: "Agente / planner viajes" },
        { slugSuffix: "event-manager-mice", label: "Eventos MICE" },
        {
          slugSuffix: "producto-experiencia-destino",
          label: "Experiencias / producto destino",
        },
        {
          slugSuffix: "operaciones-aerolinea",
          label: "Operaciones aerolíneas / aeropuerto",
        },
        {
          slugSuffix: "cruceros-hospitality",
          label: "Cruceros / hospitality barco",
        },
        { slugSuffix: "marketing-destino", label: "Marketing de destino / DMO" },
        {
          slugSuffix: "community-turismo",
          label: "Community / UGC viajes",
        },
        {
          slugSuffix: "gerente-spa-wellness",
          label: "Spa / wellness turístico",
        },
        { slugSuffix: "ecommerce-ota", label: "E‑commerce / OTA producto" },
        {
          slugSuffix: "concierge-guest",
          label: "Concierge / guest relations",
        },
        {
          slugSuffix: "fundador-pyme-turismo",
          label: "Fundador(a) / director(a) PYME turismo",
        },
      ],
    },
    {
      slug: "energia-sustentabilidad",
      label: "Energía y sustentabilidad",
      mapsTo: "ciencia",
      expertise: [
        {
          slugSuffix: "ingeniero-renovables",
          label: "Ingeniero(a) renovables",
        },
        {
          slugSuffix: "ingeniero-ambiental",
          label: "Ingeniero(a) ambiental",
        },
        {
          slugSuffix: "project-manager-energia",
          label: "PM proyectos energía / infra",
        },
        { slugSuffix: "geotecnico-campo", label: "Geología / campo oil & gas" },
        { slugSuffix: "hseq-ambiental", label: "HSEQ ambiental" },
        { slugSuffix: "carbono-mrv", label: "Mercados de carbono / MRV" },
        { slugSuffix: "energy-trader", label: "Trader energía" },
        { slugSuffix: "operacion-red-utility", label: "Operación red / utility" },
        {
          slugSuffix: "sostenibilidad-esg",
          label: "Sostenibilidad corporativa / ESG",
        },
        {
          slugSuffix: "eficiencia-energetica",
          label: "Eficiencia energética / modelado",
        },
        {
          slugSuffix: "residuos-economia-circular",
          label: "Residuos / economía circular",
        },
        { slugSuffix: "hidrologia-agua", label: "Hidrología / agua" },
        {
          slugSuffix: "tecnico-nuclear-servicios",
          label: "Técnico(a) nuclear (servicios)",
        },
        {
          slugSuffix: "innovacion-cleantech",
          label: "Innovación cleantech",
        },
        { slugSuffix: "legal-energia", label: "Legal energía / regulación" },
        {
          slugSuffix: "project-finance-infra",
          label: "Project finance infra energía",
        },
        { slugSuffix: "om-plantas", label: "O&M plantas" },
        {
          slugSuffix: "fundador-energy-startup",
          label: "Fundador(a) startup energía",
        },
      ],
    },
    {
      slug: "retail-comercio",
      label: "Retail y comercio",
      mapsTo: "negocio",
      expertise: [
        { slugSuffix: "gerente-tienda", label: "Gerente de tienda" },
        { slugSuffix: "buyer-merchandising", label: "Buyer / merchandising" },
        {
          slugSuffix: "planeacion-inventarios",
          label: "Planeación / inventarios",
        },
        { slugSuffix: "gerente-ecommerce", label: "Gerente e‑commerce" },
        {
          slugSuffix: "product-manager-retail",
          label: "Product manager retail",
        },
        {
          slugSuffix: "supply-chain-retail",
          label: "Supply chain retail",
        },
        {
          slugSuffix: "visual-merchandiser",
          label: "Visual merchandising",
        },
        { slugSuffix: "trade-shopper", label: "Trade / shopper marketing" },
        { slugSuffix: "crm-lealtad", label: "CRM / lealtad" },
        {
          slugSuffix: "operaciones-omnicanal",
          label: "Operaciones omnicanal",
        },
        { slugSuffix: "franquicias", label: "Franquicias" },
        { slugSuffix: "pricing-analyst", label: "Pricing" },
        {
          slugSuffix: "ultima-milla-fulfillment",
          label: "Última milla / fulfillment",
        },
        { slugSuffix: "data-analyst-retail", label: "Data retail" },
        { slugSuffix: "brand-manager", label: "Brand manager" },
        { slugSuffix: "vendedor-piso", label: "Vendedor(a) / piso de tienda" },
        {
          slugSuffix: "comercio-exterior-retail",
          label: "Comercio exterior / sourcing",
        },
        { slugSuffix: "fundador-d2c", label: "Fundador(a) marca D2C" },
        { slugSuffix: "mayoreo-cash", label: "Mayoreo / cash & carry" },
        { slugSuffix: "cx-retail", label: "Experiencia cliente / CX" },
      ],
    },
    {
      slug: "legal-consultoria",
      label: "Legal y consultoría",
      mapsTo: "negocio",
      expertise: [
        { slugSuffix: "abogado-litigio", label: "Abogado(a) litigio" },
        {
          slugSuffix: "abogado-corporativo-ma",
          label: "Abogado(a) corporativo / M&A",
        },
        { slugSuffix: "fiscalista-abogado", label: "Fiscalista" },
        { slugSuffix: "abogado-laboral", label: "Laboral" },
        {
          slugSuffix: "compliance-legal",
          label: "Compliance legal",
        },
        { slugSuffix: "notario", label: "Notario(a)" },
        {
          slugSuffix: "consultor-estrategia",
          label: "Consultor(a) de estrategia",
        },
        {
          slugSuffix: "consultor-operaciones",
          label: "Consultor(a) de operaciones",
        },
        { slugSuffix: "auditor-externo", label: "Auditor(a) externo" },
        { slugSuffix: "reclutador-ta", label: "Reclutador(a) / TA" },
        { slugSuffix: "hr-business-partner", label: "HR business partner" },
        { slugSuffix: "gerente-rrhh", label: "Gerente RR.HH." },
        {
          slugSuffix: "compensaciones-beneficios",
          label: "Compensaciones / nómina",
        },
        { slugSuffix: "people-analytics-hris", label: "People analytics / HRIS" },
        { slugSuffix: "coach-ejecutivo", label: "Coach ejecutivo" },
        {
          slugSuffix: "gestion-cambio-ocm",
          label: "Gestión del cambio (OCM)",
        },
        { slugSuffix: "abogado-pi", label: "Propiedad intelectual / marcas" },
        {
          slugSuffix: "paralegal-legal-ops",
          label: "Paralegal / legal operations",
        },
      ],
    },
    {
      slug: "deporte-bienestar",
      label: "Deporte y bienestar",
      mapsTo: "producto",
      expertise: [
        {
          slugSuffix: "entrenador-personal",
          label: "Entrenador(a) personal / fitness",
        },
        {
          slugSuffix: "nutricionista-deportivo",
          label: "Nutrición deportiva",
        },
        {
          slugSuffix: "fisioterapeuta-deporte",
          label: "Fisioterapia deportiva",
        },
        { slugSuffix: "medico-deportivo", label: "Médico(a) deportivo(a)" },
        {
          slugSuffix: "preparador-fisico",
          label: "Preparador(a) físico(a)",
        },
        {
          slugSuffix: "director-tecnico-deportivo",
          label: "Director(a) técnico(a) deportivo",
        },
        {
          slugSuffix: "psicologo-deporte",
          label: "Psicología deportiva",
        },
        { slugSuffix: "gestor-club-liga", label: "Gestión club / liga" },
        {
          slugSuffix: "instructor-grupal",
          label: "Instructor(a) grupal / boutique",
        },
        {
          slugSuffix: "instructor-yoga-pilates",
          label: "Yoga / pilates / mind-body",
        },
        {
          slugSuffix: "community-wellness",
          label: "Community wellness / retención",
        },
        { slugSuffix: "marketing-deportivo", label: "Marketing deportivo" },
        {
          slugSuffix: "operaciones-gimnasio",
          label: "Operaciones gimnasio",
        },
        {
          slugSuffix: "product-manager-wellness-app",
          label: "Product manager wellness / app",
        },
        {
          slugSuffix: "data-wearables-rendimiento",
          label: "Data wearables / rendimiento",
        },
        {
          slugSuffix: "terapia-manual-masaje",
          label: "Masaje / terapia manual",
        },
        {
          slugSuffix: "fundador-wellness-startup",
          label: "Fundador(a) wellness / startup",
        },
        {
          slugSuffix: "readaptacion-lesion",
          label: "Readaptación / lesión",
        },
      ],
    },
  ]
