// Rapid project switching must never render a previous project's response under the current selection.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { launch } = require('./electron-harness.cjs');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'vyasa-ui-order-'));
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
const binary = 'E:\\Python\\Vyasa\\venv\\Scripts\\vyasa.exe';
const env = { ...process.env, VYASA_HOME: home, VYASA_CLI_PATH: binary };
execFileSync(binary, ['scan'], { env });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const pick = (name) => `[...document.querySelectorAll('[role=button]')].find(e => e.textContent.includes('${name}'))`;

async function main() {
  const app = await launch({ env, profile: path.join(temp, 'profile') });
  try {
    await app.until(`${pick('alpha')} !== undefined && ${pick('beta')} !== undefined`);
    await app.evaluate(`${pick('alpha')}.click()`);
    await app.until("document.querySelector('[aria-label=\"Project details\"] h5')?.textContent === 'alpha'");

    // Sample the rendered pair (selected list item, detail heading) between switches.
    await app.evaluate(`(() => {
      window.__samples = [];
      window.__sampler = setInterval(() => {
        const heading = document.querySelector('[aria-label="Project details"] h5')?.textContent;
        const selected = [...document.querySelectorAll('[role=button].Mui-selected')].map((e) => e.textContent).find((text) => /alpha|beta/.test(text));
        if (heading) window.__samples.push({ heading, selected });
      }, 5);
    })()`);
    for (const name of ['beta', 'alpha', 'beta', 'alpha', 'beta']) {
      await app.evaluate(`${pick(name)}.click()`);
      await sleep(25);
    }
    await app.until("document.querySelector('[aria-label=\"Project details\"] h5')?.textContent === 'beta'");
    const samples = await app.evaluate('window.__samples');
    await app.evaluate('clearInterval(window.__sampler)');
    assert.ok(samples.length > 0, 'rapid switching produced observable render samples');
    const stale = samples.filter((sample) => !sample.selected?.includes(sample.heading));
    assert.deepEqual(stale, [], 'no stale project response is rendered under another selection');

    // Keyboard navigation across every detail tab, with a labelled panel for each.
    await app.evaluate("document.querySelector('[role=tab]').focus()");
    for (const [key, label, index] of [['ArrowRight', 'Profile', 1], ['ArrowRight', 'Project report', 2], ['ArrowRight', 'Dependencies', 3], ['ArrowRight', 'Profile context', 4]]) {
      await app.key(key);
      assert.equal(await app.evaluate('document.activeElement.textContent'), label);
      await app.key('Enter');
      await app.until(`document.querySelector('[role=tab][aria-selected=true]').textContent === '${label}'`);
      assert.equal(await app.evaluate("document.querySelector('[role=tabpanel]').getAttribute('aria-labelledby')"), `project-tab-${index}`);
      assert.equal(await app.evaluate("document.querySelector('[role=tab][aria-selected=true]').getAttribute('aria-controls')"), `project-tabpanel-${index}`);
    }
    await app.key('ArrowLeft');
    await app.key('Enter');
    await app.until("document.querySelector('[role=tab][aria-selected=true]').textContent === 'Dependencies'");
    console.log(`rapid switching and tab accessibility passed (${samples.length} samples); fixture: ${temp}`);
  } finally {
    app.close();
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
