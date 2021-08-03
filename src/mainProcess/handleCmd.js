// const serverPath = process.env.NODE_ENV === 'development' ? 'saplearninghub-pdf-downloader/dist' : __dirname
const childProcess = require('child_process')
export function startChrome ({ chromeUrl, basePath }) {
  const cmdStr = `node --inspect-brk openChrome.js --chrome="${chromeUrl}"` // 要运行的命令

  // exec 函数 第一个参数是要执行的命令，第二个函数是配置选项，第三个参数是回调函数，配置项中常用到 子进程的工作目录
  return childProcess.exec(cmdStr, { cwd: basePath })
}

export function startDownload ({ chromeUrl, downloadLink, directory, fontPath, basePath }) {
  const args = [
    '--url=' + downloadLink,
    '--target=' + directory,
    '--chrome=' + chromeUrl,
    '--fontPath=' + fontPath
  ]

  const cmdStr = `node --inspect-brk index.js ${args.join(' ')}` // 要运行的命令

  // exec 函数 第一个参数是要执行的命令，第二个函数是配置选项，第三个参数是回调函数，配置项中常用到 子进程的工作目录
  childProcess.exec(cmdStr, { cwd: basePath })
}
