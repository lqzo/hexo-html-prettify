'use strict';

const defaultOptions = {
    indent_size: 4,
    indent_char: ' ',
    max_preserve_newlines: -1,
    preserve_newlines: false,
    keep_array_indentation: true,
    break_chained_methods: false,
    indent_scripts: 'normal',
    brace_style: 'expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: true,
    end_with_newline: true,
    wrap_line_length: 0,
    indent_inner_html: false,
    comma_first: false,
    e4x: false,
    indent_empty_lines: false
};

module.exports = (config) => {
    const overrides = config === false ? { enable: false } : config || {};

    return {
        enable: true,
        exclude: [],
        priority: 10,
        ...overrides,
        options: { ...defaultOptions, ...overrides.options }
    };
};
