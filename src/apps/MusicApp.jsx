import { useState, useEffect, useRef } from 'react'

const styles = `
.app-music{height:100%;display:flex;flex-direction:column;background:linear-gradient(160deg,#1a1a2e,#16213e);color:#fff;}
.music-art{width:140px;height:140px;border-radius:16px;margin:24px auto 16px;display:flex;align-items:center;justify-content:center;font-size:56px;box-shadow:0 8px 24px rgba(0,0,0,0.4);}
.music-info{text-align:center;padding:0 20px;}
.music-title{font-size:18px;font-weight:600;margin-bottom:4px;}
.music-artist{font-size:14px;color:rgba(255,255,255,0.6);}
.music-progress{padding:16px 20px;}
.music-bar{width:100%;height:4px;background:rgba(255,255,255,0.2);border-radius:2px;cursor:pointer;margin:8px 0;}
.music-fill{height:100%;background:#007AFF;border-radius:2px;transition:width 0.5s linear;}
.music-times{display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,0.5);}
.music-controls{display:flex;align-items:center;justify-content:center;gap:20px;padding:8px 0;}
.music-btn{background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.8);font-size:24px;transition:color 0.15s,transform 0.1s;}
.music-btn:hover{color:#fff;}
.music-btn:active{transform:scale(0.88);}
.music-btn.play-pause{width:52px;height:52px;background:#007AFF;border-radius:50%;color:#fff;font-size:22px;display:flex;align-items:center;justify-content:center;}
.music-list{flex:1;overflow-y:auto;padding:0 12px 12px;display:flex;flex-direction:column;gap:2px;}
.music-track{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;}
.music-track:hover,.music-track.active{background:rgba(255,255,255,0.08);}
.music-track-art{width:36px;height:36px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
.music-track-info{flex:1;min-width:0;}
.music-track-name{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.music-track-artist{font-size:11px;color:rgba(255,255,255,0.5);}
.music-track-dur{font-size:12px;color:rgba(255,255,255,0.4);}
.volume-row{display:flex;align-items:center;gap:8px;padding:4px 20px 12px;}
.volume-slider{flex:1;accent-color:#007AFF;}
`

const TRACKS = [
  { id: 1, name: 'Midnight City', artist: 'M83', dur: '4:03', bg: '#667eea', emoji: '🎸' },
  { id: 2, name: 'Blinding Lights', artist: 'The Weeknd', dur: '3:20', bg: '#f093fb', emoji: '🎤' },
  { id: 3, name: 'Levitating', artist: 'Dua Lipa', dur: '3:23', bg: '#4facfe', emoji: '🎵' },
  { id: 4, name: 'Starboy', artist: 'The Weeknd', dur: '3:50', bg: '#43e97b', emoji: '⭐' },
  { id: 5, name: 'Save Your Tears', artist: 'The Weeknd', dur: '3:35', bg: '#fa709a', emoji: '💧' },
]

export default function MusicApp() {
  const [playing, setPlaying] = useState(false)
  const [cur, setCur] = useState(0)
  const [prog, setProg] = useState(0)
  const [vol, setVol] = useState(70)
  const timerRef = useRef(null)
  const t = TRACKS[cur]

  useEffect(() => {
    if (playing) { timerRef.current = setInterval(() => setProg(p => { if (p >= 100) { setPlaying(false); return 0 } return p + 0.5 }), 500) }
    else clearInterval(timerRef.current)
    return () => clearInterval(timerRef.current)
  }, [playing, cur])

  const durSecs = (d) => { const [m, s] = d.split(':'); return +m * 60 + +s }
  const elapsed = () => { const s = Math.floor(prog / 100 * durSecs(t.dur)); return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + s % 60 }

  return (
    <>
      <style>{styles}</style>
      <div className="app-music">
        <div className="music-art" style={{ background: t.bg }}>{t.emoji}</div>
        <div className="music-info">
          <div className="music-title">{t.name}</div>
          <div className="music-artist">{t.artist}</div>
        </div>
        <div className="music-progress">
          <div className="music-bar" onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setProg(Math.round((e.clientX - r.left) / r.width * 100)) }}>
            <div className="music-fill" style={{ width: prog + '%' }} />
          </div>
          <div className="music-times"><span>{elapsed()}</span><span>{t.dur}</span></div>
        </div>
        <div className="music-controls">
          <button className="music-btn" onClick={() => { setCur(c => (c - 1 + TRACKS.length) % TRACKS.length); setProg(0) }}>⏮</button>
          <button className="music-btn play-pause" onClick={() => setPlaying(p => !p)}>{playing ? '⏸' : '▶'}</button>
          <button className="music-btn" onClick={() => { setCur(c => (c + 1) % TRACKS.length); setProg(0) }}>⏭</button>
        </div>
        <div className="volume-row">
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>🔈</span>
          <input type="range" className="volume-slider" min={0} max={100} value={vol} onChange={e => setVol(+e.target.value)} />
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>🔊</span>
        </div>
        <div className="music-list">
          {TRACKS.map((tr, i) => (
            <div key={tr.id} className={`music-track${i === cur ? ' active' : ''}`} onClick={() => { setCur(i); setProg(0); setPlaying(true) }}>
              <div className="music-track-art" style={{ background: tr.bg }}>{tr.emoji}</div>
              <div className="music-track-info">
                <div className="music-track-name">{tr.name}</div>
                <div className="music-track-artist">{tr.artist}</div>
              </div>
              <div className="music-track-dur">{tr.dur}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}