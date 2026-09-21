# Cliente HTTP — Fase 2

Módulos:

| Archivo | Rol |
| --- | --- |
| `http-client.ts` | Axios (`withCredentials`), helpers y normalización de errores |
| `query-client.ts` | Instancia de TanStack Query |
| `health.api.ts` | `GET /health` relativo a `VITE_API_URL` |
| `index.ts` | Reexportaciones |

Próximos (Fase 3+): `auth.api.ts`, `users.api.ts`, `tasks.api.ts`, etc.
