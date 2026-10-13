'use strict';

hexo.config.html_prettify = require('./lib/config')(hexo.config.html_prettify);

if (hexo.config.html_prettify.enable) {
    hexo.extend.filter.register(
        'after_render:html',
        require('./lib/filter')(hexo),
        hexo.config.html_prettify.priority
    );
}
