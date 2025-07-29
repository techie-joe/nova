const
  destination = {
    pages: 'site',
    css: 'site/css',
    scripts: 'site/js',
    dev_css: 'src/scss',
  },
  copy = {
    _files: 'src/files',
    files: [
      'index'
    ]
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
    dev_scss: ['src/scss/dev'],
  };

const
  copyList = copy,
  buildList = build,
  watchList = build;

// map source lists
[buildList, watchList].forEach(list => {
  ['html', 'php', 'txt', 'md'].forEach(type => {
    list[type] = list.pug.map(item => `${list._pug}/${item}/**/*.${type}.pug`);
  });
  list['css'] = list.scss.map(item => `${list._scss}/${item}/**/*.scss`);
});
[copyList].forEach(list => {
  list.files = list.files.map(item => `${list._files}/${item}/**/*`);
});

module.exports = { buildList, watchList, copyList, destination };