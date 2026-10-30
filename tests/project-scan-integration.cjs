// Exercises the built Electron main IPC handlers against a disposable real Vyasa index.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const Module = require('node:module');
const binary = 'E:\\Python\\Vyasa\\venv\\Scripts\\vyasa.exe';
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'vyasa-ui-scan-'));
const root = path.join(temp, 'workspace');
const home = path.join(temp, 'data');
fs.mkdirSync(home, { recursive: true });
for (const name of ['selected', 'other']) {
  const repo = path.join(root, name);
  fs.mkdirSync(path.join(repo, '.git'), { recursive: true });
  fs.writeFileSync(path.join(repo, '.git', 'HEAD'), 'ref: refs/heads/main\n');
  fs.writeFileSync(path.join(repo, 'README.md'), name);
}
fs.writeFileSync(path.join(home, 'config.toml'), `[workspace]\nroots = ["${root.replaceAll('\\', '/')}"]\n`);
process.env.VYASA_HOME = home;
process.env.VYASA_CLI_PATH = binary;
const cli = (...args) => execFileSync(binary, args, { encoding: 'utf8', env: process.env });
cli('scan');
const search = JSON.parse(cli('query', 'search'));
const project = search.data.projects.find((p) => p.display_name === 'selected');
assert.ok(project, 'isolated project indexed');
const handlers = new Map();
class Window {
  constructor() { this.webContents = { setWindowOpenHandler() {}, on() {} }; }
  on() {} loadFile() {} loadURL() {}
  static getAllWindows() { return []; }
}
const electron = { app: { getPath: () => temp, whenReady: () => Promise.resolve(), on() {}, isPackaged: true }, BrowserWindow: Window, dialog: {}, ipcMain: { handle: (name, fn) => handlers.set(name, fn) } };
const originalLoad = Module._load;
Module._load = function (request, ...args) { return request === 'electron' ? electron : originalLoad.call(this, request, ...args); };
require('../out/main/index.js');
setImmediate(async () => {
  try {
    assert.equal((await handlers.get('vyasa:project-scan-capability')()).data, true);
    const detail = await handlers.get('vyasa:project')(null, project.project_id);
    assert.equal(detail.data.data.project_id, project.project_id);
    const completed = await handlers.get('vyasa:project-scan')(null, project.project_id);
    assert.equal(completed.data.status, 'completed');
    assert.equal(completed.data.checkouts.length, 1);
    fs.renameSync(path.join(root, 'selected'), path.join(root, 'selected-moved'));
    const failed = await handlers.get('vyasa:project-scan')(null, project.project_id);
    assert.equal(failed.data.status, 'failed');
    assert.equal(failed.data.checkouts[0].reason, 'MISSING');
    const other = JSON.parse(cli('query', 'search')).data.projects.find((p) => p.display_name === 'other');
    assert.equal(other.state, 'active');
    console.log(`isolated IPC integration passed; fixture: ${temp}`);
  } catch (error) { console.error(error); process.exitCode = 1; }
});
