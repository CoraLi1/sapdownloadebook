<template>
  <div class="main">
    <el-form ref="form" :model="form" label-width="150px">
      <!-- <button @click="testNode">测试node</button> -->
      <el-card class="box-card">
        <el-form-item label="安装包文件目录">
          <el-input placeholder="请输入两个js文件所在的绝对目录" v-model="form.basePath"></el-input>
        </el-form-item>

        <el-form-item label="浏览器本地路径">
          <el-input placeholder="请输入浏览器本地路径" v-model="form.chromeUrl"></el-input>
        </el-form-item>

        <el-button type="primary" :aria-disabled="btnDisable" round @click="openChrome">打开浏览器</el-button>
      </el-card>
      <div>请确定登录成功后再点击下载</div>
      <el-card class="box-card">
        <el-form-item label="SAP ebook Url">
          <el-input placeholder="请输入SAP ebook的Url" v-model="form.downloadLink"></el-input>
        </el-form-item>
        <el-form-item label="下载目录">
          <el-input placeholder="请输入PDF文件保存目录" v-model="form.directory"></el-input>
        </el-form-item>
        <el-form-item label="字体目录">
          <el-input placeholder="字体目录" v-model="form.fontPath"></el-input>
        </el-form-item>
        <el-button type="primary" round @click="startDownload">开始下载</el-button>
      </el-card>
    </el-form>
  </div>
</template>
<script>
import { Input, Button, Form, FormItem, Card } from 'element-ui'
import { ipcRenderer } from 'electron'
export default {
  components: {
    'el-input': Input,
    'el-button': Button,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-card': Card
  },
  name: 'Login',
  data () {
    return {
      form: {
        basePath: '',
        chromeUrl: '',
        downloadLink: '',
        directory: '',
        fontPath: ''
      },
      btnDisable: false
    }
  },
  mounted () {
    // eslint-disable-next-line no-useless-escape
    const chromeUrl = "'/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'"
    this.form.chromeUrl = chromeUrl
    if (process.platform === 'darwin') {
      this.form = {
        basePath: '/Users/apple/Desktop/worker-space/sapdownloadebook/saplearninghub-pdf-downloader/dist',
        chromeUrl: chromeUrl,
        downloadLink: 'https://saplearninghub.plateau.com/icontent_e/CUSTOM_eu/sap/self-managed/ebook/S4220_EN_Col14/index.html#',
        directory: '/Users/apple/Downloads',
        fontPath: '/Users/apple/Desktop/worker-space/sapdownloadebook/saplearninghub-pdf-downloader/wryh.ttf'
      }
      console.log('这是mac系统')
    }
    if (process.platform === 'win32') {
      this.form = {
        basePath: '',
        chromeUrl: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        downloadLink: 'https://saplearninghub.plateau.com/icontent_e/CUSTOM_eu/sap/self-managed/ebook/S4220_EN_Col14/index.html#',
        directory: '/Users/apple/Downloads',
        fontPath: '/Users/apple/Desktop/worker-space/sapdownloadebook/saplearninghub-pdf-downloader/wryh.ttf'
      }
      this.form.chromeUrl = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
      console.log('这是windows系统')
    }
  },
  methods: {
    testNode () {
      // ipcRenderer.send('test-node', {})
      // ipcRenderer.on('test-node-reply', (event, arg) => {
      //   console.log(arg)
      // })
    },
    openChrome () {
      this.btnDisable = true
      ipcRenderer.send('async-msg', this.form)
      ipcRenderer.on('async-reply', (event, arg) => {
        this.btnDisable = false
        console.log(arg)
      })
    },
    startDownload () {
      ipcRenderer.send('async-start-download', this.form)
      ipcRenderer.on('async-start-download-reply', (event, arg) => {
        console.log(arg)
      })
    }
  }
}
</script>
<style scoped>
.main {
  margin-left: 30px;
  margin-right: 30px;
}
.item {
  margin-top: 20px
}
button {
  width: 100%;
}
</style>
