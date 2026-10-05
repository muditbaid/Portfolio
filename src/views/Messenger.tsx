import { useEffect, useRef, useState } from 'react'
import { profile } from '../content/profile'
import { faq } from '../content/tours'

type Line = { from: 'me' | 'you'; text: string }

function answer(q: string, a: string) {
  if (q !== 'Are you open to roles?') return a
  return profile.openTo
    ? `Yes: ${profile.openTo}, based in ${profile.location}. The résumé is in the top bar, or email ${profile.email}.`
    : `Ask me directly: ${profile.email}.`
}

/** Scripted MSN-style chat. `greeting` changes when a visitor picks a badge. */
export function Messenger({ greeting }: { greeting: string | null }) {
  const [lines, setLines] = useState<Line[]>([
    { from: 'me', text: 'hey! you found the water cooler. ask me something below.' },
  ])
  const [typing, setTyping] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const timer = useRef<number>(undefined)

  useEffect(() => {
    if (greeting) setLines((l) => [...l, { from: 'me', text: greeting }])
  }, [greeting])

  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight })
  }, [lines, typing])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const ask = (i: number) => {
    if (typing) return
    const { q, a } = faq[i]
    setLines((l) => [...l, { from: 'you', text: q }])
    setTyping(true)
    timer.current = window.setTimeout(() => {
      setTyping(false)
      setLines((l) => [...l, { from: 'me', text: answer(q, a) }])
    }, 900)
  }

  return (
    <div>
      <div className="muted" style={{ marginBottom: 4 }}>
        🟢 MuditBaid (probably training a model)
      </div>
      <div className="sunken chat" ref={box} aria-live="polite">
        {lines.map((l, i) => (
          <div key={i} style={{ marginBottom: 4 }}>
            <span className={l.from === 'me' ? 'who-me' : 'who-you'}>{l.from === 'me' ? 'MuditBaid' : 'you'}:</span>{' '}
            {l.text}
          </div>
        ))}
        {typing && <div className="typing">MuditBaid is typing...</div>}
      </div>
      <div className="row" style={{ marginTop: 6 }}>
        {faq.map((f, i) => (
          <button key={f.q} onClick={() => ask(i)} disabled={typing}>
            {f.q}
          </button>
        ))}
      </div>
    </div>
  )
}
