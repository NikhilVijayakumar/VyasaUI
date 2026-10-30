import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { execFile } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

let activeWindow: BrowserWindow | null = null;
const defaultExecutable = 'E:\\MCP\\Vyasa MCP\\vyasa\\vyasa.exe';
const configPath = (): string => join(app.getPath('userData'), 'vyasa-backend.json');
function executable(): string {
  try {
    const config = JSON.parse(readFileSync(configPath(), 'utf8')) as { executable?: unknown };
    if (typeof config.executable === 'string' && config.executable) return config.executable;
  } catch { /* no user-selected backend yet */ }
  return process.env.VYASA_CLI_PATH || defaultExecutable;
}
function response(data: unknown): object {
  return { isSuccess: true, isError: false, status: 200, statusMessage: '', data };
}
function failure(message: string): object {
  return { isSuccess: false, isError: true, status: 500, statusMessage: message };
}
function invokeBackend(args: string[], scan = false): Promise<object> {
  const binary = executable();
  if (!existsSync(binary)) return Promise.resolve(failure('Vyasa CLI was not found. Select the installed executable in Settings.'));
  return new Promise((done) => {
    const options = {
      timeout: scan ? 600_000 : 30_000,
      maxBuffer: 8 * 1024 * 1024,
      windowsHide: true,
      env: { ...process.env, VYASA_HOME: process.env.VYASA_HOME || resolve(dirname(binary), '..', 'data') }
    };
    execFile(binary, args, options, (error, stdout, stderr) => {
      if (scan) {
        if (error && error.code !== 1) return done(failure(stderr.trim() || 'The scan could not be completed.'));
        return done(response({ status: error ? 'partial' : 'completed', output: stdout.trim(), warning: stderr.trim() }));
      }
      try {
        const result = JSON.parse(stdout) as { error?: { message?: string } };
        if (error || result.error) return done(failure(result.error?.message || 'The backend query failed.'));
        return done(response(result));
      } catch {
        return done(failure('The installed Vyasa CLI does not support the required JSON interface. Update the backend.'));
      }
    });
  });
}
function registerHandlers(): void {
  ipcMain.handle('vyasa:version', () => invokeBackend(['query', 'version']));
  ipcMain.handle('vyasa:status', () => invokeBackend(['query', 'status']));
  ipcMain.handle('vyasa:workspaces', () => invokeBackend(['query', 'workspaces']));
  ipcMain.handle('vyasa:search', (_event, input: unknown) => {
    if (!input || typeof input !== 'object') return failure('Invalid search request.');
    const { query, technology, cursor, workspace } = input as Record<string, unknown>;
    if ([query, technology, cursor, workspace].some((v) => v !== undefined && (typeof v !== 'string' || v.length > 500))) return failure('Invalid search request.');
    const args = ['query', 'search', '--limit', '50'];
    if (typeof query === 'string' && query.trim()) args.push('--query=' + query.trim());
    if (typeof technology === 'string' && technology.trim()) args.push('--technology=' + technology.trim());
    if (typeof workspace === 'string' && workspace) args.push('--workspace=' + workspace);
    if (typeof cursor === 'string' && cursor) args.push('--cursor=' + cursor);
    return invokeBackend(args);
  });
  for (const name of ['project', 'report', 'dependencies'] as const) {
    ipcMain.handle('vyasa:' + name, (_event, id: unknown) => {
      if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(id)) return failure('Invalid project identifier.');
      return invokeBackend(['query', name, id]);
    });
  }
  ipcMain.handle('vyasa:scan', (_event, workspace: unknown) => {
    if (workspace !== undefined && (typeof workspace !== 'string' || !workspace || workspace.length > 500)) return failure('Invalid workspace.');
    return invokeBackend(typeof workspace === 'string' ? ['scan', '--workspace=' + workspace] : ['scan'], true);
  });
  ipcMain.handle('vyasa:select', async () => {
    if (!activeWindow) return failure('No application window is available.');
    const picked = await dialog.showOpenDialog(activeWindow, { title: 'Select the Vyasa CLI executable', properties: ['openFile'] });
    if (picked.canceled || !picked.filePaths[0]) return response({ canceled: true });
    writeFileSync(configPath(), JSON.stringify({ executable: picked.filePaths[0] }), 'utf8');
    return response({ canceled: false });
  });
}
function createWindow(): void {
  activeWindow = new BrowserWindow({
    width: 1280, height: 820, minWidth: 800, minHeight: 600, title: 'Vyasa UI',
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, preload: join(__dirname, '../preload/index.js') }
  });
  activeWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  activeWindow.webContents.on('will-navigate', (event) => event.preventDefault());
  activeWindow.on('closed', () => { activeWindow = null; });
  if (!app.isPackaged && process.env.ELECTRON_RENDERER_URL) void activeWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  else void activeWindow.loadFile(join(__dirname, '../renderer/index.html'));
}
void app.whenReady().then(() => {
  registerHandlers();
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
