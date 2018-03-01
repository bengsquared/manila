'use strict'
const electron = require('electron')
const app = electron.app
const {shell} = require('electron')
const {ipcMain} = require('electron')
const path = require('path')


// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// Prevent window being garbage collected
let mainWindow;


function onClosed() {
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null;
    app.quit;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 800,
		height: 800,
        titleBarStyle: 'hiddenInset',
        fullscreenable: 'false',
        maximizable: 'false',
        maxWidth: 800,
        minWidth: 800,
        maxHeight: 800,
        minHeight: 800,
        backgroundColor: '#F0E4C1'
	});
    
    win.once('ready-to-show', () => {win.show()});
    
	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);
    win.nodeRequire = require;
    delete win.require;
    delete win.exports;
    delete win.module;
    
	return win;
}

ipcMain.on('previewIt', (e, path) => {
    mainWindow.previewFile(path);
    mainWindow.focus();
});

ipcMain.on('closeIt', (e) => {
    mainWindow.closeFilePreview();
    mainWindow.focus();
});

app.on('window-all-closed', () => {
	//if (process.platform !== 'darwin') {
		app.quit();
	//}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow()
	}
});

app.on('ready', () => {
    
	mainWindow = createMainWindow();
    createPyProc();
});


// MARK: PYTHON


let pyProc = null
let pyPort = null

const selectPort = () => {
  pyPort = 4242;
  return pyPort;
}

const createPyProc = () => {
  let port = '' + selectPort()
  let script = path.join(__dirname, 'py', 'api.py')
  pyProc = require('child_process').spawn('python', [script, port])
  if (pyProc != null) {
    console.log('child process success')
  }
}

const exitPyProc = () => {
  pyProc.kill()
  pyProc = null
  pyPort = null
}

app.on('will-quit', exitPyProc)
app.on('ready', createPyProc)
