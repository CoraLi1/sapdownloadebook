// const serverPath = process.env.NODE_ENV === 'development' ? 'saplearninghub-pdf-downloader/dist' : __dirname
const childProcess = require('child_process')
export function startChrome ({ chromeUrl, basePath }) {
  console.log('🚀 ~ file: handleCmd.js ~ line 4 ~ startChrome ~ basePath', basePath)
  const cmdStr = `node openChrome.js --chrome=${chromeUrl}` // 要运行的命令

  runExec(cmdStr)

  function runExec (cmdStr) {
    // exec 函数 第一个参数是要执行的命令，第二个函数是配置选项，第三个参数是回调函数，配置项中常用到 子进程的工作目录
    const serverProcess = childProcess.exec(cmdStr, { cwd: basePath })
    serverProcess.stdout.on('data', function (data) {
      console.log('chrome 启动成功 stdout:' + data)// 打印正常的后台可执行程序输出
    })
    serverProcess.stderr.on('data', function (data) {
      console.log('stderr:' + data) // 打印错误的后台可执行程序输出
    })
    serverProcess.on('close', function (code) {
      console.log('out code:' + code) // 退出之后的输出
    })
  }
}

export function startDownload ({ chromeUrl, downloadLink, directory, fontPath, basePath }) {
  const args = [
    '--url=' + downloadLink,
    '--target=' + directory,
    '--chrome=' + chromeUrl,
    '--fontPath=' + fontPath
  ]

  const cmdStr = `node index.js ${args.join(' ')}` // 要运行的命令
  console.log('🚀 ~ file: handleCmd.js ~ line 18 ~ runExec ~ cmdStr', cmdStr, basePath)

  runExec(cmdStr)

  function runExec (cmdStr) {
    // exec 函数 第一个参数是要执行的命令，第二个函数是配置选项，第三个参数是回调函数，配置项中常用到 子进程的工作目录
    const serverProcess = childProcess.exec(cmdStr, { cwd: basePath })
    serverProcess.stdout.on('data', function (data) {
      console.log('chrome 启动成功 stdout:' + data)// 打印正常的后台可执行程序输出
    })
    serverProcess.stderr.on('data', function (data) {
      console.log('stderr:' + data) // 打印错误的后台可执行程序输出
    })
    serverProcess.on('close', function (code) {
      console.log('out code:' + code) // 退出之后的输出
    })
  }
}
