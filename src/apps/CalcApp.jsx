import { useState } from 'react'

const styles = `
.app-calc{padding:16px;background:#1c1c1e;height:100%;display:flex;flex-direction:column;gap:8px;}
.calc-display{background:#000;border-radius:8px;padding:12px 16px;text-align:right;flex-shrink:0;}
.calc-expr{font-size:13px;color:#888;min-height:18px;margin-bottom:4px;}
.calc-result{font-size:36px;color:#fff;font-weight:300;word-break:break-all;}
.calc-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;flex:1;}
.calc-btn{border:none;border-radius:10px;font-size:18px;cursor:pointer;transition:filter 0.1s,transform 0.08s;aspect-ratio:1;}
.calc-btn:active{transform:scale(0.93);}
.calc-btn.op{background:#ff9f0a;color:#fff;}
.calc-btn.func{background:#505050;color:#fff;}
.calc-btn.num{background:#323232;color:#fff;}
.calc-btn.zero{grid-column:span 2;aspect-ratio:auto;border-radius:50px;padding:0 24px;text-align:left;}
.calc-btn.eq{background:#007AFF;color:#fff;}
`

export default function CalcApp() {
  const [display, setDisplay] = useState('0')
  const [expr, setExpr] = useState('')
  const [prev, setPrev] = useState(null)
  const [op, setOp] = useState(null)
  const [fresh, setFresh] = useState(false)

  const press = (val) => {
    if (val === 'C') { setDisplay('0'); setExpr(''); setPrev(null); setOp(null); setFresh(false); return }
    if (val === '±') { setDisplay(d => String(-parseFloat(d))); return }
    if (val === '%') { setDisplay(d => String(parseFloat(d) / 100)); return }
    if (['+', '-', '×', '÷'].includes(val)) {
      setPrev(parseFloat(display)); setOp(val); setFresh(true)
      setExpr(display + ' ' + val); return
    }
    if (val === '=') {
      if (prev === null || !op) return
      const a = prev, b = parseFloat(display)
      let r = a
      if (op === '+') r = a + b; if (op === '-') r = a - b
      if (op === '×') r = a * b; if (op === '÷') r = b !== 0 ? a / b : 0
      const rounded = parseFloat(r.toPrecision(10))
      setDisplay(String(rounded)); setExpr(prev + ' ' + op + ' ' + b + ' =')
      setPrev(null); setOp(null); setFresh(false); return
    }
    if (val === '.') {
      if (fresh) { setDisplay('0.'); setFresh(false); return }
      if (!display.includes('.')) setDisplay(d => d + '.'); return
    }
    if (fresh) { setDisplay(String(val)); setFresh(false) }
    else setDisplay(d => d === '0' ? String(val) : d + val)
  }

  const btns = [
    ['C', '±', '%', '÷'], ['7', '8', '9', '×'], ['4', '5', '6', '-'], ['1', '2', '3', '+'], ['0', '.', '=']
  ]

  return (
    <>
      <style>{styles}</style>
      <div className="app-calc">
        <div className="calc-display">
          <div className="calc-expr">{expr}</div>
          <div className="calc-result">{display.length > 10 ? parseFloat(display).toExponential(4) : display}</div>
        </div>
        <div className="calc-grid">
          {btns.map((row, ri) => row.map((b, ci) => {
            const isOp = ['+', '-', '×', '÷'].includes(b)
            const isFunc = ['C', '±', '%'].includes(b)
            const isZero = b === '0' && row.length === 3
            return (
              <button key={ri + '-' + ci}
                className={`calc-btn${isOp ? ' op' : isFunc ? ' func' : ''} ${b === '=' ? ' eq' : ''} ${isZero ? ' zero' : ' num'}`}
                onClick={() => press(b)}>{b}</button>
            )
          }))}
        </div>
      </div>
    </>
  )
}