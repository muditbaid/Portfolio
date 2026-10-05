import { useEffect, useRef, useState } from 'react'
import { destinations, type DestId } from '../world/layout'

const icons: Record<DestId, string> = {
  projects: '🤖',
  about: '🧑‍💼',
  papers: '📜',
  skills: '🖥️',
  experience: '🛗',
  now: '📌',
  chat: '💬',
  guestbook: '📝',
  contact: '✉️',
  tour: '🛎️',
  archive: '🗄️',
}

export type Task = { id: string; label: string; active: boolean; onClick: () => void }

type Props = {
  tasks: Task[]
  onOpen: (dest: DestId) => void
  onBoring: () => void
}

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000)
    return () => window.clearInterval(id)
  }, [])
  return now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

type Lockable = ScreenOrientation & { lock?: (orientation: 'landscape') => Promise<void> }

/** Full screen + landscape lock works on Android browsers; iPhones don't allow it, so the button hides there. */
const canGoLandscape =
  typeof document !== 'undefined' &&
  document.fullscreenEnabled &&
  typeof (screen.orientation as Lockable | undefined)?.lock === 'function' &&
  window.matchMedia('(pointer: coarse)').matches

async function toggleLandscape() {
  if (document.fullscreenElement) {
    await document.exitFullscreen()
    return
  }
  try {
    await document.documentElement.requestFullscreen()
    await (screen.orientation as Lockable).lock?.('landscape')
  } catch {
    /* Lock refused: full screen alone still helps. */
  }
}

export function Taskbar({ tasks, onOpen, onBoring }: Props) {
  const [menu, setMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<HTMLButtonElement>(null)
  const clock = useClock()

  useEffect(() => {
    if (!menu) return
    menuRef.current?.querySelector('button')?.focus()
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (!menuRef.current?.contains(t) && !startRef.current?.contains(t)) setMenu(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenu(false)
        startRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [menu])

  const pick = (fn: () => void) => {
    setMenu(false)
    fn()
  }

  return (
    <>
      {menu && (
        <div className="window start-menu" ref={menuRef} role="menu" aria-label="Start menu">
          <div className="start-banner" aria-hidden="true">
            BAID<b>98</b>
          </div>
          <ul className="start-items">
            {destinations.map((d) => (
              <li key={d.id}>
                <button role="menuitem" onClick={() => pick(() => onOpen(d.id))}>
                  <span className="emoji" aria-hidden="true">
                    {icons[d.id]}
                  </span>
                  <span>{d.label}</span>
                  <span className="start-place">
                    <kbd>{d.key}</kbd>
                  </span>
                </button>
              </li>
            ))}
            <li className="start-sep" role="separator" />
            <li>
              <button role="menuitem" onClick={() => pick(onBoring)}>
                <span className="emoji" aria-hidden="true">
                  📄
                </span>
                <span>Boring mode (plain page)</span>
              </button>
            </li>
          </ul>
        </div>
      )}
      <nav className="taskbar" aria-label="Taskbar">
        <button
          ref={startRef}
          className="start-button"
          aria-haspopup="menu"
          aria-expanded={menu}
          onClick={() => setMenu((m) => !m)}
        >
          <span className="start-logo" aria-hidden="true">
            B98
          </span>
          Start
        </button>
        <div className="task-buttons">
          {tasks.map((t) => (
            <button key={t.id} className={t.active ? 'active' : ''} aria-pressed={t.active} onClick={t.onClick}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="tray">
          {canGoLandscape && (
            <button onClick={toggleLandscape} title="Full screen, landscape" aria-label="Full screen in landscape">
              <span className="emoji" aria-hidden="true">
                ⛶
              </span>
              <span className="tray-boring-label"> Full screen</span>
            </button>
          )}
          <button onClick={onBoring} title="Plain one-page version" aria-label="Boring mode: plain one-page version">
            <span className="emoji" aria-hidden="true">
              📄
            </span>
            <span className="tray-boring-label"> Boring mode</span>
          </button>
          <span>{clock}</span>
        </div>
      </nav>
    </>
  )
}
