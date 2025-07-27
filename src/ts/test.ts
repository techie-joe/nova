"use strict";
interface Window { _host: string | null | undefined, test: {} }
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
    parse = (v: string) => {
      if (!isSTR(v)) { return }
      try { return JSON.parse(v) } catch { }
    },
    reset = () => {
    };

  // log(list);
  // log(current);

  // sync with DOM
  d.addEventListener('DOMContentLoaded', () => {
  });

  // export
  w.test = assign(w.test, {
  });

})();
