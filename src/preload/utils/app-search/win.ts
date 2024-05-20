import { shell } from 'electron'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'

const appList = []
const appData = path.join(os.homedir(), './AppData/Roaming')

const systemShortCut = path.resolve('C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs')
const originShortCut = path.resolve(
  'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Accessories'
)
const userShortCut = path.join(appData, 'Microsoft\\Windows\\Start Menu\\Programs')

const fileDisplay = (filePath) => {
  fs.readdir(filePath, function (err, files) {
    if (err) {
      console.warn(err)
    } else {
      files.forEach((filename) => {
        const filedir = path.join(filePath, filename)
        fs.stat(filedir, function (err, stats) {
          if (err) {
            console.warn(err, '获取文件stats失败')
          } else {
            const isFile = stats.isFile()
            const isDir = stats.isDirectory()
            if (isFile) {
              const appName = filename.split('.')[0]
              const keywords = [appName]
              let appDetail = {}
              try {
                appDetail = shell.readShortcutLink(filedir)
              } catch (error) {
                console.warn(error)
              }
              if (!appDetail.target || appDetail.target.toLowerCase().indexOf('unin') >= 0) {
                return
              }

              const appInfo = {
                desc: appDetail.target,
                type: 'app',
                name: appName
              }
              appList.push(appInfo)
            }
            if (isDir) {
              fileDisplay(filedir)
            }
          }
        })
      })
    }
  })
}

;[systemShortCut, originShortCut, userShortCut].forEach((appPath) => {
  fileDisplay(appPath)
})
