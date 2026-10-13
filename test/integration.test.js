'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const Hexo = require('hexo');

test('Hexo generates formatted pages and honors page exclusions', async (t) => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'hexo-prettify-integration-'));
    t.after(() => fs.rm(root, { recursive: true, force: true }));

    const pluginRoot = path.resolve(__dirname, '..');
    const rendererRoot = path.dirname(require.resolve('hexo-renderer-ejs/package.json'));
    const layout = path.join(root, 'themes', 'fixture', 'layout');
    await fs.mkdir(layout, { recursive: true });
    await fs.mkdir(path.join(root, 'source'));
    await fs.mkdir(path.join(root, 'node_modules'));
    await fs.symlink(pluginRoot, path.join(root, 'node_modules', 'hexo-html-prettify'), 'junction');
    await fs.symlink(rendererRoot, path.join(root, 'node_modules', 'hexo-renderer-ejs'), 'junction');
    await fs.writeFile(path.join(root, 'package.json'), JSON.stringify({
        name: 'prettify-fixture',
        private: true,
        hexo: { version: require('hexo/package.json').version },
        dependencies: { 'hexo-html-prettify': '*', 'hexo-renderer-ejs': '*' }
    }));
    await fs.writeFile(path.join(root, '_config.yml'), [
        'url: https://example.com',
        'theme: fixture',
        'html_prettify:',
        '  exclude: ["skip/**"]',
        '  options:',
        '    indent_size: 2'
    ].join('\n'));

    const code = '  first\n    second\n';
    const html = `<!doctype html><html><head><title>Fixture</title></head><body><main><h1>Fixture</h1><pre>${code}</pre></main></body></html>`;
    await fs.writeFile(path.join(layout, 'index.ejs'), html);

    const hexo = new Hexo(root, { silent: true });
    try {
        await hexo.init();
        hexo.extend.generator.register('fixture', () => [
            { path: 'index.html', layout: 'index', data: {} },
            { path: 'skip/index.html', layout: 'index', data: {} }
        ]);
        await hexo.call('generate');
        const output = await fs.readFile(path.join(root, 'public', 'index.html'), 'utf8');
        const excluded = await fs.readFile(path.join(root, 'public', 'skip', 'index.html'), 'utf8');
        assert.match(output, /\n\s+<h1>Fixture<\/h1>/);
        assert.ok(output.includes(`<pre>${code}</pre>`));
        assert.ok(excluded.includes('<main><h1>Fixture</h1>'), excluded);
    } finally {
        await hexo.exit();
    }
});
