import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const artifactPath = 'public/r/beautiful-grid-editors.json';
const indexPath = 'public/r/registry.json';
const committedArtifact = readFileSync(artifactPath, 'utf8');
const committedIndex = readFileSync(indexPath, 'utf8');
const build = spawnSync('pnpm', ['registry:build'], { encoding: 'utf8' });
assert.equal(build.status, 0, build.stderr || build.stdout || 'registry build failed');
const rebuiltArtifact = readFileSync(artifactPath, 'utf8');
assert.equal(rebuiltArtifact, committedArtifact, 'generated registry artifact is stale; run pnpm registry:build');
assert.equal(readFileSync(indexPath, 'utf8'), committedIndex, 'generated registry index is stale; run pnpm registry:build');

const item = JSON.parse(rebuiltArtifact);
assert.equal(item.name, 'beautiful-grid-editors');
assert.equal(item.type, 'registry:component');
assert.deepEqual(item.dependencies.sort(), ['@radix-ui/react-popover', 'beautiful-grid', 'lucide-react'].sort());
assert.equal(item.files.length, 11);

const source = item.files.map(file => file.content ?? '').join('\n');
const factories = [
  'createShadcnSelectEditorPlugin',
  'createShadcnDatePickerEditorPlugin',
  'createShadcnColorPickerEditorPlugin',
  'createShadcnCascaderEditorPlugin',
  'createShadcnTimePickerEditorPlugin',
  'createShadcnTreeSelectEditorPlugin',
];
for (const factory of factories) assert.match(source, new RegExp(`export function ${factory}`), `${factory} is missing`);
assert.doesNotMatch(source, /\.\.\/\.\.\/components|\.\.\/i18n|from ['"]antd['"]/, 'registry contains app-specific imports');
assert.ok(item.files.every(file => file.target?.startsWith('components/beautiful-grid/')), 'registry targets must share an install directory');

console.log('registry verification passed');
