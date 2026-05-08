import { useState } from 'react'

const WALLPAPERS = [
  'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',
  'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)',
  'linear-gradient(135deg,#2d1b69,#11998e,#38ef7d)',
  'linear-gradient(135deg,#fc4a1a,#f7b733,#16213e)',
  'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',
]

const styles = `
.app-settings{height:100%;display:flex;}
.settings-sidebar{width:180px;background:rgba(245,245,247,0.8);border-right:0.5px solid rgba(0,0,0,0.08);padding:16px 8px;display:flex;flex-direction:column;gap:4px;flex-shrink:0;}
.settings-item{padding:7px 12px;border-radius:7px;cursor:pointer;font-size:13px;color:var(--text);display:flex;align-items:center;gap:8px;}
.settings-item:hover{background:rgba(0,0,0,0.06);}
.settings-item.active{background:rgba(0,122,255,0.1);color:#007AFF;}
.settings-content{flex:1;padding:20px;overflow-y:auto;}
.settings-section{margin-bottom:24px;}
.settings-section h3{font-size:12px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;}
.settings-row{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(255,255,255,0.7);border-radius:8px;margin-bottom:4px;font-size:14px;}
.settings-slider{width:120px;accent-color:#007AFF;}
`

function Toggle({ on, onChange }) {
  return <div className={`toggle${on ? ' on' : ''}`} onClick={() => onChange(!on)} />
}

export default function SettingsApp({ wallpaper, setWallpaper }) {
  const [tab, setTab] = useState('Aparência')
  const [s, setS] = useState({ darkMode: true, animations: true, notifications: true, sound: true, wifi: true, bluetooth: false, brightness: 80, volume: 65 })
  const set = (k, v) => setS(prev => ({ ...prev, [k]: v }))

  const tabs = [{ name: 'Aparência', icon: '🎨' }, { name: 'Wi-Fi', icon: '📶' }, { name: 'Som', icon: '🔊' }, { name: 'Privacidade', icon: '🔒' }, { name: 'Sobre', icon: 'ℹ️' }]

  return (
    <>
      <style>{styles}</style>
      <div className="app-settings">
        <div className="settings-sidebar">
          {tabs.map(t => (
            <div key={t.name} className={`settings-item${tab === t.name ? ' active' : ''}`} onClick={() => setTab(t.name)}>
              <span>{t.icon}</span>{t.name}
            </div>
          ))}
        </div>
        <div className="settings-content">
          {tab === 'Aparência' && <>
            <div className="settings-section">
              <h3>Papel de parede</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {WALLPAPERS.map((w, i) => (
                  <div key={i} onClick={() => setWallpaper(w)} style={{ width: 56, height: 36, borderRadius: 7, background: w, cursor: 'pointer', border: wallpaper === w ? '2.5px solid #007AFF' : '2px solid transparent' }} />
                ))}
              </div>
              <div className="settings-row"><span>Modo escuro</span><Toggle on={s.darkMode} onChange={v => set('darkMode', v)} /></div>
              <div className="settings-row"><span>Animações</span><Toggle on={s.animations} onChange={v => set('animations', v)} /></div>
            </div>
            <div className="settings-section">
              <h3>Brilho</h3>
              <div className="settings-row"><span>☀️ Brilho</span><input type="range" className="settings-slider" min={10} max={100} value={s.brightness} onChange={e => set('brightness', +e.target.value)} /><span style={{ fontSize: 12, color: 'var(--text2)', minWidth: 30 }}>{s.brightness}%</span></div>
            </div>
          </>}
          {tab === 'Wi-Fi' && <>
            <div className="settings-section">
              <h3>Redes</h3>
              <div className="settings-row"><span>Wi-Fi</span><Toggle on={s.wifi} onChange={v => set('wifi', v)} /></div>
              {s.wifi && ['GuilhermeNet_5G', 'Casa-2.4', 'iPhone de Guih', 'Vizinho_locked'].map(n => (
                <div key={n} className="settings-row"><span>{n === 'GuilhermeNet_5G' ? '✅ ' : ''}{n}</span><span style={{ fontSize: 12, color: 'var(--text2)' }}>{n === 'GuilhermeNet_5G' ? 'Conectado' : '📶'}</span></div>
              ))}
            </div>
            <div className="settings-section">
              <h3>Bluetooth</h3>
              <div className="settings-row"><span>Bluetooth</span><Toggle on={s.bluetooth} onChange={v => set('bluetooth', v)} /></div>
            </div>
          </>}
          {tab === 'Som' && <>
            <div className="settings-section">
              <h3>Volume</h3>
              <div className="settings-row"><span>🔊 Volume</span><input type="range" className="settings-slider" min={0} max={100} value={s.volume} onChange={e => set('volume', +e.target.value)} /><span style={{ fontSize: 12, color: 'var(--text2)', minWidth: 30 }}>{s.volume}%</span></div>
              <div className="settings-row"><span>Sons do sistema</span><Toggle on={s.sound} onChange={v => set('sound', v)} /></div>
            </div>
          </>}
          {tab === 'Privacidade' && <>
            <div className="settings-section">
              <h3>Permissões</h3>
              <div className="settings-row"><span>Notificações</span><Toggle on={s.notifications} onChange={v => set('notifications', v)} /></div>
              <div className="settings-row"><span>Localização</span><Toggle on={false} onChange={() => {}} /></div>
              <div className="settings-row"><span>Câmera</span><Toggle on={false} onChange={() => {}} /></div>
            </div>
          </>}
          {tab === 'Sobre' && <>
            <div className="settings-section">
              <h3>Sistema</h3>
              {[['Sistema', 'WebOS 2.0'], ['Desenvolvedor', 'Guih_Souza'], ['Framework', 'React 18 + Vite'], ['Versão', '2.0.0'], ['Build', new Date().toLocaleDateString('pt-BR')]].map(([k, v]) => (
                <div key={k} className="settings-row"><span>{k}</span><span style={{ fontSize: 13, color: 'var(--text2)' }}>{v}</span></div>
              ))}
            </div>
          </>}
        </div>
      </div>
    </>
  )
}