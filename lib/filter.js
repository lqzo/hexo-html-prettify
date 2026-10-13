'use strict';

const { html } = require('js-beautify');
const picomatch = require('picomatch');

module.exports = (hexo) =>
    function (str, data) {
        if (typeof str !== 'string' || str.length === 0) {
            return str;
        }

        const config = hexo.config.html_prettify;
        const path = typeof data?.path === 'string' ? data.path.replace(/\\/g, '/') : '';

        if (path && config.exclude?.length && picomatch.isMatch(path, config.exclude)) {
            return str;
        }

        return html(str, config.options);
    };
