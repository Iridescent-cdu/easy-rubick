import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import getApps from './utils/getApp'
import getIconFile from './utils/getIconFile'

const api = {
  getApps,
  getIconFile
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  /** 关闭上下文隔离后挂载electron api */
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
