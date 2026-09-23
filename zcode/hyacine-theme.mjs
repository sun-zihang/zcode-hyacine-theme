// Hyacine (风堇 / Hyacinthia) theme for ZCode — "Dusklight Courtyard" 昏光庭院
// Palette: dusk-indigo translucent surfaces / hyacinth-pink brand / wind-teal accent / dusk-gold warning
// Injector: watches CDP for ZCode renderer targets, registers via
// Page.addScriptToEvaluateOnNewDocument (survives reloads) + injects immediately.
// All var declarations use !important to win over the beautify plugin's auto-Monet.

const CSS = `
html.theme-zai-dark {
  --color-brand: #ffb1c9 !important;
  --color-accent: #8ed4cf !important;
  --color-background-alt: rgba(38, 36, 56, 0.62) !important;
  --color-background-win-alt: rgba(29, 27, 45, 0.62) !important;
  --color-card: rgba(31, 30, 48, 0.72) !important;
  --color-card-border: rgba(108, 98, 140, 0.5) !important;
  --color-card-selected: rgba(51, 46, 77, 0.87) !important;
  --color-border: rgba(108, 98, 140, 0.55) !important;
  --color-border-hover: rgba(122, 112, 158, 0.9) !important;
  --color-border-color-interactive: rgba(108, 98, 140, 0.7) !important;
  --color-border-color-interactive-hover: #7a7098 !important;
  --color-border-color-interactive-active: rgba(255, 170, 205, 0.9) !important;
  --color-input: rgba(51, 46, 77, 0.5) !important;
  --color-input-focused: rgba(51, 46, 77, 0.7) !important;
  --color-input-border: rgba(108, 98, 140, 0.6) !important;
  --color-input-border-focused: rgba(255, 170, 205, 0.9) !important;
  --color-input-border-hover: rgba(142, 132, 176, 0.7) !important;
  --color-foreground: #ece7f2 !important;
  --color-foreground-subtle: #d9d0e4 !important;
  --color-foreground-subtlest: rgba(217, 208, 228, 0.72) !important;
  --color-foreground-inverse: #322e40 !important;
  --divider-color: rgba(120, 110, 160, 0.4) !important;
  --color-header: #1d1b2e !important;
  --color-toast: #262438 !important;
  --color-tooltip: #2a2740 !important;
  --color-tooltip-foreground: #f4effa !important;
  --color-tooltip-tag: #343150 !important;
  --color-tooltip-tag-foreground: #b0a8c8 !important;
  --color-find-highlight: #63324a !important;
  --color-find-highlight-active: #5b3f5e !important;
  --color-idle-task: #8b6ce8 !important;
  --color-idle-task-surface: #1a1240 !important;
  --color-file-node: #64c8c029 !important;
  --color-file-node-foreground: #7fd4cb !important;
  --color-file-node-hover: #64c8c038 !important;
  --color-command-node: #a89ec824 !important;
  --color-command-node-foreground: #c3bbe0 !important;
  --color-command-node-hover: #a89ec833 !important;
  --color-interaction-ask-foreground: #7cc9e8 !important;
  --color-interaction-ask-surface: #062830 !important;
  --color-warning: #f0a24e !important;
  scrollbar-color: rgba(255, 150, 195, 0.35) transparent !important;
}
html.theme-zai-light {
  --color-brand: #e8648f !important;
  --color-accent: #1f9e96 !important;
}
::selection {
  background: rgba(255, 150, 190, 0.35);
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
