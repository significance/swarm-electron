// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const { ipcMain } = require('electron');
const fs = require('fs');

const { menubar } = require('menubar');

const mb = menubar();


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function sendWindowMessage(targetWindow, message, payload) {
  if(typeof targetWindow === 'undefined') {
    console.log('Target window does not exist');
    return;
  }
  console.log(message, payload)
  targetWindow.webContents.send(message, payload);
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // const data = new Uint8Array(Buffer.from('password'));
  // //later collect this from the user
  // fs.writeFile('~/.bzz/password', data, (err) => {
  //   if (err) throw err;
  //   console.log('The file has been saved!');
  // });

  ipcMain.on('message-from-worker', (event, arg) => {
    console.log(event,arg)
    sendWindowMessage(mainWindow, 'message-from-worker', arg);
  });

  // create hidden worker window
  workerWindow = new BrowserWindow({
    show: true,
    webPreferences: { nodeIntegration: true }
  });

  workerWindow.loadFile('worker.html');

  workerWindow.webContents.openDevTools()


  const { BrowserView } = require('electron')

  let win = new BrowserWindow(
    { width: 1200, height: 800, nodeIntegration: true,
      webviewTag: true }
  )
  win.on('closed', () => {
    win = null
  })

  let view = new BrowserView({ nodeIntegration: true,
      webviewTag: true })
  win.setBrowserView(view)
  view.setBounds({ x: 0, y: 0, width: 1200, height: 800 })
  setTimeout(()=>{
    view.webContents.loadURL('http://localhost:8500/')
  }, 5000)

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
