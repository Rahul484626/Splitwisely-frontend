import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const src = resolve(root, '../Splitwisely-backend/src/openapi/openapi.json');
const destDir = resolve(root, 'src/app/core/api/generated');
const dest = resolve(destDir, 'openapi.json');
const out = resolve(destDir, 'schema.d.ts');

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log(`Copied OpenAPI → ${dest}`);

const result = spawnSync(
  'npx',
  ['--yes', 'openapi-typescript', dest, '-o', out],
  { cwd: root, stdio: 'inherit', shell: true },
);

process.exit(result.status ?? 1);
