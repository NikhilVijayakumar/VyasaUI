// Exercises the built app against the installed Vyasa distribution and a disposable index.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { launch, sleep } = require('./electron-harness.cjs');
const deployed = 'E:\\MCP\\Vyasa MCP\\vyasa\\vyasa.exe';
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'vyasa-ui-deployed-'));
const home = path.join(temp, 'data');
const root = path.join(temp, 'workspace');
fs.mkdirSync(home, { recursive: true });
for (const name of ['alpha', 'beta']) {
  const repo = path.join(root, name);
  fs.mkdirSync(path.join(repo, '.git'), { recursive: true });
  fs.writeFileSync(path.join(repo, '.git', 'HEAD'), 'ref: refs/heads/main\n');
  fs.writeFileSync(path.join(repo, 'README.md'), name);
  fs.writeFileSync(path.join(repo, 'package.json'), JSON.stringify({ name }));
}
fs.writeFileSync(path.join(home, 'config.toml'), `[workspace]\nroots = ["${root.replaceAll('\\', '/')}"]\n`);
const env = { ...process.env, VYASA_HOME: home, VYASA_CLI_PATH: deployed };
execFileSync(deployed, ['scan'], { env, timeout: 300_000 });

async function main() {
  const app = await launch({ env, profile: path.join(temp, 'profile') });
  try {
    await app.until("[...document.querySelectorAll('[role=button]')].some(e => e.textContent.includes('alpha'))");
    assert.equal(await app.evaluate("[...document.querySelectorAll('[role=button]')].some(e => e.textContent.includes('beta'))"), true);
    assert.equal(await app.evaluate("document.body.textContent.includes('Vyasa CLI was not found')"), false);

    assert.equal(await app.evaluate("window.electronAPI.invoke('vyasa:unknown').then(() => 'resolved', (error) => error.message)"), 'Unsupported operation');
    assert.equal(await app.evaluate("window.electronAPI.invoke('vyasa:project', '').then(() => 'resolved', (error) => error.message)"), 'Invalid project identifier.');
    assert.equal(await app.evaluate("(() => { try { window.electronAPI.send('vyasa:scan'); return 'sent'; } catch (error) { return error.message; } })()"), 'Unsupported operation');

    await app.evaluate("[...document.querySelectorAll('[role=button]')].find(e => e.textContent.includes('alpha')).click()");
    await app.until("document.querySelector('[aria-label=\"Project details\"] h5')?.textContent === 'alpha'");
    const panel = (await app.evaluate("document.querySelector('[aria-label=\"Project details\"]').textContent"));
    assert.ok(panel.includes('Indexed observations'), 'real checkout observations are shown');
    assert.ok(panel.includes('readme'), 'backend markers are preserved');
    assert.ok(panel.includes('active'), 'project state is preserved');

    assert.equal(await app.evaluate("[...document.querySelectorAll('button')].find(e => e.textContent === 'Scan project').disabled"), true);
    assert.ok(panel.includes('Project-specific scanning is unavailable'), 'installed backend capability gap is explained');

    const tabs = await app.evaluate("document.querySelectorAll('[role=tab]').length");
    assert.equal(tabs, 5);
    await app.evaluate("document.querySelector('[role=tab]').focus()");
    await app.key('ArrowRight');
    assert.equal(await app.evaluate("document.activeElement.textContent"), 'Profile');
    await app.key('Enter');
    await app.until("document.querySelector('[role=tab][aria-selected=true]').textContent === 'Profile'");
    assert.equal(await app.evaluate("document.querySelector('[role=tabpanel]').getAttribute('aria-labelledby')"), 'project-tab-1');
    await app.key('ArrowLeft');
    await app.key('Enter');
    await app.until("document.querySelector('[role=tab][aria-selected=true]').textContent === 'Overview'");

    await app.evaluate("[...document.querySelectorAll('[role=button]')].find(e => e.textContent.includes('beta')).focus()");
    await app.key('Enter');
    await app.until("document.querySelector('[aria-label=\"Project details\"] h5')?.textContent === 'beta'");

    await app.evaluate("[...document.querySelectorAll('[role=button]')].find(e => e.textContent === 'Settings').click()");
    await app.until("document.body.textContent.includes('Backend version')");
    assert.match(await app.evaluate("document.body.textContent"), /\d+\.\d+\.\d+/, 'installed backend version is shown');
    console.log(`installed backend journey passed; fixture: ${temp}`);
  } finally {
    app.close();
  }

  await sleep(500);
  const missing = await launch({ env: { ...process.env, VYASA_HOME: home, VYASA_CLI_PATH: path.join(temp, 'missing', 'vyasa.exe') }, profile: path.join(temp, 'profile-missing') });
  try {
    await missing.until("document.body.textContent.includes('Vyasa CLI was not found')");
    assert.equal(await missing.evaluate("[...document.querySelectorAll('[role=button]')].some(e => e.textContent.includes('alpha'))"), false);
    console.log('unavailable backend state passed');
  } finally {
    missing.close();
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
