import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import { AppContext, registerIpcHandlers, getSpectreDataRoot } from '@spectre/backend';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env['SPECTRE_DEV'] === '1';
let mainWindow: BrowserWindow | null = null;

const dataRoot = getSpectreDataRoot(os.homedir());
const appContext = new AppContext(dataRoot);

async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../../electron-preload/dist/preload.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
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

app.whenReady().then(async () => {
  registerIpcHandlers(appContext);
  await createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
