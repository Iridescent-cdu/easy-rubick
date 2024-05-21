const fileIcon = require('extract-file-icon')
import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs'

const icondir = path.join(os.tmpdir(), 'ProcessIcon')

export const getico = (app) => {
  try {
    const buffer = fileIcon(app.desc, 32)
    const iconpath = path.join(icondir, `${app.name}.png`)

    fs.exists(iconpath, (exists) => {
      if (!exists) {
        fs.writeFile(iconpath, buffer, 'base64', () => {})
      }
    })
  } catch (error) {
    console.log(error, app.desc)
  }
}
