'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { startChrome, startDownload } from './mainProcess/handleCmd'
const isDevelopment = process.env.NODE_ENV !== 'production'
if (process.env.NODE_ENV === 'production') {
  const fixPath = require('fix-path')

  fixPath()
}
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

// tray = new Tray('resources/ico/icon.png')

async function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })
  win.webContents.openDevTools()

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

ipcMain.on('async-msg', async (event, arg) => {
  const openChromeProcess = await startChrome(arg) // 启动浏览器
  openChromeProcess.stdout.on('data', function (data) {
    console.log('chrome 启动成功 stdout:' + data)// 打印正常的后台可执行程序输出
    event.reply('async-reply', {
      status: 'success',
      data
    })
  })
  openChromeProcess.stderr.on('data', function (data) {
    console.log('stderr:' + data) // 打印错误的后台可执行程序输出
    event.reply('async-reply', {
      status: 'error',
      data
    })
  })
  openChromeProcess.on('close', function (code) {
    console.log('out code:' + code) // 退出之后的输出
    event.reply('async-reply', {
      status: 'close',
      code
    })
  })
  event.reply('async-start-download-reply', {
    status: 'none',
    data: openChromeProcess
  })
})

ipcMain.on('async-start-download', (event, arg) => {
  const downloadProcess = startDownload(arg) // 下载pdf
  downloadProcess.stdout.on('data', function (data) {
    console.log('chrome 启动成功 stdout:' + data)// 打印正常的后台可执行程序输出
    event.reply('async-reply', {
      status: 'success',
      data
    })
  })
  downloadProcess.stderr.on('data', function (data) {
    console.log('stderr:' + data) // 打印错误的后台可执行程序输出
    event.reply('async-reply', {
      status: 'error',
      data
    })
  })
  downloadProcess.on('close', function (code) {
    console.log('out code:' + code) // 退出之后的输出
    event.reply('async-reply', {
      status: 'close',
      code
    })
  })
  event.reply('async-start-download-reply', {
    status: 'none',
    data: downloadProcess
  })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
