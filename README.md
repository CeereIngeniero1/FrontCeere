# FrontCeere

Frontend de la plataforma web **CEERE Software**.

- Sitio público comercial
- Plataforma privada de gestión interna (en evolución hacia la API real)

**Repositorio:** [https://github.com/CeereIngeniero1/FrontCeere](https://github.com/CeereIngeniero1/FrontCeere)  
**Entorno de prueba:** [https://prueba.ceere.net](https://prueba.ceere.net)

El plan de trabajo por fases está en [`PLAN.md`](./PLAN.md).

> **Estado actual:** la web comercial está lista. El panel bajo `/admin` usa datos y sesión **demostrativos** (LocalStorage). El cliente HTTP (Axios + TanStack Query) ya está cableado (Fase 2). La autenticación real con cookies HTTP-only es la Fase 3.

## Requisitos

- Node.js 20+
- npm 10+

## Instalación

```bash
npm install
```

## Variables de entorno

Copie `.env.example` a `.env` (no suba `.env` al repositorio):

```env
# Desarrollo local (backend NestJS)
VITE_API_URL=http://localhost:3000/api

# Pruebas en hosting
# VITE_API_URL=https://api-prueba.ceere.net/api

# Producción
# VITE_API_URL=https://api.ceere.net/api
```

En desarrollo (`npm run dev`) se carga `.env.development` con la URL de pruebas. El login muestra un indicador de `GET /health`. El resto del panel sigue en modo demo hasta la Fase 3+.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (`http://localhost:5173`) |
| `npm run lint` | ESLint |
| `npm run build` | Compila a `dist/` y copia `.htaccess` |
| `npm run preview` | Vista previa del build |

## Rutas públicas

| Ruta | Descripción |
| --- | --- |
| `/` | Inicio |
| `/ceere-sio` | Producto Ceere SIO |
| `/servicios` | Servicios |
| `/nosotros` | Institucional |
| `/contacto` | Formulario (simulado) |
| `/login` | Acceso (hoy: demo LocalStorage) |

## Rutas privadas (demo actual)

| Ruta | Descripción |
| --- | --- |
| `/admin` | Dashboard demo |
| `/admin/tareas` | Tareas locales |
| `/admin/agenda` | Agenda local |
| `/admin/tiempo` | Tiempo local |
| `/admin/reportes` | Reportes + CSV local |

### Credenciales demo (solo LocalStorage)

```text
Correo: admin@ceere.test
Contraseña: demo123
```

**No** es autenticación segura. Se reemplazará por cookies HTTP-only contra la API.

## Rutas privadas objetivo (próximas fases)

```text
/app/dashboard
/app/tareas
/app/tiempo
/app/reporte-diario
/app/agenda
/app/equipo
/app/reportes
/app/configuracion
```

## Estructura (evolución)

```text
src/
  api/           # Preparado (cliente HTTP en Fase 2)
  components/    # UI actual + carpetas common/forms/tables/feedback
  features/      # Dominios (auth, tasks, …) en fases posteriores
  layouts/
  pages/
    public/      # Sitio comercial
    admin/       # Panel demo actual
    app/         # Plataforma privada objetivo
  routes/
  data/          # Contenido comercial + seeds demo
  services/      # Auth/datos demo (temporal)
  styles/
```

## Compilación y despliegue en cPanel (`prueba.ceere.net`)

```bash
npm run build
```

Suba el **contenido** de `dist/` al document root del subdominio:

- `index.html`
- `.htaccess`
- `assets/`

Verifique rutas internas con F5 (`/login`, `/servicios`, `/admin/agenda`).

## Lo que no incluye este frontend

- Chat, WhatsApp, cámara, capturas o vigilancia
- Sustitución del WordPress en `https://ceere.net/`

## Cliente HTTP (Fase 2)

- `src/api/http-client.ts` — Axios con `withCredentials: true`
- `src/api/health.api.ts` — `GET /health`
- `src/api/query-client.ts` — TanStack Query
- Indicador en `/login` (`ApiHealthBadge`)

Para construir apuntando al API de pruebas:

```bash
# PowerShell
$env:VITE_API_URL="https://api-prueba.ceere.net/api"; npm run build
```

## Siguiente paso

**Fase 3** — autenticación real (login / me / logout / refresh), rutas `/app/*` protegidas y roles visuales.
