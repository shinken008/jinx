const fs = require('fs')
const fse = require('fs-extra')
const { app, BrowserWindow, Notification, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path')
const packager = require('electron-packager')
const { makeMain } = require('./makeMain')

const appVersion = '1.0.0'

let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform != 'darwin')
    app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function () {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  // mainWindow.webContents.openDevTools();

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/src/index.html');
  // mainWindow.loadFile('index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

ipcMain.on('data', (event, data) => {
  const { sourcePath, targetPath, fileName, system } = data
  const { name } = path.parse(sourcePath)
  const appName = fileName !== '' ? fileName : name
  const appPath = path.resolve(__dirname, appName)
  // 执行拷贝到程序目录
  console.info(`exec commandar copy ${sourcePath} to ${appPath}`)

  fse.copy(sourcePath, appPath, (err) => {
    if (err) throw new Error(`拷贝选择目录出错啦: ${err}`)
    // 找到入口文件，默认为第一个.html后缀的文件
    findDir(sourcePath, '.html', function (err, filenames) {
      if (err) throw new Error(`没有找到.html文件: ${err}`)
      const { base: sourceHtml } = path.parse(filenames[0])
      // 生成electron打包的main.js文件。
      const mainJS = makeMain({ targetPath, sourceHtml })
      fs.writeFileSync(`${appPath}/main.js`, mainJS, { encoding: 'utf8' })
      // 此处是electron-packager坑，项目目录必须要有package.json文件
      const packageJSON = getPackageJSON(appName)
      fs.writeFileSync(`${appPath}/package.json`, packageJSON, { encoding: 'utf8' })
      // 打包目标目录
      console.info(`package start with options appPath=${appPath}`)

      // 设置它为 true 可以使 asar 文件在node的内置模块中失效.
      process.noAsar = true

      // 针对选择不同系统选择不同打包策略
      let otherOpt = {}
      otherOpt.platform = system
      if (system === 'all') {
        otherOpt.arch = 'all'
        otherOpt.all = true
      } else {
        otherOpt.arch = 'x64'
      }

      packager({
        ...otherOpt,
        dir: appPath,
        name: appName,
        out: targetPath,
        overwrite: true,
        appVersion: appVersion,
        electronVersion: '2.0.8',
        ignore: ['node_modules', '.gitignore', /\*.log/],
      }, function (error, appPaths) {
        // 删除源文件
        if (process.platform === 'darwin') exec(`rm -rf ${appPath}`)
        if (process.platform === 'win32') exec(`rd ${appPath}`)
        if (error) {
          throw new Error(`打包文件出错啦: ${error}`);
        }
        console.info('========== packaged successfully =============')
        const notification = new Notification({
          title: '打包成功'
        })
        notification.show()
        // process.exit(1)
      })
    })
  })
})

function findDir(startPath, filter, cb) {
  const filenames = []
  if (!fs.existsSync(startPath)) {
    throw new Error('not exsit dir')
  }
  const files = fs.readdirSync(startPath)
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i])
    const stat = fs.lstatSync(filename)
    if (stat.isDirectory()) {
      // findDir(filename, filter, cb)
    } else if (filename.match(filter)) {
      filenames.push(filename)
    }
  }
  if (!filenames.length) {
    cb(`not found ${filter} file`)
    return
  }
  cb(null, filenames)
}

function getPackageJSON(appName) {
  return `{
  "name": "${appName}",
  "version": "${appVersion}",
  "main": "main.js"
}`
}