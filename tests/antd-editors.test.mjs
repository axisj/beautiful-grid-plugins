import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const cjsEditors = require('../packages/antd/dist/index.cjs');
const editors = await import('../packages/antd/dist/index.js');

test('ESM and CommonJS builds expose the same editor factories', () => {
  for (const name of [
    'createAntdSelectEditorPlugin',
    'createAntdDatePickerEditorPlugin',
    'createAntdColorPickerEditorPlugin',
    'createAntdCascaderEditorPlugin',
    'createAntdTimePickerEditorPlugin',
    'createAntdTreeSelectEditorPlugin',
  ]) {
    assert.equal(typeof editors[name], 'function');
    assert.equal(typeof cjsEditors[name], 'function');
  }
});

const factories = [
  ['select', () => editors.createAntdSelectEditorPlugin({ id: 'select', ariaLabel: 'Select', options: [{ value: 'a', label: 'A' }] })],
  ['date', () => editors.createAntdDatePickerEditorPlugin({ id: 'date', ariaLabel: 'Date' })],
  ['color', () => editors.createAntdColorPickerEditorPlugin({ id: 'color', ariaLabel: 'Color' })],
  ['cascader', () => editors.createAntdCascaderEditorPlugin({ id: 'cascader', ariaLabel: 'Cascader', options: [{ value: 'a', label: 'A' }] })],
  ['time', () => editors.createAntdTimePickerEditorPlugin({ id: 'time', ariaLabel: 'Time' })],
  ['tree', () => editors.createAntdTreeSelectEditorPlugin({ id: 'tree', ariaLabel: 'Tree', treeData: [{ value: 'a', title: 'A' }] })],
];

test('all Ant Design editor factories return BeautifulGrid plugin configs', () => {
  for (const [id, create] of factories) {
    const plugin = create();
    assert.equal(plugin.id, id);
    assert.equal(plugin.type, 'plugin');
    assert.equal(typeof plugin.component, 'function');
  }
});

test('cascader clipboard helpers preserve string paths and reject invalid input', () => {
  assert.equal(editors.formatCascaderClipboardText(['catalog', 'hardware']), '["catalog","hardware"]');
  assert.equal(editors.formatCascaderClipboardText(['valid', 1]), '');
  assert.deepEqual(editors.parseCascaderClipboardText('["catalog","hardware"]'), ['catalog', 'hardware']);
  assert.throws(() => editors.parseCascaderClipboardText('[]'), /non-empty JSON string array/);
  assert.throws(() => editors.parseCascaderClipboardText('[1]'), /non-empty JSON string array/);
});
