import { useState, useEffect, useRef } from 'react'

const styles = `
.app-terminal{background:#1a1a1a;height:100%;display:flex;flex-direction:column;padding:12px;font-family:'SF Mono','Fira Code',monospace;font-size:13px;}
.term-output{flex:1;overflow-y:auto;color:#c8f3c8;line-height:1.6;}
.term-line{margin-bottom:2px;}
.term-line.cmd{color:#7ec8e3;}
.term-line.err{color:#ff6b6b;}
.term-line.info{color:#ffd700;}
.term-input-row{display:flex;align-items:center;gap:6px;border-top:0.5px solid #333;padding-top:8px;margin-top:4px;}
.term-prompt{color:#4cd964;white-space:nowrap;}
.term-input{flex:1;background:transparent;border:none;outline:none;color:#fff;font-family:inherit;font-size:13px;caret-color:#fff;user-select:text;}
`

export default function TerminalApp() {
  const [lines, setLines] = useState([
    { t: 'info', v: 'WebOS Terminal v2.0 — by Guih_Souza' },
    { t: 'info', v: 'Digite "help" para ver os comandos.' },
  ])
  const [input, setInput] = useState('')
  const [hist, setHist] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const [cwd, setCwd] = useState('/home/guih')
  const endRef = useRef(null)

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [lines])

  const run = (cmd) => {
    const c = cmd.trim()
    if (!c) return
    setHist(h => [c, ...h]); setHistIdx(-1)
    setLines(l => [...l, { t: 'cmd', v: `${cwd} $ ${c}` }])
    const parts = c.split(' ')
    const out = []
    switch (parts[0]) {
      case 'help': out.push({ t: '', v: 'ls, pwd, cd, echo, clear, whoami, date, neofetch, calc, uname, cat' }); break
      case 'ls': out.push({ t: '', v: 'Documents  Downloads  Music  Pictures  Desktop' }); break
      case 'pwd': out.push({ t: '', v: cwd }); break
      case 'cd': {
        const d = parts[1] || '/home/guih'
        if (d === '..') { const p = cwd.split('/').slice(0, -1).join('/') || '/'; setCwd(p) }
        else if (d.startsWith('/')) setCwd(d)
        else setCwd(cwd + '/' + d)
        break
      }
      case 'echo': out.push({ t: '', v: parts.slice(1).join(' ') }); break
      case 'clear': setLines([]); return
      case 'whoami': out.push({ t: '', v: 'guih_souza' }); break
      case 'date': out.push({ t: '', v: new Date().toString() }); break
      case 'uname': out.push({ t: '', v: 'WebOS 2.0 React x86_64 GNU/JS' }); break
      case 'neofetch':
        ['       ___  ____ ', '      / _ \\/ __/ ', '     / // /\\ \\   ', '    /____/___/   ', ''].forEach(v => out.push({ t: 'info', v }))
        ;[['OS', 'WebOS 2.0 React'], ['Dev', 'Guih_Souza'], ['Shell', 'WebShell 2.0'], ['Theme', 'macOS Dark'], ['Res', window.innerWidth + 'x' + window.innerHeight]]
          .forEach(([k, v]) => out.push({ t: '', v: k + ': ' + v }))
        break
      case 'calc':
        try { const r = Function('"use strict";return (' + parts.slice(1).join('') + ')')(); out.push({ t: '', v: String(r) }) }
        catch { out.push({ t: 'err', v: 'Expressão inválida' }) }
        break
      default: out.push({ t: 'err', v: `Comando não encontrado: ${parts[0]}` })
    }
    setLines(l => [...l, ...out])
  }

  const onKey = (e) => {
    if (e.key === 'Enter') { run(input); setInput('') }
    else if (e.key === 'ArrowUp') { const i = Math.min(histIdx + 1, hist.length - 1); setHistIdx(i); setInput(hist[i] || '') }
    else if (e.key === 'ArrowDown') { const i = Math.max(histIdx - 1, -1); setHistIdx(i); setInput(i >= 0 ? hist[i] : '') }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app-terminal">
        <div className="term-output">
          {lines.map((l, i) => <div key={i} className={`term-line ${l.t}`}>{l.v || '\u00a0'}</div>)}
          <div ref={endRef} />
        </div>
        <div className="term-input-row">
          <span className="term-prompt">{cwd} $</span>
          <input className="term-input" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={onKey} autoFocus spellCheck={false} />
        </div>
      </div>
    </>
  )
}