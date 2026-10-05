import { useState } from 'react'
import { useStoredState } from '../hooks/useStoredState'

type Note = { text: string; color: string }

const COLORS = ['#fff176', '#f48fb1', '#a5d6a7', '#81d4fa']
const SEED: Note[] = [
  { text: 'set the thermostat to 2.0, thank me later', color: '#a5d6a7' },
  { text: 'how is this a portfolio, this is a game', color: '#fff176' },
  { text: 'the intern is me - anon', color: '#f48fb1' },
]
const MAX = 60

/** Sticky-note wall. Notes stay in this browser for now; the AWS-backed
 *  shared, moderated wall replaces the storage later. */
export function Guestbook() {
  const [mine, setMine] = useStoredState<Note[]>('guestbook.notes', [])
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')

  const stick = () => {
    const text = draft.trim()
    if (!text) {
      setError('Write a note first.')
      return
    }
    setMine((m) => [...m, { text, color: COLORS[(SEED.length + m.length) % COLORS.length] }].slice(-6))
    setDraft('')
  }

  const notes = [...SEED, ...mine].slice(-8)

  return (
    <div>
      <div className="cork">
        {notes.map((n, i) => (
          <div key={i} className="note" style={{ background: n.color, transform: `rotate(${((i % 3) - 1) * 2}deg)` }}>
            {n.text}
          </div>
        ))}
      </div>
      <form
        className="row"
        style={{ marginTop: 6 }}
        onSubmit={(e) => {
          e.preventDefault()
          stick()
        }}
      >
        <label htmlFor="note" className="sr-only">
          Sticky note
        </label>
        <input
          id="note"
          type="text"
          maxLength={MAX}
          placeholder="leave a sticky note for Mudit"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            setError('')
          }}
          style={{ flex: 1, minWidth: 160 }}
        />
        <button type="submit">Stick it</button>
      </form>
      <div className="error" role="alert">
        {error}
      </div>
    </div>
  )
}
