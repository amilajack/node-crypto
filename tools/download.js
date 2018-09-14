const fs = require('fs')
const request = require('request')
const child_process = require('child_process')
const FILE_NAME = require('./filename')

const HOST = 'https://storage.googleapis.com/storage.lynvv.xyz'

request.get(`${ HOST }/${ FILE_NAME }`)
  .pipe(
    fs.createWriteStream('index.node')
  )
  .on('error', (e) => {
    console.error(e)
    fs.unlinkSync('index.node')
  })
  .on('close', () => {
    const size = fs.statSync('index.node').size
    if (size < 10000) {
      console.error('Download prebuilt binary fail, fallback to build')
      fs.unlinkSync('index.node')
      child_process.execSync('npm run build', {
        stdio: [0, 1, 2]
      })
      fs.copyFileSync('./native/index.node', 'index.node')
    } else {
      console.log('download prebuilt file success ', FILE_NAME)
    }
  })