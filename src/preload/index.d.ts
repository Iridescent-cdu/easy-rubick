import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getApps: () => Promise<any>
      getIconFile: (appFileInput: any) => Promise<unknown>
    }
  }
}
