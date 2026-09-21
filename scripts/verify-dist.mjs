/**
 * Verificación post-build para despliegue en cPanel / Apache.
 * Uso: node scripts/verify-dist.mjs  (tras npm run build)
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

const errors = []

function ok(message) {
  console.log(`✓ ${message}`)
}

function fail(message) {
  errors.push(message)
  console.error(`✗ ${message}`)
}

if (!existsSync(dist)) {
  fail('No existe dist/. Ejecute npm run build primero.')
} else {
  ok('Existe dist/')
}

const indexHtml = join(dist, 'index.html')
const htaccess = join(dist, '.htaccess')
const assetsDir = join(dist, 'assets')

if (existsSync(indexHtml)) ok('dist/index.html presente')
else fail('Falta dist/index.html')

if (existsSync(htaccess)) {
  ok('dist/.htaccess presente')
  const content = readFileSync(htaccess, 'utf8')
  if (/RewriteRule/i.test(content) && /index\.html/i.test(content)) {
    ok('.htaccess incluye rewrite SPA hacia index.html (F5 en rutas internas)')
  } else {
    fail('.htaccess no parece configurar el fallback SPA a index.html')
  }
} else {
  fail('Falta dist/.htaccess — las rutas /app/* fallarán con F5 en Apache')
}

if (existsSync(assetsDir) && statSync(assetsDir).isDirectory()) {
  const assets = readdirSync(assetsDir)
  const hasJs = assets.some((name) => name.endsWith('.js'))
  const hasCss = assets.some((name) => name.endsWith('.css'))
  if (hasJs && hasCss) ok(`dist/assets/ con JS y CSS (${assets.length} archivos)`)
  else fail('dist/assets/ incompleto (falta JS o CSS)')
} else {
  fail('Falta dist/assets/')
}

console.log('')
console.log('Checklist de rutas a validar manualmente en preview o en prueba.ceere.net:')
console.log('  Públicas: /, /servicios, /nosotros, /contacto, /login, /ceere-sio')
console.log('  Privadas: /app/dashboard, /app/tareas, /app/tiempo, /app/reporte-diario, /app/agenda')
console.log('  Roles:    /app/equipo, /app/reportes (ADMIN/LEADER), /app/configuracion (ADMIN)')
console.log('  Compat:   /admin → /app/dashboard')
console.log('  F5:       refrescar /app/tareas y /servicios sin 404')

if (errors.length > 0) {
  console.error(`\nVerificación fallida (${errors.length}).`)
  process.exit(1)
}

console.log('\nVerificación de dist OK. Listo para subir el contenido de dist/ a prueba.ceere.net')
