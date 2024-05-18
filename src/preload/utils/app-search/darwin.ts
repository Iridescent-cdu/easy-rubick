import { exec, spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import plist from 'simple-plist'

export const getApps = (resolve, reject) => {
  let resultBuffer = new Buffer.from([])

  const profileInstalledApps = spawn('/usr/sbin/system_profiler', [
    '-xml',
    '-detailLevel',
    'mini',
    'SPApplicationsDataType'
  ])

  profileInstalledApps.stdout.on('data', (chunkBuffer) => {
    resultBuffer = Buffer.concat([resultBuffer, chunkBuffer])
  })

  profileInstalledApps.on('exit', (exitCode) => {
    if (exitCode !== 0) {
      reject([])
      return
    }

    try {
      const [installedApps] = plist.parse(resultBuffer.toString())
      return resolve(installedApps._items)
    } catch (error) {
      return reject(error)
    }
  })

  profileInstalledApps.on('error', (error) => {
    return reject(error)
  })
}

const getIconFile = (appFileInput) => {
  return new Promise((resolve) => {
    const plistPath = path.join(appFileInput, 'Contents', 'Info.plist')

    plist.readFile(plistPath, (err, data) => {
      if (err || !data.CFBundleIconFile) {
        return resolve(
          '/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericApplicationIcon.icns'
        )
      }

      const iconFile = path.join(appFileInput, 'Contents', 'Resources', data.CFBundleIconFile)
      const iconFiles = [iconFile, iconFile + '.icns', iconFile + '.tiff']
      const existedIcon = iconFiles.find((iconFile) => {
        return fs.existsSync(iconFile)
      })

      resolve(
        existedIcon ||
          '/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericApplicationIcon.icns'
      )
    })
  })
}

const tiffToPng = (iconFile, pngFileOutput) => {
  return new Promise((resolve, reject) => {
    exec(
      `sips -s format png '${iconFile}' --out '${pngFileOutput}' --resampleHeightWidth 64 64`,
      (error) => {
        error ? reject(error) : resolve(`success,${pngFileOutput}`)
      }
    )
  })
}

export const app2png = (appFileInput, pngFileOutput) => {
  return getIconFile(appFileInput).then((iconFile) => {
    return tiffToPng(iconFile, pngFileOutput)
  })
}
