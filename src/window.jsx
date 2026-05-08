import { useState, useEffect, useRef } from 'react'

let nextZ = 200

export default function Window({ win, apps, onClose, onFocus, onMinimize, wallpaper, setWallpaper, zIndex, isFocused }) {
  const app = apps.find(a => a.id === win.appId)
  const [pos, setPos] = useState(win.pos)
  const [size, setSize] = useState(win.size)
  const dragging = useRef(false)
  const resizing = useRef(false)
  const startRef = useRef({})
  const posRef = useRef(pos)
  const sizeRef = useRef(size)
  posRef.current = pos
  sizeRef.current = size

  const onMouseDownTitlebar = (e) => {
    if (e.target.closest('.win-btn')) return
    dragging.current = true
    startRef.current = { mx: e.clientX, my: e.clientY, x: posRef.current.x, y: posRef.current.y }
    onFocus()
    e.preventDefault()
  }

  const onMouseDownResize = (e) => {
    resizing.current = true
    startRef.current = { mx: e.clientX, my: e.clientY, w: sizeRef.current.w, h: sizeRef.current.h }
    e.stopPropagation()
    e.preventDefault()
  }

  useEffect(() => {
    const mv = (e) => {
      if (dragging.current) {
        const dx = e.clientX - startRef.current.mx
        const dy = e.clientY - startRef.current.my
        setPos({ x: Math.max(0, startRef.current.x + dx), y: Math.max(28, startRef.current.y + dy) })
      }
      if (resizing.current) {
        const dw = e.clientX - startRef.current.mx
        const dh = e.clientY - startRef.current.my
        setSize({ w: Math.max(320, startRef.current.w + dw), h: Math.max(200, startRef.current.h + dh) })
      }
    }
    const up = () => { dragging.current = false; resizing.current = false }
    window.addEventListener('mousemove', mv)
    window.addEventListener('mouseup', up)
    return () => { window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up) }
  }, [])

  const Comp = app.component

  return (
    <div className={`window${isFocused ? ' focused' : ''}`}
      style={{ left: pos.x, top: pos.y, width: size.w, height: size.h, zIndex }}
      onMouseDown={onFocus}>
      <div className="win-titlebar" onMouseDown={onMouseDownTitlebar}>
        <button className="win-btn win-close" onClick={onClose} title="Fechar" />
        <button className="win-btn win-min" onClick={onMinimize} title="Minimizar" />
        <button className="win-btn win-max" title="Maximizar" />
        <span className="win-title">{app.emoji} {app.name}</span>
      </div>
      <div className="win-body">
        {app.id === 'settings'
          ? <Comp wallpaper={wallpaper} setWallpaper={setWallpaper} />
          : <Comp />}
      </div>
      <div className="resize-handle" onMouseDown={onMouseDownResize} />
    </div>
  )
}