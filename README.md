# Ceere Front Test

Frontend de demostración para **Ceere Software**, construido con React, Vite y TypeScript. El objetivo de esta versión es validar que una aplicación moderna puede compilarse y publicarse en cPanel sobre el subdominio `https://prueba.ceere.net`, sin reemplazar el sitio WordPress de producción en [https://ceere.net/](https://ceere.net/).

> **Importante:** la autenticación y los datos del panel son simulados con LocalStorage. No es un sistema seguro ni listo para producción.

## Requisitos

- Node.js 20 o superior (recomendado)
- npm 10 o superior
- Acceso a cPanel solo para el despliegue manual posterior

## Instalación

```bash
npm install
```

## Ejecución local

```bash
npm run dev
```

Abra la URL que muestre Vite (por defecto `http://localhost:5173`).

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run lint` | Análisis estático con ESLint |
| `npm run build` | Compila a `dist/` y copia `.htaccess` |
| `npm run preview` | Vista previa local del build |

## Credenciales de demostración

Estas credenciales **solo** sirven para probar el frontend:

```text
Correo: admin@ceere.test
Contraseña: demo123
```

Al iniciar sesión se guarda una sesión simulada en LocalStorage y se redirige a `/admin`. No existe backend, JWT, cookies seguras ni control de acceso real.

## Compilación

```bash
npm run build
```

El resultado queda en:

```text
dist/
  index.html
  .htaccess
  assets/
```

## Variables de entorno

Copie `.env.example` si desea preparar la URL del API futuro:

```text
VITE_API_URL=https://api-prueba.ceere.net
```

En esta versión **no** se realizan peticiones HTTP reales.

## Estructura del proyecto

```text
src/
  assets/
  components/      # UI reutilizable y Logo
  layouts/         # Público y administrativo
  pages/
    public/        # Sitio comercial
    admin/         # Panel demo
  routes/          # Protección de rutas
  data/            # Datos iniciales centralizados
  hooks/
  services/        # Auth y persistencia local
  types/
  utils/
  styles/
scripts/
  copy-htaccess.mjs
```

## Cómo crear el subdominio en cPanel

1. Inicie sesión en cPanel del hosting de Ceere.
2. Vaya a **Dominios** o **Subdominios**.
3. Cree el subdominio `prueba` para `ceere.net`.
4. Defina el document root, por ejemplo:
   - `public_html/prueba`
   - o la carpeta que cPanel asigne a `prueba.ceere.net`
5. Guarde los cambios y espere la propagación DNS si aplica.

## Cómo subir `dist` a cPanel

1. Ejecute `npm run build` en su máquina.
2. Abra el **Administrador de archivos** de cPanel (o use FTP/SFTP).
3. Entre al document root del subdominio `prueba.ceere.net`.
4. Suba **todo el contenido** de la carpeta `dist/` (no la carpeta `dist` como contenedor vacío).
5. Verifique que en la raíz del subdominio queden:
   - `index.html`
   - `.htaccess`
   - carpeta `assets/`

### Dónde debe quedar `index.html`

`index.html` debe estar en la **raíz del document root** del subdominio, por ejemplo:

```text
/home/usuario/public_html/prueba/index.html
```

No debe quedar dentro de una subcarpeta adicional como `/dist/index.html` si esa no es la raíz del subdominio.

## Cómo verificar `.htaccess`

1. Confirme que el archivo `.htaccess` existe junto a `index.html`.
2. En cPanel, asegúrese de que Apache tenga `mod_rewrite` habilitado (habitual en hosting compartido).
3. El archivo debe reescribir rutas inexistentes hacia `index.html` sin afectar archivos reales de `assets/`.

## Cómo probar rutas directas

Después del despliegue, abra directamente en el navegador:

- `https://prueba.ceere.net/login`
- `https://prueba.ceere.net/admin`
- `https://prueba.ceere.net/admin/agenda`
- `https://prueba.ceere.net/servicios`

Si al actualizar (F5) la página carga correctamente y no muestra 404 de Apache, el `.htaccess` está funcionando.

## Funcionalidades incluidas en esta versión

- Sitio público: inicio, Ceere SIO, servicios, nosotros, contacto
- Login simulado y panel administrativo protegido
- Tareas, agenda, tiempo y reportes con datos locales
- Exportación CSV de reportes desde el navegador

## Qué se conectará después (NestJS + PostgreSQL)

En fases posteriores deberán conectarse, entre otras:

- Autenticación real y autorización
- API de tareas, agenda y tiempo
- Persistencia en PostgreSQL
- Envío real de formularios/correos
- Integraciones externas según prioridad del negocio

## Advertencias

- No modificar ni reemplazar el WordPress de `https://ceere.net/` al publicar esta prueba.
- No usar las credenciales demo en un entorno real.
- No hay WhatsApp, chat, WebSockets, backend ni base de datos en esta versión.
