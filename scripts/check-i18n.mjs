import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SRC_DIR = path.join(ROOT, 'src')
const DICT_DIR = path.join(SRC_DIR, 'data', 'dictionaries')

const dictionaries = {
  en: JSON.parse(fs.readFileSync(path.join(DICT_DIR, 'en.json'), 'utf8')),
  th: JSON.parse(fs.readFileSync(path.join(DICT_DIR, 'th.json'), 'utf8'))
}

const isTraversable = value => typeof value === 'object' && value !== null

const flattenLeafKeys = (obj, prefix = '') => {
  if (!isTraversable(obj)) return [prefix]

  return Object.entries(obj).flatMap(([key, value]) =>
    flattenLeafKeys(value, prefix ? `${prefix}.${key}` : key)
  )
}

const getByPath = (obj, keyPath) =>
  keyPath
    .split('.')
    .reduce((acc, key) => (isTraversable(acc) ? acc[key] : undefined), obj)

const collectFiles = dir => {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue

    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath))
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      files.push(fullPath)
    }
  }

  return files
}

const files = collectFiles(SRC_DIR)
const translationKeyRegex = /\b(?:t|clientT)\(\s*['"]([^'"]+)['"]/g
const referencedKeys = new Set()

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')
  let match

  while ((match = translationKeyRegex.exec(content))) {
    referencedKeys.add(match[1])
  }
}

const enDmsKeys = new Set(flattenLeafKeys(dictionaries.en.dms))
const thDmsKeys = new Set(flattenLeafKeys(dictionaries.th.dms))

const dmsOnlyInEn = [...enDmsKeys].filter(key => !thDmsKeys.has(key)).sort()
const dmsOnlyInTh = [...thDmsKeys].filter(key => !enDmsKeys.has(key)).sort()

const missingInEn = [...referencedKeys].filter(key => getByPath(dictionaries.en, key) === undefined).sort()
const missingInTh = [...referencedKeys].filter(key => getByPath(dictionaries.th, key) === undefined).sort()

let hasFailure = false

if (missingInEn.length || missingInTh.length) {
  hasFailure = true
  console.error('❌ Missing referenced translation keys')

  if (missingInEn.length) {
    console.error(`  - Missing in en.json (${missingInEn.length})`)
    for (const key of missingInEn) console.error(`    • ${key}`)
  }

  if (missingInTh.length) {
    console.error(`  - Missing in th.json (${missingInTh.length})`)
    for (const key of missingInTh) console.error(`    • ${key}`)
  }
} else {
  console.log('✅ All referenced translation keys exist in both en.json and th.json')
}

if (dmsOnlyInEn.length || dmsOnlyInTh.length) {
  console.warn('⚠️  dms.* key parity mismatch')

  if (dmsOnlyInEn.length) {
    console.warn(`  - Only in en.dms (${dmsOnlyInEn.length})`)
    for (const key of dmsOnlyInEn) console.warn(`    • ${key}`)
  }

  if (dmsOnlyInTh.length) {
    console.warn(`  - Only in th.dms (${dmsOnlyInTh.length})`)
    for (const key of dmsOnlyInTh) console.warn(`    • ${key}`)
  }
} else {
  console.log('✅ dms.* leaf-key parity is consistent between en and th')
}

if (hasFailure) process.exit(1)
