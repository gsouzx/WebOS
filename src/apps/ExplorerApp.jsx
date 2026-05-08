import { useState, useRef } from 'react'

const FS = {
  '/': ['Documents', 'Downloads', 'Music', 'Pictures', 'Desktop'],
  '/Documents': ['relatorio.pdf', 'notas.txt', 'projeto.zip'],
  '/Downloads': ['setup.exe', 'filme.mp4', 'arquivo.zip'],
  '/Music': ['playlist.m3u', 'favoritos.txt'],
  '/Pictures': ['ferias.jpg', 'screenshot.png', 'avatar.jpg'],
  '/Desktop': ['readme.txt'],
}

const styles = `
.app-explorer{height:100%;display:flex;flex-direction:column;}
.explorer-toolbar{padding:8px 12px;background:rgba(245,245,247,0.8);border-bottom:0.5px solid rgba(0,0,0,0.08);display:flex;align-items:center;gap:8px;}
.explorer-path{flex:1;padding:5px 10px;border-radius:7px;background:rgba(0,0,0,0.06);font-size:13px;color:var(--text);}
.explorer-view-btn{padding:4px 8px;border:none;background:none;cursor:pointer;border-radius:5px;font-size:13px;color:var(--text2);}
.explorer-view-btn:hover{background:rgba(0,0,0,0.07);}
.explorer-body{flex:1;overflow-y:auto;padding:12px;}
.explorer-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:12px;}
.explorer-item{display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;padding:8px 4px;border-radius:8px;transition:background 0.12s;}
.explorer-item:hover,.explorer-item.selected{background:rgba(0,122,255,0.1);}
.explorer-item-icon{font-size:36px;}
.explorer-item-name{font-size:11px;color:var(--text);text-align:center;word-break:break-word;max-width:76px;}
.explorer-list-item{display:flex;align-items:center;gap:10px;padding:6px 8px;border-radius:7px;cursor:pointer;font-size:13px;}
.explorer-list-item:hover{background:rgba(0,0,0,0.05);}
`

export default function ExplorerApp() {
  const [path, setPath] = useState('/')
  const [sel, setSel] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [hist, setHist] = useState(['/'])
  const histIdx = useRef(0)

  const items = (FS[path] || []).map(name => {
    const isDir = !!FS[(path === '/' ? '' : path) + '/' + name]
    const ext = name.split('.').pop()
    const icons = { pdf: '📄', txt: '📝', zip: '🗜', exe: '⚙️', mp4: '🎬', jpg: '🖼', png: '🖼', mp3: '🎵', m3u: '🎵' }
    return { name, isDir, icon: isDir ? '📁' : (icons[ext] || '📄') }
  })

  const navigate = (name, isDir) => {
    if (!isDir) return
    const np = (path === '/' ? '' : path) + '/' + name
    if (!FS[np]) return
    const newHist = [...hist.slice(0, histIdx.current + 1), np]
    setHist(newHist); histIdx.current = newHist.length - 1
    setPath(np); setSel(null)
  }

  const goBack = () => { if (histIdx.current > 0) { histIdx.current--; setPath(hist[histIdx.current]); setSel(null) } }
  const goFwd = () => { if (histIdx.current < hist.length - 1) { histIdx.current++; setPath(hist[histIdx.current]); setSel(null) } }

  return (
    <>
      <style>{styles}</style>
      <div className="app-explorer">
        <div className="explorer-toolbar">
          <button className="browser-nav-btn" onClick={goBack} disabled={histIdx.current === 0}>◀</button>
          <button className="browser-nav-btn" onClick={goFwd} disabled={histIdx.current === hist.length - 1}>▶</button>
          <div className="explorer-path">{path}</div>
          <button className="explorer-view-btn" onClick={() => setViewMode('grid')}>⊞</button>
          <button className="explorer-view-btn" onClick={() => setViewMode('list')}>☰</button>
        </div>
        <div className="explorer-body">
          {viewMode === 'grid' ? (
            <div className="explorer-grid">
              {items.map(it => (
                <div key={it.name} className={`explorer-item${sel === it.name ? ' selected' : ''}`}
                  onClick={() => setSel(it.name)} onDoubleClick={() => navigate(it.name, it.isDir)}>
                  <span className="explorer-item-icon">{it.icon}</span>
                  <span className="explorer-item-name">{it.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {items.map(it => (
                <div key={it.name} className="explorer-list-item"
                  style={{ background: sel === it.name ? 'rgba(0,122,255,0.1)' : '' }}
                  onClick={() => setSel(it.name)} onDoubleClick={() => navigate(it.name, it.isDir)}>
                  <span>{it.icon}</span>
                  <span style={{ flex: 1, color: 'var(--text)' }}>{it.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>{it.isDir ? 'Pasta' : 'Arquivo'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}