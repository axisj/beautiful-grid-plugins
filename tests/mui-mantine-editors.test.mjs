import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const integrations = [
  {
    name: 'MUI',
    prefix: 'Mui',
    esm: await import('../packages/mui/dist/index.js'),
    cjs: require('../packages/mui/dist/index.cjs'),
    factories: [
      ['createMuiSelectEditorPlugin', () => ({ id: 'select', ariaLabel: 'Select', options: [{ value: 'a', label: 'A' }] })],
      ['createMuiDatePickerEditorPlugin', () => ({ id: 'date', ariaLabel: 'Date' })],
      ['createMuiColorPickerEditorPlugin', () => ({ id: 'color', ariaLabel: 'Color' })],
      ['createMuiTimePickerEditorPlugin', () => ({ id: 'time', ariaLabel: 'Time' })],
    ],
  },
  {
    name: 'Mantine',
    prefix: 'Mantine',
    esm: await import('../packages/mantine/dist/index.js'),
    cjs: require('../packages/mantine/dist/index.cjs'),
    factories: [
      ['createMantineSelectEditorPlugin', () => ({ id: 'select', ariaLabel: 'Select', options: [{ value: 'a', label: 'A' }] })],
      ['createMantineDatePickerEditorPlugin', () => ({ id: 'date', ariaLabel: 'Date' })],
      ['createMantineColorPickerEditorPlugin', () => ({ id: 'color', ariaLabel: 'Color' })],
      ['createMantineTimePickerEditorPlugin', () => ({ id: 'time', ariaLabel: 'Time' })],
    ],
  },
];

for (const integration of integrations) {
  test(`${integration.name} ESM and CommonJS builds expose the four supported editor factories`, () => {
    for (const [factoryName] of integration.factories) {
      assert.equal(typeof integration.esm[factoryName], 'function');
      assert.equal(typeof integration.cjs[factoryName], 'function');
    }
  });

  test(`${integration.name} factories return BeautifulGrid plugin configs`, () => {
    for (const [factoryName, createOptions] of integration.factories) {
      const plugin = integration.esm[factoryName](createOptions());
      assert.equal(plugin.id, createOptions().id);
      assert.equal(plugin.type, 'plugin');
      assert.equal(typeof plugin.component, 'function');
    }
  });

  test(`${integration.name} excludes Cascader and TreeSelect APIs`, () => {
    for (const module of [integration.esm, integration.cjs]) {
      assert.equal(module[`create${integration.prefix}CascaderEditorPlugin`], undefined);
      assert.equal(module[`create${integration.prefix}TreeSelectEditorPlugin`], undefined);
    }
  });
}
