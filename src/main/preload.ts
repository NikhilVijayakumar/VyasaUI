import { contextBridge, ipcRenderer } from 'electron';

const channels = new Set(['vyasa:version', 'vyasa:status', 'vyasa:workspaces', 'vyasa:technologies', 'vyasa:search', 'vyasa:project', 'vyasa:report', 'vyasa:dependencies', 'vyasa:scan', 'vyasa:select']);
contextBridge.exposeInMainWorld('electronAPI', {
  invoke: async (channel: string, ...args: unknown[]) => {
    if (!channels.has(channel)) return Promise.reject(new Error('Unsupported operation'));
    const result = await ipcRenderer.invoke(channel, ...args) as { isError: boolean; statusMessage?: string; data?: unknown };
    if (result.isError) throw new Error(result.statusMessage || 'The operation failed.');
    return result.data;
  },
  send: () => { throw new Error('Unsupported operation'); },
  receive: () => { throw new Error('Unsupported operation'); }
});
