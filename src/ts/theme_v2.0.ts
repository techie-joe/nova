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
interface Window { _host: string | null | undefined, theme: {} }
(() => {

  // console.log(`_host: ${window._host}`);

  const
    _ = '',
    w = window,
    { log, error } = console,
    ALLOWED = atob(w._host || _).split(',');
  if (ALLOWED.indexOf(w.location.host) < 0) { return }

  // console.log(`ALLOWED: ${ALLOWED}`);

  const
    d = document,
    doc = d.documentElement || d.body, // html or body
    darkMedia = w.matchMedia('(prefers-color-scheme: dark)'),
    storage = localStorage,
    TYPE = (a: any) => Object.prototype.toString.call(a),
    A = (a: any) => typeof a,
    isSTR = (a: any) => A(a) === A(''),
    isARR = Array.isArray ? ((a: any) => Array.isArray(a)) : ((a: any) => TYPE(a) === TYPE([])),
    nodeId = (id: string) => d.getElementById(id),
    nodeAttribute = (e: HTMLElement, attr: string, value: string) => { e.setAttribute(attr, value) },
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
    listenTo = <K extends keyof HTMLElementEventMap>(
      what: HTMLElement | MediaQueryList | Window | Document,
      type: K,
      listener: (e: any) => any,
      options?: boolean | AddEventListenerOptions
    ): void => { what.addEventListener(type, listener, options) },
    assign = (target: object, obj: object) => Object.assign(target || {}, obj),
    THEME_KEY = 'theme', // storage key to store current theme
    LIST_KEY = 'themes', // storage key to store current list
    DARK_THEME = '_dark',
    DEFAULT_LIST = [_, DARK_THEME],
    parse = (v: string) => {
      if (!isSTR(v)) { return }
      try { return JSON.parse(v) } catch { }
    },
    getList = () => {
      var stored = storage.getItem(LIST_KEY);
      return isSTR(stored) ? parse(stored || _) || DEFAULT_LIST : DEFAULT_LIST;
    },
    getTheme = () => {
      var stored = storage.getItem(THEME_KEY);
      return isSTR(stored) ? stored || _ : darkMedia.matches ? DARK_THEME : _;
    };

  let
    list: string[] = getList(),
    current: string = getTheme();

  const
    scheme = (() => {
      const
        COLOR_SCHEME = 'color-scheme',
        e: HTMLElement = (() => {
          var e = nodeId('_color_scheme');
          if (!e) { // find existing element
            var a = d.getElementsByName(COLOR_SCHEME);
            e = a[a.length - 1];
          }
          if (!e) { // create new element
            e = d.createElement('meta');
            nodeAttribute(e, 'name', COLOR_SCHEME);
            d.head && d.head.appendChild(e);
          }
          return e;
        })(),
        set = (v: string) => { nodeAttribute(e, 'content', v) },
        sync = (v: string | undefined | null) => {
          set((v && isSTR(v) && v.startsWith(DARK_THEME)) ? 'dark' : 'light');
        };
      return { set, sync }
    })(),
    set = (v?: string | string[], beginWith?: string) => {
      // set & store current theme and list
      var oldTheme = current;
      if (isSTR(v)) { current = v as string; }
      else if (isARR(v)) {
        list = v as string[];
        storage.setItem(LIST_KEY, JSON.stringify(list));
        current = list[(beginWith && isSTR(beginWith)) ? list.indexOf(beginWith) : 0] || _;
      }
      if (oldTheme != current) {
        updateClass(doc, oldTheme, current);
        scheme.sync(current);
        storage.setItem(THEME_KEY, current || _);
      }
    },
    change = () => { // swap from one theme to another
      var next = list[list.indexOf(current) + 1];
      set(isSTR(next) ? next : list[0] || _);
    },
    reset = () => {
      list = DEFAULT_LIST;
      var oldTheme = current;
      current = darkMedia.matches ? DARK_THEME : _;
      updateClass(doc, oldTheme, current);
      scheme.sync(current);
      storage.removeItem(THEME_KEY);
      storage.removeItem(LIST_KEY);
    };

  // log(list);
  // log(current);

  // sync with DOM
  d.addEventListener('DOMContentLoaded', () => {
    updateClass(doc, null, current);
    scheme.sync(current);
  });

  // sync with bf/cache navigation
  w.addEventListener('pageshow', (event) => {
    if (event.persisted) { // Page was restored from bf/cache
      var oldTheme = current;
      list = getList();
      current = getTheme();
      updateClass(doc, oldTheme, current);
      scheme.sync(current);
    }
  });

  // listen to changes
  listenTo(w, 'keyup', e => { if (e.altKey && e.code === 'KeyT') change(); });

  // export
  w.theme = assign(w.theme, {
    reset,
    set,
    change,
    updateClass,
    list: () => list,
    current: () => current,
  });

})();