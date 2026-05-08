import { useState, useEffect, useRef } from 'react'
import CalcApp from './apps/CalcApp'
import NotesApp from './apps/NotesApp'
import TerminalApp from './apps/TerminalApp'
import SettingsApp from './apps/SettingsApp'
import BrowserApp from './apps/BrowserApp'
import MusicApp from './apps/MusicApp'
import ExplorerApp from './apps/ExplorerApp'
import Window from './window'

const WALLPAPERS = [
  'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',
  'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)',
  'linear-gradient(135deg,#2d1b69,#11998e,#38ef7d)',
  'linear-gradient(135deg,#fc4a1a,#f7b733,#16213e)',
  'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',
]

export const APPS = [
  { id: 'calc',     name: 'Calculadora',  emoji: '🧮', w: 320, h: 520, component: CalcApp },
  { id: 'notes',    name: 'Notas',        emoji: '📝', w: 560, h: 420, component: NotesApp },
  { id: 'terminal', name: 'Terminal',     emoji: '⬛', w: 560, h: 380, component: TerminalApp },
  { id: 'settings', name: 'Configurações',emoji: '⚙️', w: 600, h: 440, component: SettingsApp },
  { id: 'browser',  name: 'Safari',       emoji: '🌐', w: 680, h: 480, component: BrowserApp },
  { id: 'music',    name: 'Música',       emoji: '🎵', w: 340, h: 560, component: MusicApp },
  { id: 'explorer', name: 'Finder',       emoji: '🗂', w: 600, h: 440, component: ExplorerApp },
]

const DOCK_APPS = ['browser', 'music', 'terminal', 'calc', 'notes', 'explorer', 'settings']

let nextZ = 100

function useTime() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i) }, [])
  return t
}

export default function App() {
  const time = useTime()
  const [wallpaper, setWallpaper] = useState(WALLPAPERS[0])
  const [windows, setWindows] = useState([])
  const [minimized, setMinimized] = useState([])
  const [spotlight, setSpotlight] = useState(false)
  const [spotInput, setSpotInput] = useState('')
  const [notifs, setNotifs] = useState([])
  const [focused, setFocused] = useState(null)
  const spotRef = useRef(null)

  const openApp = (appId) => {
    const already = windows.find(w => w.appId === appId && !minimized.includes(w.id))
    if (already) { focusWin(already.id); return }
    const wasMin = windows.find(w => w.appId === appId && minimized.includes(w.id))
    if (wasMin) { setMinimized(m => m.filter(id => id !== wasMin.id)); focusWin(wasMin.id); return }
    const app = APPS.find(a => a.id === appId)
    if (!app) return
    const id = Date.now()
    const cx = window.innerWidth / 2 - app.w / 2 + Math.random() * 40 - 20
    const cy = window.innerHeight / 2 - app.h / 2 + Math.random() * 40 - 20
    setWindows(ws => [...ws, { id, appId, pos: { x: Math.max(0, cx), y: Math.max(30, cy) }, size: { w: app.w, h: app.h }, z: nextZ++ }])
    setFocused(id)
  }

  const closeWin = (id) => { setWindows(ws => ws.filter(w => w.id !== id)); setMinimized(m => m.filter(i => i !== id)) }
  const minWin = (id) => setMinimized(m => [...m, id])
  const focusWin = (id) => { setFocused(id); setWindows(ws => ws.map(w => w.id === id ? { ...w, z: nextZ++ } : w)) }

  const pushNotif = (title, body) => {
    const id = Date.now()
    setNotifs(n => [...n, { id, title, body }])
    setTimeout(() => setNotifs(n => n.filter(x => x.id !== id)), 4000)
  }

  useEffect(() => { const t = setTimeout(() => pushNotif('WebOS', 'Bem-vindo de volta, Guih_Souza! 👋'), 1200); return () => clearTimeout(t) }, [])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ' ') { e.preventDefault(); setSpotlight(s => !s); setSpotInput('') }
      if (e.key === 'Escape') setSpotlight(false)
    }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => { if (spotlight) setTimeout(() => spotRef.current?.focus(), 50) }, [spotlight])

  const spotResults = APPS.filter(a => a.name.toLowerCase().includes(spotInput.toLowerCase()))
  const visibleWins = windows.filter(w => !minimized.includes(w.id))
  const fmt = (d) => { const h = d.getHours(), m = d.getMinutes(); return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}` }
  const fmtDate = (d) => d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <div className="desktop" style={{ background: wallpaper }}>
      <div className="menubar">
        <div className="menubar-left">
          <span className="menubar-apple" onClick={() => openApp('settings')}>🍎</span>
          <span className="menubar-item">WebOS</span>
          <span className="menubar-item">Arquivo</span>
          <span className="menubar-item">Editar</span>
          <span className="menubar-item">Visualizar</span>
        </div>
        <div className="menubar-right">
          <span className="menubar-icon" onClick={() => openApp('settings')}>📶</span>
          <span className="menubar-icon" onClick={() => openApp('music')}>🎵</span>
          <span className="menubar-icon" onClick={() => pushNotif('WebOS', 'Teste de notificação!')}>🔔</span>
          <span className="menubar-time">{fmtDate(time)}&nbsp;&nbsp;{fmt(time)}</span>
        </div>
      </div>

      {visibleWins.map(w => (
        <Window key={w.id} win={w} apps={APPS}
          onClose={() => closeWin(w.id)}
          onMinimize={() => minWin(w.id)}
          onFocus={() => focusWin(w.id)}
          wallpaper={wallpaper} setWallpaper={setWallpaper}
          zIndex={w.z} isFocused={focused === w.id} />
      ))}

      <div className="notif">
        {notifs.map(n => (
          <div key={n.id} className="notif-item" onClick={() => setNotifs(ns => ns.filter(x => x.id !== n.id))}>
            <div className="notif-title">{n.title}</div>
            <div className="notif-body">{n.body}</div>
          </div>
        ))}
      </div>

      {spotlight && (
        <div className="spotlight-overlay" onClick={e => { if (e.target === e.currentTarget) setSpotlight(false) }}>
          <div className="spotlight-box">
            <input ref={spotRef} className="spotlight-input" placeholder="🔍 Spotlight — pesquisar aplicativos..."
              value={spotInput} onChange={e => setSpotInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && spotResults[0]) { openApp(spotResults[0].id); setSpotlight(false) } }} />
            {spotInput && (
              <div className="spotlight-results">
                {spotResults.map(a => (
                  <div key={a.id} className="spotlight-result-item" onClick={() => { openApp(a.id); setSpotlight(false) }}>
                    <span style={{ fontSize: 20 }}>{a.emoji}</span><span>{a.name}</span>
                  </div>
                ))}
                {spotResults.length === 0 && <div style={{ padding: '12px 18px', color: 'var(--text2)', fontSize: 14 }}>Nenhum resultado.</div>}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="dock-wrapper">
        <div className="dock">
          {DOCK_APPS.map(id => {
            const app = APPS.find(a => a.id === id)
            const open = windows.some(w => w.appId === id)
            return (
              <div key={id} className="dock-item" onClick={() => openApp(id)}>
                <div className="dock-icon" style={{ background: 'rgba(255,255,255,0.12)' }}>{app.emoji}</div>
                {open && <div className="dock-dot" />}
                <div className="dock-tooltip">{app.name}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="credit">WebOS 2.0 — desenvolvido por Guih_Souza</div>
    </div>
  )
}