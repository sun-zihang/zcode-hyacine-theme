// Hyacine (风堇 / Hyacinthia) theme for ZCode — "Dusklight Courtyard" 昏光庭院
// Palette: dusk-indigo translucent surfaces / hyacinth-pink brand / wind-teal accent / dusk-gold warning
// Injector: watches CDP for ZCode renderer targets, registers via
// Page.addScriptToEvaluateOnNewDocument (survives reloads) + injects immediately.
// All var declarations use !important to win over the beautify plugin's auto-Monet.

const CSS = `
html.theme-zai-dark {
  --color-background: rgba(46, 36, 86, 0.42) !important;
  --color-brand: #ff7fb8 !important;
  --color-accent: #7fdcd2 !important;
  --color-background-alt: rgba(48, 40, 92, 0.8) !important;
  --color-background-win-alt: rgba(38, 30, 76, 0.8) !important;
  --color-card: rgba(40, 34, 76, 0.88) !important;
  --color-card-border: rgba(140, 126, 195, 0.6) !important;
  --color-card-selected: rgba(64, 54, 112, 0.94) !important;
  --color-border: rgba(140, 126, 195, 0.62) !important;
  --color-border-hover: rgba(162, 148, 215, 0.95) !important;
  --color-border-color-interactive: rgba(140, 126, 195, 0.78) !important;
  --color-border-color-interactive-hover: #a294d8 !important;
  --color-border-color-interactive-active: rgba(255, 150, 200, 0.95) !important;
  --color-input: rgba(62, 52, 108, 0.6) !important;
  --color-input-focused: rgba(62, 52, 108, 0.8) !important;
  --color-input-border: rgba(140, 126, 195, 0.68) !important;
  --color-input-border-focused: rgba(255, 150, 200, 0.95) !important;
  --color-input-border-hover: rgba(172, 158, 225, 0.78) !important;
  --color-foreground: #f3e6f6 !important;
  --color-foreground-subtle: #e4d0ee !important;
  --color-foreground-subtlest: rgba(228, 208, 238, 0.8) !important;
  --color-foreground-inverse: #302a58 !important;
  --divider-color: rgba(150, 136, 205, 0.48) !important;
  --color-header: #251f4a !important;
  --color-toast: #302a58 !important;
  --color-tooltip: #363064 !important;
  --color-tooltip-foreground: #f8f2ff !important;
  --color-tooltip-tag: #403a72 !important;
  --color-tooltip-tag-foreground: #c6bce0 !important;
  --color-find-highlight: #73385c !important;
  --color-find-highlight-active: #6a4478 !important;
  --color-idle-task: #9a78f0 !important;
  --color-idle-task-surface: #1e1448 !important;
  --color-file-node: #5fd8cc38 !important;
  --color-file-node-foreground: #7fd8ce !important;
  --color-file-node-hover: #5fd8cc4a !important;
  --color-command-node: #b4a6e238 !important;
  --color-command-node-foreground: #d2c8ee !important;
  --color-command-node-hover: #b4a6e248 !important;
  --color-interaction-ask-foreground: #82d0ec !important;
  --color-interaction-ask-surface: #083044 !important;
  --color-warning: #f5a94e !important;
  scrollbar-color: rgba(255, 150, 195, 0.45) transparent !important;
}
html.theme-zai-light {
  --color-brand: #e8558a !important;
  --color-accent: #189e94 !important;
  scrollbar-color: rgba(210, 70, 130, 0.45) transparent !important;
}
::selection {
  background: rgba(255, 120, 185, 0.5);
}
`;

const BOOT = `(function(){
  function add(){
    var s = document.getElementById('hyacine-theme');
    if (!s) {
      s = document.createElement('style');
      s.id = 'hyacine-theme';
      (document.documentElement || document.head || document).appendChild(s);
    }
    s.textContent = ${JSON.stringify(CSS)};
  }
  add();
  document.addEventListener('DOMContentLoaded', add);
})();`;

const seen = new Set();

async function injectInto(target) {
  try {
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; setTimeout(() => rej(new Error('ws timeout')), 4000); });
    let id = 0;
    const call = (method, params) => new Promise((resolve) => {
      const msgId = ++id;
      const onMsg = (ev) => {
        const msg = JSON.parse(ev.data);
        if (msg.id === msgId) { ws.removeEventListener('message', onMsg); resolve(msg.result); }
      };
      ws.addEventListener('message', onMsg);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
    await call('Page.enable', {});
    await call('Page.addScriptToEvaluateOnNewDocument', { source: BOOT });
    await call('Runtime.evaluate', { expression: BOOT });
    ws.close();
    return true;
  } catch (e) {
    return false;
  }
}

async function tick() {
  let targets;
  try {
    targets = await fetch('http://127.0.0.1:9222/json/list', { signal: AbortSignal.timeout(2000) }).then(r => r.json());
  } catch { return; } // ZCode not running with CDP; retry later
  for (const t of targets) {
    if (t.type !== 'page' || !/renderer\/index\.html/.test(t.url)) continue;
    if (seen.has(t.id)) continue;
    const ok = await injectInto(t);
    if (ok) { seen.add(t.id); console.log(`[hyacine-theme] injected into target ${t.id}`); }
  }
}

console.log('[hyacine-theme] watcher started (polling 127.0.0.1:9222 every 4s)');
await tick();
setInterval(tick, 4000);
