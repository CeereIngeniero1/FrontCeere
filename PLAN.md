# PLAN — FrontCeere

Documento de planificación del frontend de la plataforma web CEERE.

**Repositorio:** [https://github.com/CeereIngeniero1/FrontCeere](https://github.com/CeereIngeniero1/FrontCeere)  
**Publicación actual:** [https://prueba.ceere.net](https://prueba.ceere.net)  
**API de pruebas (futura integración):** `https://api-prueba.ceere.net/api`  
**API de producción (futura):** `https://api.ceere.net/api`

---

## Diagnóstico técnico (Fase 1 — auditoría)

### Baseline ejecutado

| Comando | Resultado |
| --- | --- |
| `npm install` | OK (dependencias reinstaladas) |
| `npm run lint` | OK |
| `npm run build` | OK (`dist/` + `.htaccess`) |

### Stack actual

- React 19 + Vite 7 + TypeScript
- React Router 7
- Lucide React
- CSS propio (`src/styles/*`) con tokens corporativos
- ESLint
- Script post-build que copia `.htaccess` a `dist/`

**Aún no instalado (previsto en fases posteriores):** TanStack Query, Axios, React Hook Form, Zod, librería de calendario.

### Qué ya existe y se conserva

| Área | Estado |
| --- | --- |
| Sitio comercial | Funcional: `/`, `/ceere-sio`, `/servicios`, `/nosotros`, `/contacto` |
| Login visual | Existe en `/login` (simulado) |
| Layout público | `PublicLayout` con header, nav, footer |
| Layout admin | `AdminLayout` con sidebar, topbar, menú móvil |
| UI reutilizable | Button, Card, Input, Select, Textarea, Modal, Table, Alert, StatusBadge, PageHeader, Logo |
| Panel demo | `/admin/*` con dashboard, tareas, agenda, tiempo, reportes |
| Estilos | `tokens.css`, `components.css`, `layouts.css`, `pages.css` |
| Datos comerciales | `src/data/company.ts`, `services.ts` (copy alineado a ceere.net) |
| Despliegue cPanel | `.htaccess` + `scripts/copy-htaccess.mjs` |

### Limitaciones actuales (demo / no producción)

- Autenticación **simulada** en LocalStorage (`admin@ceere.test` / `demo123`).
- Tareas, agenda, tiempo y reportes usan datos locales (`src/data/*` + LocalStorage).
- **No** hay cliente HTTP real ni cookies HTTP-only.
- Rutas privadas bajo `/admin/*` (el objetivo final es `/app/*`).
- No hay roles reales `ADMIN` | `LEADER` | `MEMBER`.
- Faltan pantallas: reporte diario, equipo, configuración, usuarios, dashboard de equipo.
- `VITE_API_URL` en `.env.example` no incluía el sufijo `/api` (se corrige en Fase 1).

### Principio de evolución

1. **No romper** el sitio comercial publicado en `prueba.ceere.net`.
2. Reorganizar de forma **progresiva** hacia `api/`, `features/`, `pages/app/`.
3. Los mocks de LocalStorage se mantienen **temporalmente** y marcados como demo hasta la integración real con la API.
4. Cada fase termina con `npm run lint` y `npm run build` en verde.

---

## Estructura objetivo (adopción gradual)

```text
src/
├── api/                 # Cliente HTTP y módulos por dominio (Fase 2+)
├── assets/
├── components/
│   ├── common/          # Preparado en Fase 1
│   ├── forms/
│   ├── tables/
│   ├── feedback/
│   └── ui/              # Componentes actuales (se conservan)
├── features/            # Lógica por dominio (Fase 3+)
├── layouts/
│   ├── PublicLayout.tsx
│   └── AdminLayout.tsx  # Evolucionará a AppLayout
├── pages/
│   ├── public/          # Sitio comercial (conservar)
│   ├── admin/           # Demo actual (migrar a app/)
│   └── app/             # Plataforma privada objetivo (Fase 1: carpeta lista)
├── routes/
├── hooks/
├── context/
├── types/
├── utils/
├── data/                # Copy comercial + seeds demo (hasta quitar mocks)
└── services/            # Auth/datos demo (hasta reemplazar por api/)
```

---

## Fases de ejecución

### Fase 1 — Auditoría y reorganización segura *(actual)*

- [x] Inspeccionar el repositorio
- [x] Ejecutar lint y build (baseline)
- [x] Documentar el estado en este `PLAN.md`
- [x] Preparar estructura de carpetas objetivo
- [x] Actualizar `README.md` y `.env.example`
- [x] Mantener intacta la web comercial y las rutas demo actuales
- [ ] Validación humana: confirmar que `https://prueba.ceere.net` sigue correcto tras el próximo despliegue de esta fase (si se publica)

**Criterio de cierre:** lint + build OK; sitio comercial sin cambios funcionales; estructura preparada; documentación lista.

### Fase 2 — Comunicación con la API *(completada)*

- [x] Instalar Axios + TanStack Query
- [x] `src/api/http-client.ts` con `withCredentials` y `ApiError`
- [x] `QueryClientProvider` en `main.tsx`
- [x] `GET /health` vía `health.api.ts` + indicador en `/login`
- [x] `.env.development` con `https://api-prueba.ceere.net/api`
- [x] **No** sustituir pantallas demo (LocalStorage intacto)

**Nota:** al cerrar esta fase, `api-prueba.ceere.net` aún no resolvía DNS desde el entorno de desarrollo. El cliente queda listo; cuando el API esté publicado, el badge de login mostrará el estado real.

### Fase 3 — Autenticación *(completada)*

- [x] `src/api/auth.api.ts` — login / me / logout / refresh
- [x] `AuthProvider` + cookies HTTP-only (`withCredentials`) en modo `api`
- [x] Interceptor de refresh con un solo reintento (sin bucles infinitos)
- [x] Rutas privadas `/app/*` protegidas + `RoleRoute`
- [x] Roles visuales `ADMIN` | `LEADER` | `MEMBER` (menú filtrado)
- [x] Redirect `/admin/*` → `/app/dashboard`
- [x] Modo `VITE_AUTH_MODE=demo` **temporal** (sessionStorage, sin tokens) hasta BackCeere

**Contrato esperado del API:**

```text
POST /auth/login    { email, password } → { user } + Set-Cookie
POST /auth/logout
POST /auth/refresh
GET  /auth/me       → { user }
```

### Fase 4 — Layout administrativo *(parcialmente adelantada en Fase 3)*

- [x] `AppLayout` con menú por permisos, topbar y usuario
- [ ] Pulido responsive / UX adicional si hace falta

### Fase 5 — Dashboard *(completada)*

- [x] Dashboard personal (`/app/dashboard`) con indicadores requeridos
- [x] Dashboard de equipo (`/app/equipo`) para ADMIN / LEADER
- [x] Estados de carga, error y vacío
- [x] Cliente `dashboard.api.ts` + agregador DEMO marcado (`isDemoData`)
- [x] Sin vigilancia invasiva (solo avances y resultados)

### Fase 6 — Tareas *(completada)*

- [x] Listado en tabla con búsqueda y filtros
- [x] Crear / editar / asignar / estado / prioridad
- [x] Identificación visual de vencidas (etiqueta + fila)
- [x] Permisos por rol (MEMBER: solo asignadas)
- [x] React Hook Form + Zod
- [x] `tasks.api.ts` + demo LocalStorage marcado
- [ ] Vista Kanban (mejora posterior)

### Fase 7 — Tiempo

- Start/stop, temporizador informativo, manual, historial, resumen

### Fase 8 — Reporte diario

- Formulario del día, edición, historial, vista de equipo

### Fase 9 — Agenda

- Calendario (mensual/semanal/diario) + CRUD eventos

### Fase 10 — Usuarios, equipo y reportes

- Admin de usuarios, vista de equipo, reportes por rango

### Fase 11 — Pruebas y despliegue

- Lint, build, `.htaccess`, F5 en rutas internas, responsive, permisos

---

## Rutas objetivo (referencia)

### Públicas (conservar)

```text
/
/servicios
/nosotros
/contacto
/login
/ceere-sio   # existente; se mantiene
```

### Privadas (objetivo)

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

Durante la transición, `/admin/*` redirige a `/app/dashboard`.

---

## Fuera de alcance

- Chat interno, WhatsApp, cámara, capturas, vigilancia
- Sustituir WordPress de `ceere.net` producción
- Exportación Excel (segunda versión)
- Kanban (mejora posterior)

---

## Historial de fases

| Fecha | Fase | Notas |
| --- | --- | --- |
| 2026-09-21 | 1 | Auditoría, PLAN.md, estructura de carpetas, README/.env.example |
| 2026-09-21 | 2 | Axios, TanStack Query, http-client, health check, ApiHealthBadge |
| 2026-09-21 | 3 | AuthContext, /app/*, roles, refresh interceptor, modo demo temporal |
| 2026-09-21 | 5 | Dashboards personal y equipo + dashboard.api |
| 2026-09-21 | 6 | Tareas: tabla, filtros, RHF/Zod, permisos, tasks.api |
