/* ===============================================================
// TESTING ThemeJs v2.0
// ============================================================ */
(() => {
  const
    now = () => new Date().getMilliseconds(),
    GREY = 'color:#888888;',
    RED = 'color:#e22200;',
    GREEN = 'color:#008800;',
    ORANGE = 'color:#916900;',
    PURPLE = 'color:#9f40a9;',
    BROWN = 'color:#a52a2a;',
    W = window,
    D = document,
    { log, clear } = console,
    out = (v, style) => {
      var e = D.createElement('span');
      e.append(v);
      style && e.setAttribute('style', style);
      jsout.append(e, `\n`);
    },
    note = (v, style) => { out(v, style); log('%c' + v, style); },
    test = (what, label) => {
      what ? note(label + ': ☑', GREEN) : note(label + ': ☒', RED);
      return what;
    },
    eid = e => D.getElementById(e),
    hid = (id,html) => eid(id).innerHTML+=html,
    storage = localStorage,
    jso = eid('jso'),
    jsout = eid('jsout'),
    jstest = eid('jstest'),
    element = eid('element'),
    hr = () => { jsout.append(D.createElement('hr')); },
    roll = () => { jso.scrollTo(0, jso.scrollHeight); },
    doc = D.documentElement || D.body, // html or body
    KEY = 'cuba',
    TC = 'theme',
    TL = 'themes',
    reset = () => {
      clear();
      jsout.innerHTML = '';
      out('Console was cleared', GREY + 'font-style:italic;font-size:.75rem');
      hr();
    },
    storeCheck = () => {
      out(`storage[${storage.length}]: ` + JSON.stringify(storage, null, 2));
      hr(); roll();
    },
    storeClear = () => {
      storage.clear();
      storeCheck();
    },
    run = () => {
      storeCheck();
    };

  // ================================================ add listener

  W.onerror = (event) => {
    jstest && (
      jstest.setAttribute('style', RED),
      jstest.innerHTML = '[JS:ER]'
    );
    out(event.toString(), RED); roll();
  };

  // ==================================================== finished

  W.test = {
    reset,
    storeCheck,
    storeClear,
    run,
    // run_check,
    // run_reset,
    // run_set,
    // run_change,
    // run_updateClass,
  };

  W.onload = run;

})();