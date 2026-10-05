import { useEffect, useRef } from 'react'
import { floor } from '../content/floor'
import { badges, type BadgeId } from '../content/tours'

const S = 4

function paintLobby(c: CanvasRenderingContext2D, t: number) {
  const r = (x: number, y: number, w: number, h: number, col: string) => {
    c.fillStyle = col
    c.fillRect(x * S, y * S, w * S, h * S)
  }
  for (let i = 0; i < 80; i += 4) for (let j = 0; j < 28; j += 4) r(i, j, 4, 4, ((i + j) / 4) % 2 ? '#d6c7a1' : '#cdbd94')
  // Reception desk and the receptionist bot.
  r(26, 17, 28, 7, '#8d6e63')
  r(26, 17, 28, 1, '#a1887f')
  r(39, 9, 1, 1, (t >> 3) % 2 ? '#ff5252' : '#fff')
  r(37, 10, 5, 4, '#b0bec5')
  r(38, 11, 1, 1, '#00e5ff')
  r(40, 11, 1, 1, '#00e5ff')
  r(36, 14, 7, 3, '#1565c0')
  r(46, 15, 4, 2, '#222')
  r(47, 15, 2, 1, '#4fc3f7')
  r(28, 15, 4, 2, '#eceff1')
  // Plant and elevator.
  r(64, 18, 4, 5, '#2e7d32')
  r(65, 23, 3, 3, '#a1887f')
  r(70, 9, 9, 19, '#9e9e9e')
  r(74, 9, 1, 19, '#616161')
  r(71, 7, 7, 2, '#111')
}

export function Reception({ onPick }: { onPick: (id: BadgeId) => void }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current!.getContext('2d')!
    let t = 0
    paintLobby(c, t)
    const id = window.setInterval(() => paintLobby(c, ++t), 120)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div>
      <div className="lobby-caption">BAID Agentic Industries · {floor.name} lobby</div>
      <canvas ref={ref} width={80 * S} height={28 * S} className="pixel" aria-hidden="true" />
      <p style={{ fontSize: 'clamp(16px, 0.5vw + 13px, 19px)', fontWeight: 'bold', textAlign: 'center', margin: '12px 0' }}>
        “Welcome to BAID Agentic Industries. Who's visiting today?”
      </p>
      <div className="badge-grid">
        {badges.map((b) => (
          <button key={b.id} className="badge-btn" onClick={() => onPick(b.id)}>
            <span className="icon emoji" aria-hidden="true">
              {b.icon}
            </span>
            {b.label}
          </button>
        ))}
      </div>
      <p className="muted" style={{ marginBottom: 0 }}>
        Your badge picks the tour. You can always wander everywhere, and the résumé is one click away in the top bar.
      </p>
    </div>
  )
}
