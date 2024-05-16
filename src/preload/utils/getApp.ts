import { spawn } from 'child_process'
import plist from 'plist'

export default function getApps(resolve, reject) {
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
