# FrontCeere

Frontend de la plataforma web **CEERE Software**.

- Sitio público comercial
- Plataforma privada de gestión interna (teletrabajo)

**Repositorio:** [https://github.com/CeereIngeniero1/FrontCeere](https://github.com/CeereIngeniero1/FrontCeere)  
**Entorno de prueba:** [https://prueba.ceere.net](https://prueba.ceere.net)

Plan por fases: [`PLAN.md`](./PLAN.md).

> **Estado:** Fases 1–11 del frontend completadas.  
> Con `VITE_AUTH_MODE=demo` la sesión y los datos de negocio son temporales (marcados DEMO).  
> Con `VITE_AUTH_MODE=api` el cliente usa cookies HTTP-only contra NestJS.

## Requisitos

- Node.js 20+
- npm 10+

## Instalación

```bash
npm install
```

## Variables de entorno

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

No suba `.env` al repositorio. Use `.env.example` como plantilla.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Desarrollo local |
| `npm run lint` | ESLint |
| `npm run build` | Compila a `dist/` y copia `.htaccess` |
| `npm run preview` | Vista previa del build |
| `npm run verify:dist` | Comprueba `dist` (index, assets, `.htaccess` SPA) |
| `npm run release:check` | lint + build + verify:dist |

## Rutas públicas

`/`, `/ceere-sio`, `/servicios`, `/nosotros`, `/contacto`, `/login`

## Rutas privadas (`/app/*`)

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

`/admin/*` → `/app/dashboard`

### Credenciales DEMO

```text
ADMIN   admin@ceere.test   / demo123
LEADER  lider@ceere.test   / demo123
MEMBER  miembro@ceere.test / demo123
```

## Compilación y despliegue en `prueba.ceere.net`

```bash
npm run release:check
```

1. Genere el build (incluye `.htaccess` en `dist/`).
2. Suba **solo el contenido** de `dist/` al document root del subdominio:
   - `index.html`
   - `.htaccess`
   - `assets/`
3. Compruebe:
   - Sitio comercial: `/`, `/servicios`, `/contacto`
   - Login y panel: `/login` → `/app/dashboard`
   - **F5** en `/app/tareas` y `/servicios` (no debe dar 404)
   - Roles: MEMBER no ve Equipo/Reportes/Configuración
4. Para apuntar al API de pruebas en el build:

```powershell
$env:VITE_API_URL="https://api-prueba.ceere.net/api"
$env:VITE_AUTH_MODE="api"
npm run release:check
```

## Fuera de alcance

- Chat, WhatsApp, cámara, capturas o vigilancia
- Sustitución del WordPress en `https://ceere.net/`
- Exportación Excel y Kanban (mejoras posteriores)

## Siguiente paso (producto)

Integrar **BackCeere** real: publicar `api-prueba.ceere.net`, cambiar a `VITE_AUTH_MODE=api` y retirar los mocks DEMO módulo a módulo.
