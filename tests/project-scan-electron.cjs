// Disposable desktop journey, including keyboard confirmation and focus restoration.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawn } = require('node:child_process');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'vyasa-ui-journey-'));
const home = path.join(temp, 'data');
const root = path.join(temp, 'workspace');
const repo = path.join(root, 'selected');
fs.mkdirSync(home, { recursive: true });
fs.mkdirSync(path.join(repo, '.git'), { recursive: true });
fs.writeFileSync(path.join(repo, '.git', 'HEAD'), 'ref: refs/heads/main\n');
fs.writeFileSync(path.join(repo, 'README.md'), 'isolated fixture');
fs.writeFileSync(path.join(home, 'config.toml'), `[workspace]\nroots = ["${root.replaceAll('\\', '/')}"]\n`);
const binary = 'E:\\Python\\Vyasa\\venv\\Scripts\\vyasa.exe';
const env = { ...process.env, VYASA_HOME: home, VYASA_CLI_PATH: binary };
execFileSync(binary, ['scan'], { env });
const port = 19000 + Math.floor(Math.random() * 1000);
const electron = spawn(path.resolve('node_modules/electron/dist/electron.exe'), [`--remote-debugging-port=${port}`, `--user-data-dir=${path.join(temp, 'profile')}`, '.'], { cwd: process.cwd(), env, windowsHide: true, stdio: 'ignore' });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function main() {
  let target;
  for (let i = 0; i < 100 && !target; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch {}
    if (!target) await sleep(200);
  }
  assert.ok(target, 'Electron renderer debugging target available');
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let next = 0; const pending = new Map();
  socket.onmessage = ({ data }) => { const msg = JSON.parse(data); if (msg.id && pending.has(msg.id)) { const [resolve, reject] = pending.get(msg.id); pending.delete(msg.id); msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result); } };
  const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++next; pending.set(id, [resolve, reject]); socket.send(JSON.stringify({ id, method, params })); });
  await send('Page.bringToFront');
  await send('Emulation.setFocusEmulationEnabled', { enabled: true });
  const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true })).result.value;
  const until = async (expression) => { for (let i = 0; i < 100; i++) { if (await evaluate(expression)) return; await sleep(200); } throw new Error(`Timed out: ${expression}`); };
  // Native buttons activate on Enter only when the key event carries text; div role=button does not need it.
  const key = async (name) => {
    const base = { key: name, code: name, windowsVirtualKeyCode: name === 'Enter' ? 13 : name === 'Escape' ? 27 : 9 };
    await send('Input.dispatchKeyEvent', { type: 'keyDown', ...base, ...(name === 'Enter' ? { text: '\r', unmodifiedText: '\r' } : {}) });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
  };
  await until("[...document.querySelectorAll('[role=button]')].some(e => e.textContent.includes('selected'))");
  await evaluate("[...document.querySelectorAll('[role=button]')].find(e => e.textContent.includes('selected')).focus()");
  await key('Enter');
  await until("[...document.querySelectorAll('button')].some(e => e.textContent === 'Scan project' && !e.disabled)");
  await evaluate("[...document.querySelectorAll('button')].find(e => e.textContent === 'Scan project').focus()");
  assert.equal(await evaluate("document.activeElement.textContent"), 'Scan project');
  await key('Enter');
  await until("!!document.querySelector('[role=dialog]')");
  assert.equal(await evaluate("document.querySelector('[role=dialog]').getAttribute('aria-labelledby') !== null"), true);
  assert.equal(await evaluate("document.querySelector('[role=dialog]').contains(document.activeElement)"), true);
  await key('Tab');
  assert.equal(await evaluate("document.querySelector('[role=dialog]').contains(document.activeElement)"), true);
  await key('Escape');
  await until("!document.querySelector('[role=dialog]')");
  assert.equal(await evaluate("document.activeElement.textContent === 'Scan project'"), true);
  await key('Enter');
  await until("!!document.querySelector('[role=dialog]')");
  await evaluate("[...document.querySelector('[role=dialog]').querySelectorAll('button')].find(e => e.textContent === 'Run scan').focus()");
  await key('Enter');
  await until("document.body.textContent.includes('Checkout outcomes')");
  assert.equal(await evaluate("document.body.textContent.includes('Scan finished')"), true);
  console.log(`isolated Electron keyboard and scan journey passed; fixture: ${temp}`);
  socket.close();
}
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => electron.kill());
