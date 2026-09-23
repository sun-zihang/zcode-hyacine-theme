// Probe the wallpaper <video> element inside ZCode via CDP
const list = await fetch('http://127.0.0.1:9222/json/list').then(r => r.json());
const target = list.find(t => t.type === 'page' && /renderer\/index\.html/.test(t.url));
if (!target) { console.log('NO RENDERER TARGET'); process.exit(1); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
function call(method, params) {
  return new Promise((resolve, reject) => {
    const msgId = ++id;
    pending.set(msgId, { resolve, reject });
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
  }
};
await new Promise(r => { ws.onopen = r; });

const expr = `(() => {
  const v = document.querySelector('video');
  if (!v) return { hasVideo: false };
  return {
    hasVideo: true,
    src: (v.currentSrc || v.src || '').slice(0, 120),
    videoWidth: v.videoWidth, videoHeight: v.videoHeight,
    paused: v.paused, readyState: v.readyState,
    t1: v.currentTime, duration: v.duration,
    loop: v.loop, muted: v.muted, error: v.error ? String(v.error.code) : null,
    style: (v.getAttribute('style') || '').slice(0, 100)
  };
})()`;
const r1 = await call('Runtime.evaluate', { expression: expr, returnByValue: true });
console.log('STATE1:', JSON.stringify(r1.result.value));

await new Promise(r => setTimeout(r, 2000));

const r2 = await call('Runtime.evaluate', { expression: expr, returnByValue: true });
console.log('STATE2:', JSON.stringify(r2.result.value));
const a = r1.result.value, b = r2.result.value;
if (a.hasVideo && b.hasVideo) {
  console.log('MOVING:', b.t1 > a.t1 ? 'YES (currentTime advanced)' : 'NO (frozen at same time)');
}
ws.close();
process.exit(0);
