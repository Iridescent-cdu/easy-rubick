import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { app2png, getApps } from './utils/app-search/darwin'

const api = {
  getApps,
  app2png
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
