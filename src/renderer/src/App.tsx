import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import useDragWindow from './utils/dragWindow'
import { useEffect } from 'react'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const { onMouseDown } = useDragWindow()

  const getApps = async () => {
    const apps = await new Promise((resolve, reject) => {
      window.api.getApps(resolve, reject)
    })
    const icon = await window.api.app2png(apps[0].path, 'app-store.png')
    console.log(apps, icon)
  }

  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown)
    getApps()

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
