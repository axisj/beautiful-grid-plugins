import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const packages = ['antd', 'mui', 'mantine'];

for (const directory of packages) {
  const cwd = resolve('packages', directory);
  const manifest = JSON.parse(readFileSync(resolve(cwd, 'package.json'), 'utf8'));
  assert.equal(manifest.peerDependencies.react, '^19.2.0', `${directory} React peer must match BeautifulGrid`);
  assert.equal(manifest.peerDependencies['react-dom'], '^19.2.0', `${directory} React DOM peer must match BeautifulGrid`);
  assert.ok(existsSync(resolve(cwd, 'LICENSE')), `${directory} must include LICENSE`);
  assert.ok(existsSync(resolve(cwd, 'NOTICE')), `${directory} must include NOTICE`);
  assert.ok(existsSync(resolve(cwd, 'THIRD_PARTY_NOTICES.md')), `${directory} must include third-party notices`);

  const result = spawnSync('npm', ['pack', '--dry-run', '--json'], { cwd, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || `${directory} npm pack failed`);
  const [pack] = JSON.parse(result.stdout);
  const files = new Set(pack.files.map(file => file.path));
  for (const required of [
    'LICENSE',
    'NOTICE',
    'THIRD_PARTY_NOTICES.md',
    'README.md',
    'dist/index.js',
    'dist/index.cjs',
    'dist/index.d.ts',
    'dist/index.d.cts',
    'package.json',
  ]) {
    assert.ok(files.has(required), `${manifest.name} tarball is missing ${required}`);
  }
  if (directory === 'antd') assert.ok(files.has('dist/index.css'), `${manifest.name} tarball is missing its stylesheet`);
}

console.log('package verification passed');
