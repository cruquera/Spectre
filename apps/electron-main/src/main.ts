import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { AppContext, getSpectreDataRoot, registerIpcHandlers } from '@spectre/backend';
import { BrowserWindow, app } from 'electron';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env['SPECTRE_DEV'] === '1';
let mainWindow: BrowserWindow | null = null;

const dataRoot = getSpectreDataRoot(os.homedir());
const appContext = new AppContext(dataRoot);

async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
  height: 800,
  webPreferences: {
  contextIsolation: true,
  nodeIntegration: false,
  preload: path.join(__dirname, '../../electron-preload/dist/preload.js'),
  sandbox: true
},
  width: 1280
});

  if (isDev) {
    await mainWindow.loadURL('http://localhost:4200');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    await mainWindow.loadFile(
      path.join(__dirname, '../../angular-app/dist/angular-app/browser/index.html'),
    );
  }
}

void app.whenReady().then(async () => {
  registerIpcHandlers(appContext);
  await createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
