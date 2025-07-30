const
  destination = {
    pages: 'site',
    css: 'site/css',
    scripts: 'site/js',
    css_dev: 'src/scss/dev_css',
  },
  build = {
    _pug: 'src/pug',
    pug: [
      'core',
      'index',
      'starter',
      'basic',
      'lab',
      'template',
      'themejs',
    ],
    _scss: 'src/scss',
    scss: [
      'core'
    ],
    scss_dev: [
      'dev'
    ],
  },
  copy = {
    _files: 'src/files',
    files: [
      'index'
    ]
  };

const
  copyList = {},
  buildList = {},
  watchList = {};

// map source lists
[buildList, watchList].forEach(list => {
  ['html', 'php', 'txt', 'md'].forEach(type => {
    list[type] = build.pug.map(item => `${build._pug}/${item}/**/*.${type}.pug`);
  });
  list.scss = build.scss.map(item => `${build._scss}/${item}/**/*.scss`);
  list.scss_dev = build.scss_dev.map(item => `${build._scss}/${item}/**/*.scss`);
});
[copyList].forEach(list => {
  list.files = copy.files.map(item => `${copy._files}/${item}/**/*`);
});

module.exports = { buildList, watchList, copyList, destination };