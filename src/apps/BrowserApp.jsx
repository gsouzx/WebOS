import { useState } from 'react'

const styles = `
.app-browser{height:100%;display:flex;flex-direction:column;}
.browser-bar{padding:8px 12px;background:rgba(245,245,247,0.8);border-bottom:0.5px solid rgba(0,0,0,0.08);display:flex;align-items:center;gap:8px;}
.browser-nav-btn{width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,0.07);border:none;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;color:var(--text);}
.browser-nav-btn:disabled{opacity:0.35;}
.browser-url{flex:1;padding:5px 12px;border-radius:8px;border:1px solid rgba(0,0,0,0.12);background:#fff;font-size:13px;outline:none;color:var(--text);user-select:text;}
.browser-url:focus{border-color:#007AFF;box-shadow:0 0 0 3px rgba(0,122,255,0.15);}
.browser-go{padding:5px 12px;border-radius:8px;background:#007AFF;color:#fff;border:none;cursor:pointer;font-size:13px;font-weight:500;}
.browser-content{flex:1;background:#f5f5f7;display:flex;align-items:center;justify-content:center;}
`

const SHORTCUTS = [
  { name: 'Google', icon: '🔍', url: 'https://google.com' },
  { name: 'GitHub', icon: '🐙', url: 'https://github.com' },
  { name: 'YouTube', icon: '▶️', url: 'https://youtube.com' },
  { name: 'Wikipedia', icon: '📖', url: 'https://wikipedia.org' },
]

export default function BrowserApp() {
  const [url, setUrl] = useState('')
  const [input, setInput] = useState('')

  const go = (u) => { setUrl(u); setInput(u) }

  return (
    <>
      <style>{styles}</style>
      <div className="app-browser">
        <div className="browser-bar">
          <button className="browser-nav-btn" disabled>◀</button>
          <button className="browser-nav-btn" disabled>▶</button>
          <button className="browser-nav-btn" onClick={() => go('')}>↻</button>
          <input className="browser-url" value={input} onChange={e => setInput(e.target.value)}
            placeholder="Pesquisar ou digitar URL..."
            onKeyDown={e => { if (e.key === 'Enter') { const u = input.startsWith('http') ? input : 'https://' + input; go(u) } }} />
          <button className="browser-go" onClick={() => { const u = input.startsWith('http') ? input : 'https://' + input; go(u) }}>Ir</button>
        </div>
        <div className="browser-content">
          {!url ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 42, marginBottom: 12 }}>🌐</div>
              <h2 style={{ fontSize: 22, marginBottom: 6, color: 'var(--text)' }}>Nova guia</h2>
              <p style={{ fontSize: 13, marginBottom: 20, color: 'var(--text2)' }}>Sites favoritos</p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                {SHORTCUTS.map(s => (
                  <div key={s.name} onClick={() => go(s.url)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '10px 14px', borderRadius: 10, background: 'rgba(0,0,0,0.04)' }}>
                    <span style={{ fontSize: 28 }}>{s.icon}</span>
                    <span style={{ fontSize: 12, color: 'var(--text2)' }}>{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🌐</div>
              <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 8 }}>Páginas externas não são embutidas por segurança.</p>
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#007AFF', fontSize: 13 }}>Abrir {url} em nova aba →</a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}