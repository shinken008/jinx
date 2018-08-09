const path = require('path')

exports = module.exports

function makeMain(options = {}) {
  const {
    sourceHtml,
  } = options

  const template =
  `
  // Modules to control application life and create native browser window
  const { app, BrowserWindow } = require('electron')
  
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let mainWindow
  
  function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        plugins: true,
      }
    })
  
    // mainWindow.webContents.openDevTools();
  
    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/${sourceHtml}')
  
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
  
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
    })
  }
  
  // app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));
  app.commandLine.appendSwitch('ppapi-flash-path', app.getPath('pepperFlashSystemPlugin'));
  
  // Specify flash version, for example, v29.0.0.113设置版本号
  // app.commandLine.appendSwitch('ppapi-flash-version', '30.0.0.134');
  
  
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)
  
  // Quit when all windows are closed.
  app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow()
    }
  })
  
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
  `

  return template
  
}

exports.makeMain = makeMain
