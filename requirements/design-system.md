---
name: murmur-design-system
description: Guía de diseño completa de Murmur. Usar siempre que se construya cualquier componente UI, pantalla, layout o estilo visual del proyecto. Incluye tokens de diseño, tipografía, colores, componentes, espaciado, iconografía y patrones de interacción. Aplicar en cualquier archivo .tsx, .css o Tailwind del proyecto Murmur.
---

# Murmur — Design System

Guía de referencia para construir cualquier pantalla o componente de Murmur. Seguir estos tokens y patrones garantiza consistencia visual en todo el producto.

---

## 1. Tipografía

### Fuente principal
**Raleway** — usada en toda la UI, incluyendo el logo/wordmark.

```html
<!-- En el <head> de cada página -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

```css
/* En globals.css */
body {
  font-family: 'Raleway', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

```js
// En tailwind.config.js
fontFamily: {
  sans: ['Raleway', 'system-ui', 'sans-serif'],
}
```

### Fuente secundaria (solo scanner/código)
**Geist Mono** — solo para el label animado del radar en el feed.

### Escala tipográfica

| Uso | Size | Weight | Letter-spacing |
|-----|------|--------|---------------|
| Hero H1 | clamp(42px, 10vw, 80px) | 800 | -2.5px |
| Page title | 18px | 800 | -0.4px |
| Section title | 16px | 700 | -0.3px |
| Card title | 14px | 700 | -0.2px |
| Body | 13px | 400 | 0 |
| Label / meta | 12px | 500 | 0 |
| Caption / tag | 10–11px | 500–600 | +0.05–0.08em |
| Micro / timestamp | 9–10px | 400 | 0 |
| Logo wordmark | 15–16px | 700 | -0.5px |

**Regla:** Todos los labels en uppercase usan `letter-spacing: 0.06–0.08em` y `font-weight: 600`.

---

## 2. Paleta de colores

### Variables CSS (definir en `:root`)

```css
:root {
  /* Backgrounds */
  --bg:   #ffffff;
  --bg2:  #f7f7f9;
  --bg3:  #f0f0f4;

  /* Borders */
  --border:  #e8e8ed;
  --border2: #d5d5de;

  /* Text */
  --text:  #0a0a0f;   /* primario */
  --text2: #6b6b7a;   /* secundario */
  --text3: #a8a8b8;   /* placeholder / meta */

  /* Brand — púrpura */
  --p:  #5b52d4;                  /* principal */
  --pl: #f0efff;                  /* light background */
  --pm: rgba(91, 82, 212, 0.20); /* medium / border */

  /* Success — verde */
  --g:  #1a9e6e;
  --gl: #e6f7f1;

  /* Semantic */
  --amber: #EF9F27;
  --amber-bg: #FAEEDA;
  --red: #E24B4A;
  --red-bg: #fef2f2;

  /* Radius */
  --r:  10px;  /* standard */
  --rl: 14px;  /* large (cards) */

  /* Safe areas iOS */
  --sat: env(safe-area-inset-top, 0px);
  --sab: env(safe-area-inset-bottom, 0px);
}
```

### Equivalencias Tailwind

Agregar en `tailwind.config.js`:

```js
colors: {
  brand: {
    DEFAULT: '#5b52d4',
    light:   '#f0efff',
    medium:  'rgba(91,82,212,0.20)',
  },
  success: {
    DEFAULT: '#1a9e6e',
    light:   '#e6f7f1',
  },
  surface: {
    DEFAULT: '#ffffff',
    2: '#f7f7f9',
    3: '#f0f0f4',
  },
  border: {
    DEFAULT: '#e8e8ed',
    strong:  '#d5d5de',
  },
  ink: {
    DEFAULT: '#0a0a0f',
    2: '#6b6b7a',
    3: '#a8a8b8',
  },
}
```

---

## 3. Logo e isotipo

### Isotipo — 3 pájaros en diagonal ascendente

```tsx
// Variantes de tamaño
const isotipoSVG = (size = 24, color = '#5b52d4') => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
    <path d="M3 42 Q11 30 22 36 Q11 24 3 42Z"  fill={color} opacity=".45"/>
    <path d="M16 30 Q26 16 38 23 Q26 10 16 30Z" fill={color} opacity=".72"/>
    <path d="M32 20 Q43 6 55 13 Q43 2 32 20Z"  fill={color}/>
  </svg>
)
```

### Logo completo (isotipo + wordmark)

```tsx
const MurmurLogo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const config = {
    sm: { iconSize: 20, fontSize: '13px' },
    md: { iconSize: 24, fontSize: '15px' },
    lg: { iconSize: 28, fontSize: '18px' },
  }
  const { iconSize, fontSize } = config[size]

  return (
    <div className="flex items-center gap-1.5 no-underline">
      {isotipoSVG(iconSize)}
      <span style={{
        fontFamily: "'Raleway', sans-serif",
        fontSize,
        fontWeight: 700,
        color: 'var(--text)',
        letterSpacing: '-0.5px',
      }}>
        murmur
      </span>
    </div>
  )
}
```

**Reglas del logo:**
- Siempre minúsculas: `murmur` — nunca `Murmur` en el wordmark
- Gap entre isotipo y texto: 6px
- Peso del wordmark: 700 (no 500, se ve delgado)
- El isotipo usa `currentColor` cuando va sobre fondo de color

---

## 4. Espaciado y layout

### Grid y contenedores

| Breakpoint | Sidebar | Contenido | Notas |
|-----------|---------|-----------|-------|
| Mobile (< 640px) | Oculto | 100% | Nav inferior fixed |
| Tablet (640–960px) | Oculto | 100% | Nav inferior visible |
| Desktop (> 960px) | 224px | Resto | Nav lateral visible |

### Espaciado interno de componentes

```css
/* Padding estándar */
--space-card:  16px 20px;   /* interior de cards */
--space-page:  20px 24px;   /* padding de páginas */
--space-tight: 10px 14px;   /* elementos compactos */
```

### Safe areas iOS (OBLIGATORIO)

```css
/* Topbar */
.topbar {
  height: calc(var(--topbar-h, 64px) + var(--sat));
  padding-top: var(--sat);
}

/* Mobile nav */
.mobile-nav {
  height: calc(56px + var(--sab));
  padding-bottom: var(--sab);
}
```

---

## 5. Componentes base

### Cards

```css
/* Card estándar */
.card {
  background: var(--bg);
  border: 0.5px solid var(--border);
  border-radius: var(--rl); /* 14px */
  transition: border-color 0.15s;
}
.card:hover { border-color: var(--border2); }
.card.active { border-color: var(--p); }
```

**Regla crítica:** Las cards **nunca** usan `overflow: hidden` — causa que botones y contenido se corten en mobile.

### Botones

```tsx
// Primario (negro)
<button className="
  inline-flex items-center gap-1.5
  px-4 py-2 rounded-lg
  bg-[var(--text)] text-white
  text-[13px] font-semibold
  transition-opacity hover:opacity-85
  font-[Raleway]
">
  Acción principal
</button>

// Secundario (outline)
<button className="
  inline-flex items-center
  px-3 py-2 rounded-lg
  bg-transparent text-[var(--text2)]
  border border-[var(--border)]
  text-[12px] font-medium
  transition-all hover:border-[var(--border2)] hover:text-[var(--text)]
  font-[Raleway]
">
  Secundario
</button>

// Brand (púrpura)
<button className="
  inline-flex items-center gap-1.5
  px-4 py-2 rounded-lg
  bg-[var(--pl)] text-[var(--p)]
  border border-[var(--pm)]
  text-[12px] font-semibold
  transition-all hover:bg-[#e0deff]
  font-[Raleway]
">
  Acción de marca
</button>
```

**Tamaños de botón:**
- Grande: `px-4 py-[9px]` — pantallas principales
- Mediano: `px-4 py-[7px]` — acciones en cards
- Pequeño: `px-3 py-[5px]` — acciones secundarias compactas

**Bordes:** `rounded-lg` (8px) — nunca `rounded-full` (pill) en botones de acción.

### Tags y chips

```tsx
// Tipo de relación — púrpura
<span className="text-[10px] font-medium px-2 py-0.5 rounded
  bg-[var(--pl)] text-[var(--p)] border border-[var(--pm)]">
  Co-founder
</span>

// Área funcional — naranja ámbar
<span className="text-[10px] font-medium px-2 py-0.5 rounded
  bg-[#FAEEDA] text-[#854F0B] border border-[#EF9F27]">
  Técnico / Ing.
</span>

// Industria — verde
<span className="text-[10px] font-medium px-2 py-0.5 rounded
  bg-[var(--gl)] text-[var(--g)] border border-[rgba(26,158,110,0.25)]">
  Healthtech
</span>

// Neutral / gris
<span className="text-[10px] font-medium px-2 py-0.5 rounded
  bg-[var(--bg2)] text-[var(--text2)] border border-[var(--border)]">
  6–10 años
</span>

// Status activo
<span className="text-[10px] font-medium px-2 py-0.5 rounded
  bg-[var(--gl)] text-[var(--g)]">
  Activa
</span>

// Status pausado
<span className="text-[10px] font-medium px-2 py-0.5 rounded
  bg-[var(--bg3)] text-[var(--text3)]">
  Pausada
</span>
```

### Avatares

```tsx
// Avatar con iniciales
<div className="
  w-10 h-10 rounded-full flex-shrink-0
  flex items-center justify-center
  text-xs font-bold
  relative
" style={{ background: avBg, color: avColor }}>
  {initials}
  {/* Punto de online/unread */}
  {online && (
    <div className="absolute bottom-0 right-0 w-2.5 h-2.5
      rounded-full bg-[var(--p)] border-2 border-white"/>
  )}
</div>
```

### Inputs

```css
.input {
  width: 100%;
  padding: 9px 14px;
  border: 1.5px solid var(--border);
  border-radius: var(--r); /* 10px */
  font-size: 13px;
  font-family: 'Raleway', sans-serif;
  color: var(--text);
  background: white;
  outline: none;
  transition: border-color 0.15s;
}
.input:focus { border-color: var(--p); }
textarea.input { resize: none; line-height: 1.55; }
```

### Toggle / Switch

```tsx
<div
  className={`w-8 h-[18px] rounded-full relative transition-colors cursor-pointer
    ${on ? 'bg-[var(--p)]' : 'bg-[var(--border2)]'}`}
  onClick={toggle}
>
  <div className={`w-3 h-3 rounded-full bg-white absolute top-[3px]
    transition-all shadow-sm
    ${on ? 'right-[3px]' : 'left-[3px]'}`}
  />
</div>
```

---

## 6. Navigation

### Sidebar (desktop > 960px)

```
Ancho: 224px
Border: 0.5px solid var(--border) (right)
Estructura:
  ├── Top: Logo + Visibility toggle
  ├── Nav items (flex-1, overflow-y-auto)
  └── Bottom: User row
```

**Nav item activo:** `bg-[var(--pl)] text-[var(--p)] font-medium`
**Nav item hover:** `bg-[var(--bg2)] text-[var(--text)]`

### Mobile nav (≤ 640px)

```
5 tabs: Descubrir · Conexiones · Mensajes · Búsquedas · Config
Height: calc(56px + var(--sab))
Position: fixed bottom-0
Background: rgba(255,255,255,0.96) con backdrop-blur
Z-index: 100 (por encima de panels absolutos)
```

**Tab activo:** icono y label en `var(--p)`

### More sheet (Config tab)

Sheet desde abajo con: Visibilidad toggle + Mi perfil + Eventos + Configuración.

```css
.overlay { background: rgba(10,10,15,0.35); }
.sheet {
  border-radius: 20px 20px 0 0;
  padding-bottom: calc(16px + var(--sab));
}
```

---

## 7. Patrones de interacción

### Drawers / Sheets

Para editar secciones del perfil, crear búsquedas, etc.

```css
.overlay {
  position: fixed; inset: 0;
  background: rgba(10,10,15,0.35);
  z-index: 100;
  opacity: 0; pointer-events: none;
  transition: opacity 0.2s;
}
.overlay.open { opacity: 1; pointer-events: all; }

.drawer {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 22px 24px calc(22px + var(--sab));
  max-height: 90dvh; overflow-y: auto;
  transform: translateY(100%);
  transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
  z-index: 101;
}
.overlay.open .drawer { transform: translateY(0); }
```

Siempre incluir el `drawer-handle`:
```html
<div class="w-9 h-1 rounded-full bg-[var(--bg3)] mx-auto mb-4"/>
```

### Animaciones de entrada

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Cards en listas */
.card { animation: fadeUp 0.22s ease both; }
.card:nth-child(1) { animation-delay: 0.03s; }
.card:nth-child(2) { animation-delay: 0.07s; }
.card:nth-child(3) { animation-delay: 0.11s; }
```

### Toast notifications

```css
.toast {
  position: fixed;
  bottom: 24px; left: 50%;
  transform: translateX(-50%) translateY(12px);
  background: var(--text); color: white;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 12px; font-weight: 500;
  opacity: 0; pointer-events: none;
  transition: all 0.22s;
  z-index: 200;
  white-space: nowrap;
}
.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
```

En mobile, el toast sube por encima del nav:
```css
@media (max-width: 640px) {
  .toast { bottom: calc(56px + var(--sab) + 12px); }
}
```

### Textos expandibles (mensajes en cards)

```css
.expandable-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;
}
.expandable-text.expanded {
  display: block;
  -webkit-line-clamp: unset;
  overflow: visible;
}
```

---

## 8. Iconografía

Usar **SVG inline** — no librerías de íconos externas. Stroke-based, `stroke-width: 1.3–1.5`, `stroke-linecap: round`, `stroke-linejoin: round`.

Tamaños estándar: 14px (sidebar nav), 16px (acciones), 20px (mobile nav), 24px (decorativo).

**El isotipo de Murmur** se usa como elemento decorativo en:
- Badge del hero del homepage
- Pantalla de éxito del onboarding
- Estados vacíos (empty states)
- Esquina del CTA section (sutil, baja opacidad)

---

## 9. Viewport y meta tags

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

`viewport-fit=cover` es **obligatorio** para que las safe areas de iOS funcionen.

---
