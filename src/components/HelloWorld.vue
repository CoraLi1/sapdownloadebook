<template>
  <div class="main">
    <div class="log-info">
      <div v-for="(logObj, index) in logArr" :key="index">
        <span>{{ logObj.status }}:</span>
        <span>{{ logObj.data || logObj.code }}:</span>
      </div>
    </div>

    <el-form ref="form" :model="form" label-width="150px" size="mini">
      <el-card class="box-card">
        <el-form-item label="安装包文件目录">
          <el-input placeholder="请输入两个js文件所在的绝对目录" v-model="form.basePath"></el-input>
        </el-form-item>

        <el-form-item label="浏览器本地路径">
          <el-input placeholder="请输入浏览器本地路径" v-model="form.chromeUrl"></el-input>
        </el-form-item>

        <el-button type="primary" size="mini" :aria-disabled="btnDisable" round @click="openChrome">打开浏览器</el-button>
      </el-card>
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
        <div class="tips">请确定登录成功后再点击下载</div>
        <el-button type="primary" size="mini" round @click="startDownload">开始下载</el-button>
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
      btnDisable: false,
      logArr: []
    }
  },
  mounted () {
    // eslint-disable-next-line no-useless-escape
    const chromeUrl = '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'
    this.form.chromeUrl = chromeUrl
    if (process.platform === 'darwin') {
      this.form = {
        basePath: '/Users/apple/Desktop/worker-space/sapdownloadebook/saplearninghub-pdf-downloader/dist',
        chromeUrl: chromeUrl,
        downloadLink: 'https://saplearninghub.plateau.com/icontent_e/CUSTOM_eu/sap/self-managed/ebook/S4220_EN_Col14/index.html#',
        directory: '/Users/apple/Downloads',
        fontPath: '/Users/apple/Desktop/worker-space/sapdownloadebook/saplearninghub-pdf-downloader/wryh.ttf'
      }
    }
    if (process.platform === 'win32') {
      this.form = {
        basePath: '',
        chromeUrl: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        downloadLink: 'https://saplearninghub.plateau.com/icontent_e/CUSTOM_eu/sap/self-managed/ebook/S4220_EN_Col14/index.html#',
        directory: 'D:\\',
        fontPath: 'D:\\'
      }
      this.form.chromeUrl = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    }
  },
  methods: {
    openChrome () {
      this.btnDisable = true
      ipcRenderer.send('async-open-chrome', this.form)
      ipcRenderer.on('async-open-chrome-reply', (event, arg) => {
        this.btnDisable = false
        this.logArr = [
          ...this.logArr,
          arg
        ]
      })
    },
    startDownload () {
      ipcRenderer.send('async-start-download', this.form)
      ipcRenderer.on('async-start-download-reply', (event, arg) => {
        this.logArr = [
          ...this.logArr,
          arg]
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
.log-info {
  height: 200px;
  overflow: auto;
  background: #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  text-align: left;
}
.tips {
  text-align: left;
  font-size: 12px;
  color: rgb(238, 105, 105);
  margin-bottom: 8px;
}
.el-card {
  margin-bottom: 10px;
}
.item {
  margin-top: 20px
}
button {
  width: 100%;
}
</style>
