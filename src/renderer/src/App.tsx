import { useEffect } from 'react'
import useDragWindow from './utils/dragWindow'
import WebView from './components/Webview'

function App(): JSX.Element {
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
      <WebView src="https://www.electronjs.org/"></WebView>
      <iframe src="https://www.electronjs.org/"></iframe>
    </>
  )
}

export default App
