import { useState } from 'react'

const styles = `
.app-notes{display:flex;height:100%;}
.notes-sidebar{width:160px;background:rgba(245,245,247,0.8);border-right:0.5px solid rgba(0,0,0,0.08);display:flex;flex-direction:column;flex-shrink:0;}
.notes-sidebar-header{padding:10px 12px;font-size:12px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:0.5px;}
.note-item{padding:8px 12px;cursor:pointer;border-bottom:0.5px solid rgba(0,0,0,0.05);}
.note-item:hover,.note-item.active{background:rgba(0,122,255,0.1);}
.note-item-title{font-size:13px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.note-item-preview{font-size:11px;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.notes-add{margin:8px;padding:6px;background:rgba(0,122,255,0.1);border:none;border-radius:6px;cursor:pointer;font-size:12px;color:#007AFF;font-weight:500;}
.notes-editor{flex:1;display:flex;flex-direction:column;}
.notes-toolbar{padding:6px 12px;border-bottom:0.5px solid rgba(0,0,0,0.06);display:flex;gap:6px;align-items:center;}
.notes-toolbar-btn{border:none;background:none;cursor:pointer;padding:3px 7px;border-radius:4px;font-size:12px;color:var(--text2);}
.notes-toolbar-btn:hover{background:rgba(0,0,0,0.06);}
.notes-textarea{flex:1;border:none;outline:none;padding:14px 16px;font-size:14px;font-family:inherit;resize:none;background:transparent;color:var(--text);line-height:1.6;}
`

export default function NotesApp() {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Lista de tarefas', body: '- Terminar o WebOS\n- Fazer commit no GitHub\n- Estudar React\n- Beber água 💧' },
    { id: 2, title: 'Idéias de projeto', body: 'WebOS 2.0:\n- App de e-mail\n- Chat em tempo real\n- Tela de login' },
    { id: 3, title: 'Atalhos rápidos', body: 'Ctrl+Space = Spotlight\nArrastar = Mover janela\nResize = Canto direito' },
  ])
  const [sel, setSel] = useState(1)
  const cur = notes.find(n => n.id === sel) || notes[0]

  const update = (body) => setNotes(ns => ns.map(n => n.id === sel ? { ...n, body } : n))
  const addNote = () => { const id = Date.now(); setNotes(ns => [...ns, { id, title: 'Nova nota', body: '' }]); setSel(id) }
  const delNote = () => { if (notes.length === 1) return; const rem = notes.filter(n => n.id !== sel); setNotes(rem); setSel(rem[0].id) }

  return (
    <>
      <style>{styles}</style>
      <div className="app-notes">
        <div className="notes-sidebar">
          <div className="notes-sidebar-header">Notas</div>
          {notes.map(n => (
            <div key={n.id} className={`note-item${n.id === sel ? ' active' : ''}`} onClick={() => setSel(n.id)}>
              <div className="note-item-title">{n.title || 'Sem título'}</div>
              <div className="note-item-preview">{n.body.slice(0, 30)}</div>
            </div>
          ))}
          <button className="notes-add" onClick={addNote}>+ Nova nota</button>
        </div>
        <div className="notes-editor">
          <div className="notes-toolbar">
            <input value={cur.title}
              onChange={e => setNotes(ns => ns.map(n => n.id === sel ? { ...n, title: e.target.value } : n))}
              style={{ border: 'none', outline: 'none', fontWeight: 600, fontSize: 14, flex: 1, background: 'transparent', color: 'var(--text)', userSelect: 'text' }} />
            <button className="notes-toolbar-btn" onClick={delNote} title="Apagar">🗑</button>
          </div>
          <textarea className="notes-textarea" value={cur.body} onChange={e => update(e.target.value)}
            placeholder="Comece a escrever..." style={{ userSelect: 'text' }} />
        </div>
      </div>
    </>
  )
}