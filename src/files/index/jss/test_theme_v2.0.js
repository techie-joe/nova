/* ===============================================================
// TESTING ThemeJs v2.0
// ============================================================ */
(() => {
  let test = '';
  const
    w = window,
    d = document,
    doc = d.documentElement || d.body, // html or body
    eid = e => d.getElementById(e),
    hid = (id,html) => eid(id).innerHTML+=html,
    jstest = eid('jstest'),
    sec = eid('sec'),
    pre = eid('pre'),
    pre_text = pre.innerHTML,
    element = eid('element'),
    storage = localStorage,
    { log } = console,
    now = () => new Date().getMilliseconds(),
    assign = (target, obj) => Object.assign(target = target || {},obj),
    KEY = 'cuba',
    TC = 'theme',
    TL = 'themes',
    GREY = 'color:#888888;',
    RED = 'color:#e22200;',
    GREEN = 'color:#008800;',
    ORANGE = 'color:#916900;',
    PURPLE = 'color:#9f40a9;',
    BROWN = 'color:#a52a2a;',
    hr = () => { pre.append(d.createElement('hr')); },
    out = (v, style) => {
      var e = d.createElement('div');
      style && e.setAttribute('style', style);
      e.append(v);
      pre.append(e);
    },
    note = (v, style) => { out(v, style); log('%c' + v, style); },
    tes = (what, label) => { what ? note(label + ': ☑', GREEN) : note(label + ': ☒', RED); },
    scroll = () => { sec.scrollTo(0, sec.scrollHeight); },
    reset = () => {
      console.clear();
      test = '';
      pre.innerHTML = pre_text;
      out('Console was cleared', GREY + 'font-style:italic;font-size:.75rem');
      hr();
    },
    storeCheck = () => {
      out(`storage[${storage.length}]: ` + JSON.stringify(storage, null, 2));
      hr();
      scroll();
    },
    storeClear = () => {
      storage.clear();
      storeCheck();
    },
    run = () => {
      storeCheck();
    };

  // ================================================ add listener

  w.onerror = (event) => {
    jstest && (
      jstest.setAttribute('style', RED),
      jstest.innerHTML = '[JS:ER]'
    );
    out(event.toString(), RED);
    scroll();
  };

  // ==================================================== finished

  assign(w.test, {
    run,
    storeCheck,
    storeClear,
    reset,
    // run_check,
    // run_reset,
    // run_set,
    // run_change,
    // run_updateClass,
  });

  w.onload = run;

})();