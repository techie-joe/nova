/*! ThemeJs | v2.0.1 | Copyright 2025 - Techie Joe | https://themejs.pages.dev */
/* ===============================================================
// To include the above copyright tag in the  output:
// 1. Set tsconfig.json > removeComments to false.
// 2. The *! tag must be on the first line.
// 3. Avoid using the tag to pass Envato Check.
/* ===============================================================
// IMPORTANT: must compile to ES5 or above.
// TARGET: compile to ES6.
// ECMAScript 5 (ES5) aka ECMAScript 2009,
// - See tsconfig.json > compilerOptions.target = 'ES5';
// - "use strict", Array.isArray, JSON, get and set keywords,
// - Date.now(), String.trim(), Number.
// ECMAScript 6 (ES6), also known as ECMAScript 2015.
// - Template literals and regex.
// - Embedded expression and backticks `${v}`.
// - Rest and Spread Operators: fn(...args).
// - Destructuring Assignment: { var } = obj, [a,b] = [b,a].
// - Classes: Introduces class syntax for constructors.
// - Modules: support for using import and export statements.
// - Promises: new Promise().
// ============================================================ */
"use strict";
interface Window { theme: {} }
(() => {
  const
    ALLOWED_LIST = [
      'localhost',
      'techie-joe.github.io',
      'themejs.pages.dev',
    ],
    TYPE = (a: any) => Object.prototype.toString.call(a),
    A = (a: any) => typeof a,
    isSTR = (a: any) => A(a) === A(''),
    isARR = Array.isArray ? ((a: any) => Array.isArray(a)) : ((a: any) => TYPE(a) === TYPE([])),
    w = window,
    d = document,
    doc = d.documentElement || d.body, // html or body
    loc = location,
    host = loc.host,
    { log } = console,
    storage = localStorage,
    listenTo = <K extends keyof HTMLElementEventMap>(
      what: HTMLElement | MediaQueryList | Window | Document,
      type: K,
      listener: (e: any) => any,
      options?: boolean | AddEventListenerOptions
    ): void => { what.addEventListener(type, listener, options) },
    nodeId = (id: string) => d.getElementById(id),
    setAttribute = (e: HTMLElement, attr: string, value: string) => { e.setAttribute(attr, value) },
    getTokens = (s: string | null | undefined) => new Set((s || '').split(/\s+/).filter(Boolean)),
    updateClass = (e: HTMLElement, rem?: string | null, add?: string | null) => {
      for (const cls of getTokens(rem)) e.classList.remove(cls);
      for (const cls of getTokens(add)) e.classList.add(cls);
      // console.log([
      //   `old = "${old}"`,
      //   `rem = "${rem}"`,
      //   `add = "${add}"`,
      //   `REM = "${[...REM]}"`,
      //   `ADD = "${[...ADD]}"`,
      //   `new = "${e.className}"`,
      // ].join("\n"));
    },
    scheme = (() => {
      const
        COLOR_SCHEME = 'color-scheme',
        e: HTMLElement = (() => {
          var e = nodeId('_color_scheme');
          if (!e) {
            var a = d.getElementsByName(COLOR_SCHEME);
            if (isARR(a)) { e = a[a.length - 1]; }
          }
          if (!e) {
            e = d.createElement('meta');
            var t = [['name', COLOR_SCHEME]];
            for (var i in t) { setAttribute(e, t[i][0], t[i][1]) }
            d.head && d.head.appendChild(e);
          }
          return e;
        })(),
        set = (v: string) => { setAttribute(e, 'content', v) },
        sync = (v: string | undefined | null) => {
          (v && isSTR(v) && v.substring(0, 2) === '_d') ? set('dark') : set('light');
        };
      return { set, sync }
    })(),
    ALLOWED = ALLOWED_LIST.find(e => host.endsWith(e));
  if (!ALLOWED) { return }

  log('Initializing ThemeJS ..');

  const
    _ = '',
    DARK_THEME = '_dark',
    DEFAULT_LIST = ['', DARK_THEME],
    THEME_KEY = 'theme', // storage key to store current theme
    LIST_KEY = 'themes', // storage key to store current list
    MEDIA = w.matchMedia('(prefers-color-scheme: dark)'),
    DARK_MEDIA = MEDIA.matches,
    parseList = (stored_list: string | null): string[] | undefined => {
      try { return JSON.parse(stored_list || '[]') } catch (e) { console.error('Fail to parse stored themes: ' + stored_list); return []; }
    },
    list: any[] = parseList(storage.getItem(LIST_KEY)) || DEFAULT_LIST;

  let current: string | null | undefined = (() => {
    var stored = storage.getItem(THEME_KEY);
    return (stored && isSTR(stored)) ? stored : DARK_MEDIA ? DARK_THEME : null;
  })();

  const
    set = (new_theme?: string | string[], begin?: string) => {
      // set & store current theme and list
      var old_theme = current || _;
      if (isARR(new_theme)) {
        Object.assign(list, new_theme);
        storage.setItem(LIST_KEY, JSON.stringify(list));
        current = list[isSTR(begin) ? list.indexOf(begin || _) : 0];
      }
      if (typeof new_theme === 'string') { current = new_theme; }
      else { current = _; }
      updateClass(doc, old_theme, current);
      scheme.sync(current);
      storage.setItem(THEME_KEY, current || _);
    },
    reset = () => {
      Object.assign(list, DEFAULT_LIST);
      var old_theme = current || _;
      current = DARK_MEDIA ? DARK_THEME : _;
      updateClass(doc, old_theme, current);
      scheme.sync(current);
      storage.removeItem(THEME_KEY);
      storage.removeItem(LIST_KEY);
    },
    change = () => {
      set(list[list.indexOf(current || _) + 1] || _)
    };

  // sync with DOM
  d.addEventListener('DOMContentLoaded', () => {
    scheme.sync(current);
  });

  // open to changes
  listenTo(MEDIA, 'change', () => { set(DARK_MEDIA ? DARK_THEME : _) });
  listenTo(w, 'keyup', e => { if (e.altKey && e.code === 'KeyT') change(); });

  // export
  w.theme = Object.assign(w.theme || {}, {
    reset,
    set,
    change,
    list: () => list,
    current: () => current,
    updateClass,
  });

  log('ThemeJS loaded.');

})();