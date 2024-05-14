const useDragWindow = () => {
  let animationId
  let mouseX
  let mouseY
  let clientWidth = 0
  let clientHeight = 0
  let draggable = true

  const onMouseDown = (e: MouseEvent) => {
    /** 鼠标右键点击不触发 */
    if (e.button === 2) return
    draggable = true
    mouseX = e.clientX
    mouseY = e.clientY
    if (Math.abs(document.body.clientWidth - clientWidth) > 5) {
      clientWidth = document.body.clientWidth
    }
    if (Math.abs(document.body.clientHeight - clientHeight) > 5) {
      clientHeight = document.body.clientHeight
    }
    console.log(clientHeight, clientWidth, mouseX, mouseY)
    document.addEventListener('mouseup', onMouseUp)
    animationId = requestAnimationFrame(moveWindow)
  }

  const onMouseUp = () => {
    draggable = false
    document.removeEventListener('mouseup', onMouseUp)
    cancelAnimationFrame(animationId)
  }

  const moveWindow = () => {
    const { ipcRenderer } = window.require('electron')

    ipcRenderer.send('msg-trigger', {
      type: 'windowMoving',
      data: {
        mouseX,
        mouseY,
        width: clientWidth,
        height: clientHeight
      }
    })
    if (draggable) {
      animationId = requestAnimationFrame(moveWindow)
    }
  }
  return {
    onMouseDown
  }
}
export default useDragWindow
