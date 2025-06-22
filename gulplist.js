const
  _dest = {
    pages: 'site',
    css: 'site/css',
    scripts: 'site/js',
  },
  buildList = {
    _pug: 'src/pug',
    pug: [
      'core',
      'index',
      'basics',
      'lab',
    ],
    _scss: 'src/scss',
    scss: [
      'core'
    ],
  },
  watchList = buildList;

// map source lists
[buildList, watchList].forEach(list => {
  ['html', 'php', 'txt', 'md'].forEach(type => {
    list[type] = list.pug.map(item => `${list._pug}/${item}/**/*.${type}.pug`);
  });
  list['css'] = list.scss.map(item => `${list._scss}/${item}/**/*.scss`);
});

module.exports = { buildList, watchList, _dest };