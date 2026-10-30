// Disposable desktop journey, including keyboard confirmation and focus restoration.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { launch } = require('./electron-harness.cjs');
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
async function main() {
  const { evaluate, until, key, close } = await launch({ env, profile: path.join(temp, 'profile') });
  try {
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

    fs.renameSync(repo, `${repo}-moved`);
    await until("[...document.querySelectorAll('button')].some(e => e.textContent === 'Scan project' && !e.disabled)");
    await evaluate("[...document.querySelectorAll('button')].find(e => e.textContent === 'Scan project').focus()");
    await key('Enter');
    await until("!!document.querySelector('[role=dialog]')");
    await evaluate("[...document.querySelector('[role=dialog]').querySelectorAll('button')].find(e => e.textContent === 'Run scan').focus()");
    await key('Enter');
    await until("document.body.textContent.includes('Scan failed')");
    assert.equal(await evaluate("document.body.textContent.includes('MISSING')"), true);
    console.log(`isolated Electron keyboard and scan journey passed; fixture: ${temp}`);
  } finally {
    close();
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
