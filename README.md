# FrontCeere

Frontend de la plataforma web **CEERE Software**.

- Sitio público comercial
- Plataforma privada de gestión interna (en evolución hacia la API real)

**Repositorio:** [https://github.com/CeereIngeniero1/FrontCeere](https://github.com/CeereIngeniero1/FrontCeere)  
**Entorno de prueba:** [https://prueba.ceere.net](https://prueba.ceere.net)

El plan de trabajo por fases está en [`PLAN.md`](./PLAN.md).

> **Estado actual:** web comercial lista. Auth de plataforma en Fase 3 (`/app/*`, roles).  
> Con `VITE_AUTH_MODE=demo` la sesión es temporal (sessionStorage). Con `api`, cookies HTTP-only.  
> Tareas/agenda/tiempo siguen con datos LocalStorage hasta las fases de negocio.

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
VITE_API_URL=http://localhost:3000/api
VITE_AUTH_MODE=demo

# Pruebas
# VITE_API_URL=https://api-prueba.ceere.net/api
# VITE_AUTH_MODE=api

# Producción
# VITE_API_URL=https://api.ceere.net/api
# VITE_AUTH_MODE=api
```

| Variable | Descripción |
| --- | --- |
| `VITE_API_URL` | Base del API, **incluyendo** `/api` |
| `VITE_AUTH_MODE` | `demo` (temporal) o `api` (cookies reales) |

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
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
| `/login` | Acceso a la plataforma |

## Rutas privadas (`/app/*`)

Protegidas por sesión. El menú se filtra por rol.

| Ruta | Roles |
| --- | --- |
| `/app/dashboard` | ADMIN, LEADER, MEMBER |
| `/app/tareas` | ADMIN, LEADER, MEMBER |
| `/app/tiempo` | ADMIN, LEADER, MEMBER |
| `/app/reporte-diario` | ADMIN, LEADER, MEMBER |
| `/app/agenda` | ADMIN, LEADER, MEMBER |
| `/app/equipo` | ADMIN, LEADER |
| `/app/reportes` | ADMIN, LEADER |
| `/app/configuracion` | ADMIN |

`/admin/*` redirige a `/app/dashboard`.

### Credenciales DEMO (`VITE_AUTH_MODE=demo`)

```text
ADMIN   admin@ceere.test  / demo123
LEADER  lider@ceere.test  / demo123
MEMBER  miembro@ceere.test / demo123
```

No hay tokens en localStorage. En modo `api` la sesión vive solo en cookies HTTP-only.

## Autenticación (contrato API)

```text
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/me
```

## Cliente HTTP

- Axios + `withCredentials`
- TanStack Query
- Refresh ante 401 (un intento, sin bucles)
- `GET /health` visible en `/login`

## Compilación y despliegue (cPanel)

```bash
npm run build
```

Suba el contenido de `dist/` (`index.html`, `.htaccess`, `assets/`).

## Fuera de alcance

- Chat, WhatsApp, cámara, capturas o vigilancia
- Sustitución del WordPress en `https://ceere.net/`

## Siguiente paso

**Fase 7** — registro de tiempo (inicio/detención, temporizador, historial).
