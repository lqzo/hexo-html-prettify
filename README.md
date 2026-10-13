# hexo-html-prettify

Maintained fork of [sergeyzwezdin/hexo-html-prettify](https://github.com/sergeyzwezdin/hexo-html-prettify). Formats rendered HTML with [js-beautify](https://github.com/beautifier/js-beautify).

## Requirements

- Node.js 22.22.2+, 24.15.0+, or 26+. Node.js 24.21.0 LTS is selected by `.nvmrc`.
- Hexo 6.3, 7.x or 8.x.

Version 2 upgrades to js-beautify 2 and Picomatch 4, drops the old Node.js and Hexo 4/5 support, and fixes partial option overrides. Output can differ from version 1 as the formatter has changed.

## Install this fork

From a blog checkout next to this repository:

```sh
npm install --save-dev ../hexo-html-prettify
```

Hexo loads the plugin automatically. This local installation uses this fork without requiring an npm release.

## Configuration

Set `html_prettify` in the blog's `_config.yml`:

```yaml
html_prettify:
  enable: true
  priority: 10
  exclude:
    - "**/drafts/**"
  options:
    indent_size: 2
    indent_char: " "
    preserve_newlines: false
    end_with_newline: true
    wrap_line_length: 0
```

| Key | Default | Behavior |
| --- | --- | --- |
| `enable` | `true` | Enable the filter. `html_prettify: false` also disables it. |
| `priority` | `10` | Hexo filter priority; lower numbers run first. |
| `exclude` | `[]` | Picomatch glob patterns matched against the path supplied by Hexo. Windows separators are normalized to `/`. |
| `options` | Plugin defaults | Passed to js-beautify. Partial overrides retain the remaining plugin defaults. |

For generated theme pages, Hexo supplies an output path such as `drafts/index.html`. Common glob patterns such as `*`, `**` and brace alternatives are supported. Check advanced patterns when migrating from Micromatch.

Default formatting uses four spaces, no preserved blank lines, an expanded brace style, no line-length limit and a final newline. Code inside `<pre>` and `<textarea>` retains its whitespace. Missing render metadata is supported.

All formatter settings are documented in [js-beautify's README](https://github.com/beautifier/js-beautify#options).

## Development

```sh
nvm install
nvm use
npm ci
npm test
```

Tests cover configuration, exclusions, missing metadata, code whitespace and real Hexo/EJS generation. CI tests Node.js 22 and 24 with Hexo 6.3.0, 7.3.0 and 8.1.2.

## Releases

Branch pushes and pull requests run tests. Publishing runs only for a pushed `v*` tag after the test matrix passes, and the tag must match `package.json` (for example, `v2.0.0`). The repository's `NPM_AUTH_TOKEN` secret must have permission to publish the package.

## License

MIT. Original implementation by Sergey Zwezdin; see [LICENSE](LICENSE).
