# Murmur — Product Requirements Document

**Versión:** 1.3  
**Última revisión:** Junio 2026  
**Estado:** Documento vivo — las secciones 1–11 siguen siendo la referencia de producto; la **§12** describe qué está construido hoy en el código frente a ese alcance. Usar la §12 para planificar iteraciones futuras.

---

## 1. Visión del producto

**Murmur** es una red social web-first para builders que buscan a las personas correctas para construir.

> *"Construye con las personas correctas."*

La propuesta pública de valor (landing + metadescripción) resume: *la red para builders & launchers* — socios, talento, mentores, inversionistas y más — sin depender solo del networking casual.

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

### Diversidad de contextos (producto y datos)

Murmur está pensado para **builders y expertos en múltiples mundos**, no solo tecnología clásica:

- **Quince industrias principales** en catálogo (nivel 1), cada una mapeada a un **área funcional** de matching (técnico, producto, negocio, operaciones, ciencia): desde tecnología e IA, salud y biotech, educación y fintech, hasta agro, retail, energía, gobierno, legal, deporte y bienestar, etc.
- **Verticales de foco** (nivel 2): decenas de especializaciones por sector (p. ej. fintech, insurtech, salud digital), cargadas en BD (`industry_verticals`) y alineadas al árbol de negocio.
- **Roles de expertise** (nivel 3): carreras concretas por vertical (p. ej. director médico, PM de salud digital, staff engineer, regulatory affairs), con límites de selección en perfil y búsquedas para mantener foco.
- **Tipos de relación** (co-founder, empleo, colaboración, mentoría, inversión, abierto) y el split **tengo proyecto / quiero contribuir** permiten representar trayectorias muy distintas en un mismo producto.
- **Talento blando** (`talent_catalog`) complementa lo duro de industria/expertise para refinar compatibilidad y filtros Premium.

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
- **Recuperación de contraseña** (`/auth/forgot-password`): enlace por email vía Supabase Auth; el login puede precargar el email en la URL (`?email=`).
- **Cerrar sesión desde onboarding** para cambiar de cuenta sin terminar el flujo.

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
- Dato curioso opcional (texto libre ampliado)
- **Taxonomía de negocio en tres niveles** (sincronizada con Postgres y seeds en código):
  - **Una industria principal** (catálogo de **15 sectores**: tecnología e IA, salud y biotech, educación, finanzas y fintech, entretenimiento y medios, artes y creativo, construcción e inmobiliario, manufactura, agro y alimentación, gobierno, turismo y hospitalidad, energía y sustentabilidad, retail, legal y consultoría, deporte y bienestar, etc.)
  - Hasta **3 verticales** de foco bajo esa industria (nivel 2; opciones dependen del árbol `industry_verticals` / `leaf-catalog`)
  - Hasta **3 roles de expertise** bajo las verticales elegidas (nivel 3; `expertise_catalog` + `profile-taxonomy` / `industry-expertise-role-seeds`)
- El **área funcional** usada en matching (técnico, producto, negocio, operaciones, ciencia) se **deriva** del mapa `maps_to` de industria/verticales/expertise — el usuario no elige un dropdown duplicado de “área” en el paso actual del onboarding.
- Años de experiencia: 0-2 / 3-5 / 6-10 / 10+
- Éxito o línea destacada para la card (límite acotado en UI)
- Disponibilidad: Full-time ya / Part-time explorando / En 3-6 meses
- Soft skills *(hasta 5; catálogo `talent_catalog`)*
- Forma de trabajar *(multi-select)*: Remoto, Presencial, Híbrido, Proceso estructurado, Async *(el chip “decisiones rápidas” puede excluirse en onboarding según producto)*

**Paso 5 — Contexto del proyecto o búsqueda**
- *Si tiene proyecto:* nombre, etapa, descripción de qué busca
- *Si quiere contribuir:* tipo de oportunidad buscada, qué puede aportar
- *Implementación:* existe página **`/onboarding/project`** con UI de opciones y campos; **la secuencia actual del onboarding** puede enlazar directamente de perfil a ubicación — integrar este paso en el flujo y persistencia es trabajo de producto pendiente cuando se active contexto de proyecto en Supabase.

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
- **Bio** (extracto en la card)
- Área funcional + experiencia
- Logro destacado
- Disponibilidad
- Industria principal, verticales (≤3) y roles de expertise (≤3)
- Indicador de compatibilidad: Baja / Media / Alta (derivado del **match score v1** cuando hay búsquedas activas)
- **Contador de recomendaciones** (si el perfil lo muestra y tiene señales)

**Match score v1**
- Overlap ponderado entre criterios de la búsqueda activa y el perfil (industria, expertise, verticales, talent, relaciones).
- Score 0–100; tiers: alta ≥ 60, media ≥ 30, baja &lt; 30 (`lib/match-score.ts`).
- Con búsquedas activas, los perfiles se **rankean** por score; sin búsquedas activas se listan perfiles visibles sin score.
- El feed muestra **todos los perfiles visibles** de la red (filtrados por ciudad, disponibilidad, etc.), no solo los que hacen match con una búsqueda.

**Búsqueda de texto en Descubrir**
- Campo para filtrar por nombre, rol, ciudad u otros campos del perfil (`DiscoverProfileSearch`).

**Filtro “solo recomendados”**
- Toggle para ver únicamente perfiles que el usuario marcó como **Recomendar** (señal privada; ver §6.8).

**Detalle de perfil**
- Al abrir un perfil desde Descubrir, conexiones, notificaciones o chat, la navegación va a **`/p/[id]`** (URL pública compartible).
- *El panel lateral/slide-in de detalle en el feed ya no es el flujo principal* (`ProfileDetailPanel` queda como componente legacy sin uso en feed).
- El query legacy `?spotlight=` en `/feed` redirige a `/p/[id]`.

**Acciones en perfil (usuario autenticado)**
- Conectar (drawer con mensaje pre-rellenado por plantilla, editable)
- Compartir enlace público
- **Recomendar / No recomendar** (señal privada del viewer)
- **Reportar perfil**

**Filtros**
- Ciudad / región
- Disponibilidad
- Área funcional
- Tipo de relación buscada
- Industria principal
- Verticales (nivel 2) y expertise (nivel 3), mismo criterio que el perfil
- Soft skills *(solo Premium en cliente)*
- **Solo perfiles recomendados** *(cualquier plan; filtra por tu propia señal de recomendación)*

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
- **Respuestas (reply)** a un mensaje concreto: cita el mensaje original en la burbuja (`reply_to_message_id` en BD)
- Enter para enviar, Shift+Enter para nueva línea
- Botón de acceso al perfil del contacto → **`/p/[id]`**
- **Reportar usuario** desde el chat (`ReportUserDrawer` + `POST /api/reports`)

---

### 6.6 Mi perfil

Pantalla de gestión del perfil propio del usuario (`/profile`).

**Acceso en la app**
- El perfil propio **no es un ítem principal del sidebar**; se abre desde el **avatar / fila de cuenta** (sidebar desktop, sheet “Config” en mobile).
- Los perfiles ajenos se abren siempre en **`/p/[id]`**.

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

**Señales sobre otros perfiles** *(en `/p/[id]` cuando estás autenticado)*
- Recomendar / No recomendar (privado; alimenta filtro “solo recomendados” en Descubrir)
- Contador público de recomendaciones en card/perfil si el dueño lo permite (`show_recommendation_count`)

---

### 6.7 Visibilidad y privacidad

- **Toggle de visibilidad** accesible desde el menú de configuración (en mobile) y sidebar (en desktop)
- Estado Visible: el usuario aparece en búsquedas de otros
- Estado Oculto: el usuario no aparece en ninguna búsqueda
- El estado persiste entre sesiones
- El usuario puede cambiar su visibilidad en cualquier momento sin perder su perfil
- **Checklist de primeros pasos** post-onboarding en Descubrir (`FirstActionsCard`): activar visibilidad, crear búsqueda, activar radar; dismissible por usuario

---

### 6.8 Perfiles públicos compartibles (`/p/[id]`)

Ruta canónica para ver y compartir un perfil. Sustituye enlaces internos dispersos y el query `?spotlight=` del feed.

**Quién puede ver un perfil**
- Perfil con `visible = true`
- El propio dueño (redirige a `/profile` si visitas tu UUID)
- Usuarios con conexión **pending** o **accepted** con el dueño
- Resuelto en servidor vía RPC **`get_public_profile`** (campos seguros; sin email ni datos internos)

**Visitante sin sesión**
- Layout **`PublicGuestChrome`**: header con logo + **Iniciar sesión** + **Únete** (preservan `next` a la URL del perfil)
- Contenido: `ProfileViewContent` (bio, proyecto, taxonomía, etc.)
- **Un solo CTA inferior:** botón **Conectar** → `/auth/signup?next=/p/{id}`
- Sin duplicar login/signup/compartir en el footer

**Usuario autenticado con onboarding completo**
- Mismo URL pero dentro del **shell de la app** (`AuthenticatedAppShell`: sidebar, topbar, bottom nav)
- Acciones: conectar, compartir, recomendar, reportar (`ProfileInteractionActions`)

**SEO y sharing**
- `generateMetadata` por perfil (nombre, rol, bio, Open Graph)
- URL absoluta: `profilePublicUrl` / `lib/profile-path.ts`
- Favicon y previews OG/Twitter con isotipo Murmur (`app/opengraph-image`, `app/twitter-image`)

**Deep links de auth**
- Login/signup respetan `?next=` con validación de ruta interna (`lib/safe-internal-path.ts`, middleware)

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
| Conexiones con estado `accepted` | máx. **11** por usuario |
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

### Flujo de perfil compartible
```
Usuario visible comparte /p/[id] → Visitante ve perfil (guest chrome) →
Conectar → Signup con next → Onboarding → Vuelve al perfil → Conectar de verdad
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
- **Moderación** — flujo de **reporte de usuario** desde perfil y chat (`POST /api/reports`, tabla `user_reports`); *revisión operativa y panel admin pendientes.*
- **Solo web por ahora** — app web responsive y `viewport` adaptado a móvil; *manifest / PWA instalable no consolidado como entregable V1.*

---

## 11. Lo que Murmur NO es

- No es un job board — no hay publicaciones de vacantes
- No es LinkedIn — no es para networking profesional general
- No es Tinder para founders — no hay swipe ni match instantáneo sin contexto
- No es una herramienta de gestión de proyectos
- No reemplaza el proceso de due diligence entre founders — facilita el primer contacto

---

## 12. Estado de implementación (snapshot junio 2026)

Esta sección describe **lo que ya existe en el repositorio / producción** (`https://joinmurmur.xyz`) respecto a las especificaciones anteriores. Sirve como línea base para priorizar el backlog; las secciones 1–11 pueden seguir aspirando a más alcance del aquí listado como “hecho”.

### 12.1 Construido y operativo (alineado al PRD)

| Área | Qué cubre hoy |
|------|----------------|
| **Auth** | Registro e inicio de sesión con **email y contraseña**; **Google** (`signInWithOAuth`, `app/auth/callback/route.ts`). **Recuperación de contraseña** (`/auth/forgot-password`). Perfil `public.profiles` creado vía trigger en `auth.users`. **Cerrar sesión** desde onboarding y app. Deep links `?next=` en login/signup con validación de ruta interna. |
| **Gating onboarding** | Sin `onboarding_completed`, el usuario **no entra** al layout de la app (`app/(app)/layout.tsx`): siempre redirige a `/onboarding`. El callback OAuth aplica la misma lógica antes de enviar a `/feed`. |
| **Onboarding** | Flujo multipaso: intro, evento (código), rol, relaciones, **perfil** con taxonomía industria → verticales → expertise, talent/soft skills, **ubicación** (GPS + geocodificado + ciudades/radio), cierre (`/onboarding/done`). Ruta **`/onboarding/project`** disponible; integración completa en secuencia/persistencia aún parcial. |
| **Landing** | Home público; copy **builders & launchers** (`lib/site-metadata.ts`); hero sin precios en nav. **Favicon** + **OG/Twitter** con isotipo. Legales en `/terms` y `/privacy`. |
| **Feed / Descubrir** | Radar de activación, selector de búsquedas con conteo de matches, **todas las cards de perfiles visibles**, **bio en card**, **match score v1** y ranking, búsqueda de texto, filtros (Free vs Premium), filtro **solo recomendados**, modo evento. **Descubrir** destacado en nav mobile (centro) y sidebar (CTA). Cards abren **`/p/[id]`**. Checklist **primeros pasos** post-onboarding. |
| **Perfiles públicos** | Ruta **`/p/[id]`**, RPC **`get_public_profile`**, metadata SEO, guest chrome (login/únete arriba, **Conectar** abajo), shell autenticado si hay sesión + onboarding. Enlaces unificados vía `lib/profile-path.ts`. `?spotlight=` → redirect a `/p/[id]`. |
| **Búsquedas** | CRUD, estados activa/pausada, límites Free (una activa) vs Premium. |
| **Conexiones** | Envío, pendiente/aceptada/rechazada, cards responsivas; enlaces a perfil en `/p/[id]`; límites Free (**11** aceptadas) con enforcement en cliente y **triggers/RPCs Postgres**. |
| **Mensajes** | Chat entre conexiones aceptadas; **replies** con cita; Realtime; inbox con RPC `last_messages_for_chats`; perfil del peer en `/p/[id]`; **reportar** desde chat. |
| **Recomendaciones** | Voto privado recomendar / no recomendar; contador opcional en perfil ajeno; filtro en Descubrir. |
| **Reportes** | `ReportUserDrawer` + `POST /api/reports` desde perfil y chat. |
| **Perfil propio** | `/profile` vía avatar/cuenta (no nav principal). Edición en drawers, stats, visibilidad. |
| **Visibilidad** | Oculto por defecto; toggle; persiste en `profiles.visible`. |
| **Monetización** | Stripe Checkout (`/upgrade`), webhook → `profiles.plan`; límites en `lib/plan-limits.ts` y SQL. |
| **Middleware** | Rutas de app protegidas; login/signup redirigen si hay sesión; preserva query en `next`. |

### 12.2 Diferencias notables respecto al texto original del PRD

- **Panel lateral de detalle en feed** — sustituido por navegación a **`/p/[id]`**; `ProfileDetailPanel` sin uso activo en feed.
- **Componentes de onboarding** `HierarchicalIndustrySelector` / `FunctionalAreasOnboardingSelect` pueden no estar cableados; selector activo: **IndustrySingleSelect + VerticalMultiSelect + ExpertiseMultiSelect**.
- **LinkedIn OAuth** — no implementado.
- **Mensaje de conexión “IA”** — plantilla automática (`generateMessage`), editable; sin LLM.
- **Moderación operativa** — reportes se guardan; sin panel admin ni workflows de revisión.
- **PWA** — web responsive sí; sin manifest instalable como entregable.
- **Branding OAuth** — pantalla Google puede mostrar `*.supabase.co` sin dominio custom Supabase.

### 12.3 Backlog sugerido (próximas ampliaciones)

1. **LinkedIn OAuth** (o más proveedores).
2. **Panel admin / moderación** para revisar `user_reports`.
3. **PWA** (manifest, iconos).
4. **Mensaje de conexión con IA** (opcional).
5. **Validación UX de registro**: email en vivo, medidor de contraseña.
6. **Dominio custom Supabase** + consent screen Google.
7. Analítica explícita de métricas (§8).
8. **Integrar `/onboarding/project`** en flujo y persistencia completa.

### 12.4 Referencias rápidas en código

| Tema | Archivos |
|------|----------|
| Límites Free | `lib/plan-limits.ts`, `lib/product-config.ts` |
| Taxonomía | `lib/profile-taxonomy.ts`, `lib/industry-expertise-role-seeds.ts` |
| Match score | `lib/match-score.ts` |
| Perfil público | `app/p/[id]/`, `lib/data/public-profiles.ts`, `supabase/migrations/20260624120000_public_profile_rpc.sql` |
| Rutas de perfil | `lib/profile-path.ts` |
| Guest chrome | `components/layout/public-guest-chrome.tsx`, `public-guest-header.tsx`, `profile-guest-actions.tsx` |
| Acciones autenticadas en perfil | `components/profile/profile-interaction-actions.tsx`, `profile-view-content.tsx` |
| Recomendaciones | `lib/data/recommendations.ts`, `lib/recommendation-types.ts` |
| Reportes | `components/report/report-user-drawer.tsx`, `app/api/reports/` |
| Chat replies | `lib/chat-replies.ts`, `components/messages/chat-conversation.tsx` |
| Auth deep links | `lib/safe-internal-path.ts`, `middleware.ts` |
| SEO / branding | `lib/site-metadata.ts`, `app/opengraph-image.tsx` |
| Primeros pasos | `lib/first-actions.ts`, `components/onboarding/first-actions-card.tsx` |
| OAuth / callback | `components/auth/google-auth-button.tsx`, `app/auth/callback/route.ts` |
| Realtime chat | `hooks/use-chat-messages-realtime.ts`, `lib/data/chats.ts` |
| Stripe | `app/api/webhooks/stripe/route.ts` |
| Env ejemplo | `.env.local.example` |

---

*Murmur — Construye con las personas correctas.*