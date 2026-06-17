# Murmur

Red web-first para **builders & launchers** — encontrar socios, talento, mentores e inversionistas con intención y contexto.

**Producción:** [joinmurmur.xyz](https://joinmurmur.xyz)

## Documentación interna

| Documento | Contenido |
|-----------|-----------|
| [`requirements/PRD.md`](requirements/PRD.md) | Requisitos de producto, límites Free/Premium, estado de implementación (§12) |
| [`requirements/design-system.md`](requirements/design-system.md) | Tokens, tipografía, componentes, patrones UI (incl. perfil público guest) |

## Stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Supabase** — Auth, Postgres, Realtime, RLS, RPCs
- **Stripe** — suscripción Premium
- **Tailwind CSS** — tokens en `globals.css` (`--p`, `--bg`, safe areas)

## Desarrollo local

```bash
cp .env.local.example .env.local
# Completar URL y keys de Supabase (y Stripe si pruebas checkout)

npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Rutas clave

| Ruta | Descripción |
|------|-------------|
| `/` | Landing pública |
| `/auth/login`, `/auth/signup` | Auth (soportan `?next=`) |
| `/onboarding/*` | Flujo de registro |
| `/feed` | Descubrir |
| `/p/[id]` | Perfil público compartible |
| `/profile` | Perfil propio (editar) |
| `/connections`, `/messages` | Red y chat |
| `/searches` | Búsquedas paralelas |
| `/upgrade` | Checkout Premium |

## Estructura del repo

```
app/              Rutas Next.js (páginas, layouts, API)
components/       UI por dominio (feed, profile, messages, layout…)
lib/              Lógica de negocio, datos Supabase, tipos
hooks/            Hooks React
supabase/         Migraciones SQL
requirements/     PRD y design system
```

## Convenciones

- Perfiles ajenos: siempre **`/p/{uuid}`** (`lib/profile-path.ts`)
- Límites del plan Free: `lib/plan-limits.ts` — deben coincidir con RPCs/triggers SQL (ver PRD §7)
- Copy de marca: `lib/site-metadata.ts`

---

*Murmur — Construye con las personas correctas.*
