import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getApps: () => Promise<any>
      app2png: (appFileInput: string, pngFileOutput: string) => Promise<any>
    }
  }
}
