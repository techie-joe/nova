"use strict";
(() => {
    const _ = '', w = window, { log, error } = console, ALLOWED = atob(w._host || _).split(',');
    if (ALLOWED.indexOf(w.location.host) < 0) {
        return;
    }
    const d = document, doc = d.documentElement || d.body, darkMedia = w.matchMedia('(prefers-color-scheme: dark)'), storage = localStorage, TYPE = (a) => Object.prototype.toString.call(a), A = (a) => typeof a, isSTR = (a) => A(a) === A(''), isARR = Array.isArray ? ((a) => Array.isArray(a)) : ((a) => TYPE(a) === TYPE([])), nodeId = (id) => d.getElementById(id), nodeAttribute = (e, attr, value) => { e.setAttribute(attr, value); }, getTokens = (s) => new Set((s || '').split(/\s+/).filter(Boolean)), updateClass = (e, rem, add) => {
        for (const cls of getTokens(rem))
            e.classList.remove(cls);
        for (const cls of getTokens(add))
            e.classList.add(cls);
    }, listenTo = (what, type, listener, options) => { what.addEventListener(type, listener, options); }, assign = (target, obj) => Object.assign(target || {}, obj), parse = (v) => {
        if (!isSTR(v)) {
            return;
        }
        try {
            return JSON.parse(v);
        }
        catch (_a) { }
    }, reset = () => {
    };
    d.addEventListener('DOMContentLoaded', () => {
    });
    w.test = assign(w.test, {});
})();
