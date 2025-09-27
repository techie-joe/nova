const
  build = {
    now: [
      'basic',
      'lab'
    ],
    all: [
      'basic',
      'core',
      'index',
      'lab',
      't-starter',
      't-one',
      'themejs',
    ]
  },
  buildNow = build.now;
const
  copyList = {
    files:[
      'index'
    ].map(item => `src/files/${item}/**/*`)
  },
  buildList = (() => {
    const o = {};
    const _scss = item => `src/scss/${item}/**/*.scss`;
    o.scss = [
      'core',
    ].map(_scss);
    o.scss_dev = [
      'dev',
    ].map(_scss);
    ['html', 'php', 'txt', 'md'].forEach(type => {
      o[type] = buildNow.map(item => `src/pug/${item}/**/*.${type}.pug`);
    });
    return o;
  })(),
  watchList = buildList,
  publishList = {
    pages:   'site',
    scripts: 'site/js',
    css:     'site/css',
    dev_css: 'src/scss/dev_css',
  };
module.exports = { copyList, buildList, watchList, publishList };