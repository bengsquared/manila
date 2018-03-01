'use strict';

var electron = require('electron');
var app = electron.app;

var _require = require('electron'),
    shell = _require.shell;

var _require2 = require('electron'),
    ipcMain = _require2.ipcMain;

var path = require('path');

// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// Prevent window being garbage collected
var mainWindow = void 0;

function onClosed() {
  // Dereference the window
  // For multiple windows store them in an array
  mainWindow = null;
  app.quit;
}

function createMainWindow() {
  var win = new electron.BrowserWindow({
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

  win.once('ready-to-show', function () {
    win.show();
  });

  win.loadURL('file://' + __dirname + '/index.html');
  win.on('closed', onClosed);
  win.nodeRequire = require;
  delete win.require;
  delete win.exports;
  delete win.module;

  return win;
}

ipcMain.on('previewIt', function (e, path) {
  mainWindow.previewFile(path);
  mainWindow.focus();
});

ipcMain.on('closeIt', function (e) {
  mainWindow.closeFilePreview();
  mainWindow.focus();
});

app.on('window-all-closed', function () {
  //if (process.platform !== 'darwin') {
  app.quit();
  //}
});

app.on('activate', function () {
  if (!mainWindow) {
    mainWindow = createMainWindow();
  }
});

app.on('ready', function () {

  mainWindow = createMainWindow();
  createPyProc();
});

// MARK: PYTHON


var pyProc = null;
var pyPort = null;

var selectPort = function selectPort() {
  pyPort = 4242;
  return pyPort;
};

var createPyProc = function createPyProc() {
  var port = '' + selectPort();
  var script = path.join(__dirname, 'py', 'api.py');
  pyProc = require('child_process').spawn('python', [script, port]);
  if (pyProc != null) {
    console.log('child process success');
  }
};

var exitPyProc = function exitPyProc() {
  pyProc.kill();
  pyProc = null;
  pyPort = null;
};

app.on('will-quit', exitPyProc);
app.on('ready', createPyProc);