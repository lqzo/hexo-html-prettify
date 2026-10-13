'use strict';

const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { createRequire } = require('node:module');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const entry = path.join(__dirname, '..', 'index.js');
const source = readFileSync(entry, 'utf8');

function loadPlugin(config) {
    const registrations = [];
    const hexo = {
        config: { html_prettify: config },
        extend: { filter: { register: (...args) => registrations.push(args) } }
    };
    vm.runInNewContext(source, { hexo, require: createRequire(entry) }, { filename: entry });
    return { hexo, registrations, filter: registrations[0]?.[1] };
}

test('partial options retain plugin defaults and use the configured priority', () => {
    const { filter, registrations } = loadPlugin({ priority: 20, options: { indent_size: 2 } });
    const output = filter('<html><body><div><p>Hello</p></div></body></html>');
    assert.equal(registrations[0][0], 'after_render:html');
    assert.equal(registrations[0][2], 20);
    assert.match(output, /\n  <div>/);
    assert.ok(output.endsWith('\n'));
});

test('disabled configurations do not register a filter', () => {
    for (const config of [false, { enable: false }]) {
        assert.equal(loadPlugin(config).registrations.length, 0);
    }
});

test('exclusion patterns match POSIX and Windows paths', () => {
    const { filter } = loadPlugin({ exclude: ['**/{drafts,fixtures}/**'] });
    const input = '<div><p>Leave this unchanged</p></div>';
    assert.equal(filter(input, { path: 'source/drafts/example.html' }), input);
    assert.equal(filter(input, { path: 'source\\fixtures\\example.html' }), input);
    assert.notEqual(filter(input, { path: 'source/posts/example.html' }), input);
});

test('missing render metadata, empty input and non-string input are safe', () => {
    const { filter } = loadPlugin();
    assert.match(filter('<div><p>Hello</p></div>', null), /\n/);
    assert.equal(filter(''), '');
    assert.equal(filter(undefined), undefined);
});

test('code and textarea whitespace survives HTML formatting', () => {
    const { filter } = loadPlugin();
    const code = '  first line\n    second line\n';
    const textarea = '  user input\n\n';
    const input = `<div><pre>${code}</pre><textarea>${textarea}</textarea></div>`;
    const output = filter(input);
    assert.ok(output.includes(`<pre>${code}</pre>`));
    assert.ok(output.includes(`<textarea>${textarea}</textarea>`));
    assert.equal(filter(output), output);
});
