# Murmur — Product Requirements Document

**Versión:** 1.1  
**Última revisión:** Mayo 2026  
**Estado:** Documento vivo — las secciones 1–11 siguen siendo la referencia de producto; la **§12** describe qué está construido hoy en el código frente a ese alcance. Usar la §12 para planificar iteraciones futuras.

---

## 1. Visión del producto

**Murmur** es una red social web-first para builders que buscan a las personas correctas para construir.

> *"Construye con las personas correctas."*

La red donde los builders encuentran co-founders, talento, mentores e inversionistas.

---

## 2. El problema

Encontrar a la persona correcta para construir algo es uno de los problemas más difíciles del ecosistema emprendedor:

- El proceso actual depende del azar: networking en eventos, contactos de contactos, LinkedIn frío
- No existe un lugar donde declarar explícitamente qué buscas y que los matches lleguen a ti
- Las plataformas existentes (LinkedIn, Twitter, comunidades de Slack) no fueron diseñadas para este tipo de conexión intencional
- No hay forma de estar "disponible para conectar" de manera controlada sin exponerse a spam

---

## 3. Usuarios objetivo

Murmur es para **cualquier persona que construya algo** — no solo founders con startup registrada.

### Perfiles principales

| Perfil | Descripción |
|--------|-------------|
| **Founder / co-founder** | Tiene un proyecto en marcha, busca al equipo fundador completo |
| **Builder independiente** | Dev, diseñador, PM — quiere unirse a construir algo como early hire o co-founder |
| **Experto de dominio** | Profesional de salud, finanzas, educación — quiere aplicar su expertise en una startup |
| **Inversionista ángel** | Busca proyectos early-stage para invertir y agregar valor |
| **Mentor / advisor** | Ha construido antes, quiere acompañar a otros en su camino |

### Lo que tienen en común
Todos tienen **intención de construir** — ya sea con su propio proyecto o contribuyendo al de alguien más.

---

## 4. Propuesta de valor

**Para el que tiene el proyecto:**
Encuentra al co-founder, primer empleado o advisor que necesitas — sin depender del azar del networking.

**Para el que quiere contribuir:**
Descúbrete a ti mismo ante los proyectos correctos, cuando tú quieras, sin mandar mensajes en frío.

**Para todos:**
Una red donde las conexiones tienen contexto y propósito. Sabes exactamente por qué alguien quiere conectar contigo.

---

## 5. Diferenciadores clave

1. **Búsquedas paralelas** — Puedes tener múltiples búsquedas activas simultáneamente. Una para buscar co-founder técnico, otra para buscar primer diseñador. Cada búsqueda tiene su propio perfil y genera sus propios matches.

2. **Visibilidad controlable** — Estás oculto por defecto. Tú decides cuándo aparecer en búsquedas. Puedes activarte para un evento específico y desactivarte al terminar.

3. **Contexto en cada conexión** — Cuando alguien te envía una solicitud, sabes exactamente para qué proyecto te está considerando y por qué. No hay mensajes en frío genéricos.

4. **Matching con propósito** — El sistema cruza lo que tú buscas con lo que el otro es, y viceversa. La compatibilidad es bidireccional.

---

## 6. Funcionalidades del producto

### 6.1 Registro y onboarding

El proceso de registro captura la información necesaria para el matching desde el primer momento.

**Paso 1 — Registro**
- Email + contraseña; **Google OAuth** (flujo Supabase + `/auth/callback`); *LinkedIn OAuth previsto aquí pero aún no implementado.*
- Validación básica en cliente (p. ej. longitud mínima de contraseña); *validación de email “en vivo” y medidor de fortaleza pueden ampliarse.*

**Paso 2 — Rol inicial**
- ¿Tienes un proyecto? (Tengo proyecto / Quiero contribuir / Las dos)
- Define el flujo del onboarding subsecuente

**Paso 3 — Tipos de relación buscada** *(multi-select)*
- Co-founder / socio
- Empleo / contratación
- Colaboración puntual
- Mentoría / advisor
- Inversión
- Abierto a explorar

**Paso 4 — Perfil personal**
- Nombre y foto
- Título o rol actual
- Bio corta (máx. 200 caracteres)
- Área funcional: Técnico/Ing., Producto, Negocio/Growth, Operaciones, Ciencia/Experto
- Años de experiencia: 0-2 / 3-5 / 6-10 / 10+
- Logro más relevante (una línea)
- Disponibilidad: Full-time ya / Part-time explorando / En 3-6 meses
- Industria principal (nivel 1), hasta **3 verticales** de foco (nivel 2) y hasta **3 roles / expertise** (nivel 3: p. ej. PM, developer, director) bajo esas verticales *(catálogo alineado a DB)*
- Soft skills *(hasta 5; catálogo `talent_catalog`)*
- Forma de trabajar *(multi-select)*: Remoto, Presencial, Híbrido, Decisiones rápidas, Proceso estructurado, Async

**Paso 5 — Contexto del proyecto o búsqueda**
- *Si tiene proyecto:* nombre, etapa, descripción de qué busca
- *Si quiere contribuir:* tipo de oportunidad buscada, qué puede aportar

**Paso 6 — Ubicación**
- Detección automática por GPS (con permiso del usuario)
- Selección manual de ciudad como fallback
- Ciudades adicionales donde opera / considera trabajar
- Radio de búsqueda (cuando hay ciudades manuales)

---

### 6.2 Feed — Descubrir

La pantalla principal donde el usuario encuentra personas afines.

**Activación**
- Pantalla inicial con botón "Buscar" — el usuario activa la búsqueda intencionalmente
- Animación de activación: anillos de radar + pájaros que vuelan
- Al activar, el sistema filtra y rankea perfiles según las búsquedas activas del usuario

**Selector de búsquedas**
- Barra horizontal encima de los resultados
- Chips por cada búsqueda activa: "Co-founder técnico", "Primer dev", etc.
- Opción "Todas" que mezcla resultados de todas las búsquedas
- Acceso directo a crear nueva búsqueda

**Cards de perfil**
Cada card muestra:
- Avatar e iniciales
- Nombre y rol actual
- Área funcional + experiencia
- Logro destacado
- Disponibilidad
- Industria principal, verticales (≤3) y roles de expertise (≤3)
- Indicador de compatibilidad: Baja / Media / Alta

**Panel de detalle**
- Slide desde la derecha (desktop: panel lateral; mobile: pantalla completa)
- Perfil completo + bio + workStyle
- Botón de conectar con **mensaje pre-rellenado por plantilla** (heurística a partir del perfil; editable antes de enviar). *No hay modelo de IA generativa en este flujo hoy.*
- El mensaje es editable antes de enviar

**Filtros**
- Ciudad / región
- Disponibilidad
- Área funcional
- Tipo de relación buscada
- Industria principal
- Verticales (nivel 2) y expertise (nivel 3), mismo criterio que el perfil
- Soft skills *(solo Premium en cliente)*

---

### 6.3 Mis búsquedas

Sección dedicada para gestionar múltiples búsquedas paralelas.

**Por cada búsqueda:**
- Título descriptivo
- Descripción libre de lo que busca
- Tipo de relación *(multi-select)*
- Industria principal, verticales (≤3), roles de expertise (≤3) y soft skills opcional
- Estado: Activa / Pausada

**Acciones:**
- Crear nueva búsqueda
- Editar búsqueda existente
- Pausar / activar
- Eliminar

**Visibilidad en el feed:**
- Solo las búsquedas activas alimentan el selector del feed
- Los matches se calculan búsqueda por búsqueda

---

### 6.4 Conexiones

Gestión de solicitudes recibidas y enviadas.

**Recibidas**
- Card con: avatar, nombre, rol, tipo de relación que busca, mensaje de la solicitud
- El mensaje se muestra en 3 líneas con opción de expandir
- Acciones: Aceptar → abre chat directo / Ignorar → va a historial

**Enviadas**
- Estado por solicitud: Pendiente / Aceptada / Rechazada
- Cancelar solicitud pendiente
- Ver conversación si fue aceptada

**Historial**
- Solicitudes que el usuario ignoró
- Colapsable, sin acción disponible

---

### 6.5 Mensajes

Chat entre usuarios con conexión aceptada.

**Layout**
- Desktop: lista de chats (280px) + conversación a la derecha
- Mobile: pantalla completa alternando entre lista y conversación (slide)

**Lista de chats**
- Avatar + nombre + último mensaje + hora
- Punto de no leído
- Indicador de en línea
- Búsqueda de conversaciones

**Conversación**
- Mensajes agrupados por emisor
- Timestamps por grupo
- Enter para enviar, Shift+Enter para nueva línea
- Botón de acceso al perfil del contacto

---

### 6.6 Mi perfil

Pantalla de gestión del perfil propio del usuario.

**Secciones editables:**
- Hero: foto, nombre, rol, bio
- Logro destacado
- Disponibilidad y forma de trabajar
- Industria principal, verticales (≤3), roles de expertise (≤3) y soft skills

**Stats:**
- Matches recibidos
- Conexiones activas
- Mensajes

**Cada sección** se edita en un drawer (sheet desde abajo) para no perder el contexto.

---

### 6.7 Visibilidad y privacidad

- **Toggle de visibilidad** accesible desde el menú de configuración (en mobile) y sidebar (en desktop)
- Estado Visible: el usuario aparece en búsquedas de otros
- Estado Oculto: el usuario no aparece en ninguna búsqueda
- El estado persiste entre sesiones
- El usuario puede cambiar su visibilidad en cualquier momento sin perder su perfil

---

## 7. Modelo de negocio — Freemium

El campo `profiles.plan` usa el enum `user_plan` (`free` | `premium`).

**Checkout:** la suscripción Premium se activa con **Stripe Checkout** (`/upgrade`). El webhook en `/api/webhooks/stripe` actualiza `profiles.plan` (requiere `SUPABASE_SERVICE_ROLE_KEY` en el servidor). Variables: ver `.env.local.example`. URL canónica de producción: `https://joinmurmur.xyz` (webhook Stripe: `https://joinmurmur.xyz/api/webhooks/stripe`).

### Checklist al cambiar límites Free (TS + SQL)

Los números de Free viven en **código** ([`lib/plan-limits.ts`](../lib/plan-limits.ts), [`lib/product-config.ts`](../lib/product-config.ts) donde aplique) y en **RPCs** (p. ej. `accept_connection`: tope de conexiones aceptadas). Si cambias un límite en TypeScript, revisa y migra las funciones SQL que validen el mismo concepto para evitar errores en cliente vs servidor.

### Plan referencia en código

- Límites Free y helpers: `lib/plan-limits.ts`
- Precios mostrados (MXN) y max verticales/talent: `lib/product-config.ts` (alinear con Stripe Prices y este PRD)

### Plan gratuito (Free)

| Límite | Valor |
|--------|--------|
| Ciudades en perfil | 1 (un slug en `profile_cities`) |
| Búsquedas con estado `active` | 1 |
| Conexiones con estado `accepted` | máx. 10 por usuario |
| Filtros en Descubrir | Subconjunto: ciudad, disponibilidad, tipo de relación, industria, verticales y expertise. Sin filtro por soft skills. |
| Notificaciones `high_compatibility_suggestion` | No (la RPC no encola para Free) |

### Plan Premium

- Varias ciudades / radar amplio
- Búsquedas activas ilimitadas
- Conexiones aceptadas ilimitadas
- Filtros completos en Descubrir (incl. soft skills)
- Alertas de alta compatibilidad (`ensure_high_compatibility_suggestions`) para usuarios Premium

### Precios (referencia producto — sincronizar con `lib/product-config` y Stripe)

| Plan | Precio |
|------|--------|
| Gratuito | $0 |
| Premium semanal | **$49 MXN / semana** |
| Premium anual | **$699 MXN / año** |

---

## 8. Métricas de éxito

### Activación
- % de usuarios que completan el onboarding (objetivo: >60%)
- % que activan el feed y ven al menos 5 perfiles (objetivo: >50%)

### Engagement
- Conexiones enviadas por usuario activo / semana
- % de solicitudes aceptadas (objetivo: >30%)
- Mensajes enviados por conversación activa

### Retención
- D7: % de usuarios que regresan a los 7 días (objetivo: >25%)
- D30: % activos al mes (objetivo: >15%)

### Negocio
- Conversión free → premium (objetivo: >5% en 90 días)
- CAC (costo de adquisición por usuario)
- MRR (monthly recurring revenue)

---

## 9. Flujos críticos

### Flujo principal de valor
```
Registro → Onboarding → Crear búsqueda → Activar feed → 
Ver match → Enviar conexión → Aceptación → Chat → Reunión
```

### Flujo de visibilidad
```
Usuario entra a evento → Activa visibilidad → Aparece en búsquedas 
de otros → Recibe solicitudes → Acepta las relevantes → Desactiva
```

### Flujo de búsqueda múltiple
```
Crear búsqueda A (co-founder) → Crear búsqueda B (primer dev) →
Feed muestra selector → Cambiar entre búsquedas → 
Cada búsqueda genera sus propios matches
```

---

## 10. Restricciones y consideraciones

- **Sin mensajes en frío a desconocidos** — solo puedes chatear con conexiones aceptadas
- **Sin notificaciones intrusivas** — el usuario controla cuándo está disponible
- **Privacidad por default** — oculto hasta que el usuario decide activarse
- **Moderación** — *reporte desde el chat / flujo de moderación pendiente de diseño e implementación.*
- **Solo web por ahora** — app web responsive y `viewport` adaptado a móvil; *manifest / PWA instalable no consolidado como entregable V1.*

---

## 11. Lo que Murmur NO es

- No es un job board — no hay publicaciones de vacantes
- No es LinkedIn — no es para networking profesional general
- No es Tinder para founders — no hay swipe ni match instantáneo sin contexto
- No es una herramienta de gestión de proyectos
- No reemplaza el proceso de due diligence entre founders — facilita el primer contacto

---

## 12. Estado de implementación (snapshot mayo 2026)

Esta sección describe **lo que ya existe en el repositorio / producción** respecto a las especificaciones anteriores. Sirve como línea base para priorizar el backlog; las secciones 1–11 pueden seguir aspirando a más alcance del aquí listado como “hecho”.

### 12.1 Construido y operativo (alineado al PRD)

| Área | Qué cubre hoy |
|------|----------------|
| **Auth** | Registro e inicio de sesión con **email y contraseña**; **Google** (`signInWithOAuth`, ruta `app/auth/callback/route.ts`). Perfil `public.profiles` creado vía trigger en `auth.users`. |
| **Gating onboarding** | Sin `onboarding_completed`, el usuario **no entra** al layout de la app (`app/(app)/layout.tsx`): siempre redirige a `/onboarding`. El callback OAuth aplica la misma lógica antes de enviar a `/feed`. |
| **Onboarding** | Flujo multipaso: intro (`/onboarding`), evento (código), rol (proyecto / contribuir / ambos), relaciones buscadas, perfil (taxonomía industria–verticales–expertise, talent/soft skills, etc.), **ubicación con geolocalización + geocodificado inverso** y ciudades/radio (`app/onboarding/location`), pantalla de cierre (`/onboarding/done`). |
| **Landing** | Home público; textos legales solo en rutas dedicadas **`/terms`** y **`/privacy`** (fuentes `lib/terms-generic-content.ts`, `lib/privacy-generic-content.ts`); enlaces en **footer** de la landing y en signup. |
| **Feed / Descubrir** | Activación tipo radar, selector de búsquedas, cards, panel lateral/detalle, filtros (con límites **Free vs Premium** en cliente), **modo evento** (código activo + RPC de perfiles por evento). |
| **Búsquedas** | CRUD de búsquedas, estados activa/pausada, límites **Free** (una activa) vs **Premium**. |
| **Conexiones** | Envío, pendiente/aceptada/rechazada, integración con límites Free; notificaciones en BD para solicitudes. |
| **Mensajes** | Chat solo entre usuarios con conexión aceptada; UI lista + conversación. |
| **Perfil** | Edición enriquecida, stats en vivo, completitud; visibilidad global sincronizada con BD. |
| **Visibilidad** | Oculto por defecto; toggle para mostrarse en descubrimiento; persiste en `profiles.visible`. |
| **Monetización** | **Stripe Checkout** (`/upgrade`), API checkout + **webhook** que actualiza `profiles.plan`; límites y precios referenciados en `lib/plan-limits.ts`, `lib/product-config.ts` y este documento (§7). |
| **Middleware** | Rutas de app protegidas por sesión Supabase; páginas de login/signup redirigen si ya hay sesión. |

### 12.2 Diferencias notables respecto al texto original del PRD

- **LinkedIn OAuth** — no implementado; solo Google además de email/contraseña.
- **Mensaje de conexión “IA”** — hoy es **plantilla automática** (`generateMessage` u equivalente), editable por el usuario; no hay integración LLM.
- **Moderación / reportes** — mencionado en §10; **sin UI ni backend de reporte** dedicado en el código revisado.
- **PWA** — experiencia web móvil sí; **sin manifest / instalación PWA** como entregable explícito.
- **Branding OAuth** — la pantalla de Google puede seguir mostrando el dominio `*.supabase.co` salvo **dominio personalizado** en Supabase (comercial) y ajustes en Google Cloud consent screen.

### 12.3 Backlog sugerido (próximas ampliaciones)

Priorizar según eventos, crecimiento o riesgo:

1. **LinkedIn OAuth** (o más proveedores) si reduce fricción de registro.
2. **Reportar usuario / contenido** y política operativa de moderación.
3. **PWA** (manifest, iconos, offline mínimo) si se busca install en móvil.
4. **Mensaje de conexión con IA** (opcional, con coste y políticas claras).
5. **Validación y UX de registro**: email en vivo, medidor de contraseña, recuperación de cuenta.
6. **Dominio custom Supabase** + consent screen Google para marca uniforme en OAuth.
7. Cualquier ampliación **explícita** de métricas (§8) vía analítica producto.

### 12.4 Referencias rápidas en código

- Límites y mensajes Free: `lib/plan-limits.ts`
- Precios MXN y soporte: `lib/product-config.ts`
- OAuth Google (UI): `components/auth/google-auth-button.tsx`
- Callback sesión: `app/auth/callback/route.ts`
- Onboarding persistencia / bandera `onboarding_completed`: `lib/onboarding-persist.ts`
- Webhook: `app/api/webhooks/stripe/route.ts`
- Variables de entorno ejemplo: `.env.local.example`

---

*Murmur — Construye con las personas correctas.*