import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, '.htaccess')
const destDir = join(root, 'dist')
const dest = join(destDir, '.htaccess')

if (!existsSync(source)) {
  console.error('No se encontró .htaccess en la raíz del proyecto.')
  process.exit(1)
}

if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true })
}

copyFileSync(source, dest)
console.log('✓ .htaccess copiado a dist/')
