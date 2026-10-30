// Launches the built app with remote debugging and returns small CDP helpers.
const path = require('node:path');
const { spawn } = require('node:child_process');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function launch({ env, profile = path.join(env.VYASA_HOME, 'profile') }) {
  const port = 19000 + Math.floor(Math.random() * 1000);
  const electron = spawn(path.resolve('node_modules/electron/dist/electron.exe'), [`--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '.'], { cwd: process.cwd(), env, windowsHide: true, stdio: 'ignore' });
  let target;
  for (let i = 0; i < 100 && !target; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((item) => item.type === 'page'); } catch { /* renderer not listening yet */ }
    if (!target) await sleep(200);
  }
  if (!target) { electron.kill(); throw new Error('Electron renderer debugging target available'); }
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let next = 0; const pending = new Map();
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.id && pending.has(message.id)) {
      const [resolve, reject] = pending.get(message.id); pending.delete(message.id);
      message.error ? reject(new Error(message.error.message)) : resolve(message.result);
    }
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++next; pending.set(id, [resolve, reject]); socket.send(JSON.stringify({ id, method, params })); });
  await send('Page.bringToFront');
  await send('Emulation.setFocusEmulationEnabled', { enabled: true });
  const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value;
  const until = async (expression) => { for (let i = 0; i < 100; i++) { if (await evaluate(expression)) return; await sleep(200); } throw new Error(`Timed out: ${expression}`); };
  // Native buttons activate on Enter only when the key event carries text; div role=button does not need it.
  const key = async (name) => {
    const base = { key: name, code: name, windowsVirtualKeyCode: { Enter: 13, Escape: 27, Tab: 9, ArrowLeft: 37, ArrowRight: 39 }[name] };
    await send('Input.dispatchKeyEvent', { type: 'keyDown', ...base, ...(name === 'Enter' ? { text: '\r', unmodifiedText: '\r' } : {}) });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
  };
  const close = () => { try { socket.close(); } finally { electron.kill(); } };
  return { evaluate, until, key, close };
}

module.exports = { launch, sleep };
