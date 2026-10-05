import { useCallback, useEffect, useState } from 'react'
import { kanban } from './content/now'
import { profile } from './content/profile'
import { badges, type BadgeId } from './content/tours'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useStoredState } from './hooks/useStoredState'
import { Dialog } from './os/Dialog'
import { destinations, type DestId } from './world/layout'
import { BoringMode } from './views/BoringMode'
import { Explorer, placePath, type Place } from './views/Explorer'
import { Guestbook } from './views/Guestbook'
import { Messenger } from './views/Messenger'
import { OfficeFloor } from './views/OfficeFloor'
import { Reception } from './views/Reception'
import { ExperienceView, PapersView, ResumeDesk, SkillsView } from './views/Sections'
import { Taskbar, type Task } from './views/Taskbar'
import { Tour, stopTitle } from './views/Tour'
import { Welcome } from './views/Welcome'

type RoomId = Exclude<DestId, 'projects' | 'archive' | 'tour'>

type Open =
  | { kind: 'explorer'; place: Place }
  | { kind: 'room'; id: RoomId }
  | { kind: 'reception' }
  | { kind: 'tour'; step: number }

function HireAlert() {
  return (
    <div className="sunken" style={{ textAlign: 'center', padding: '28px 14px' }}>
      <div className="display" style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 600, color: 'var(--danger)' }}>
        HIRE THE MANAGER?
      </div>
      <p>All the agents stand up and cheer. The intern wakes up.</p>
      <div className="row" style={{ justifyContent: 'center' }}>
        <button onClick={() => (location.href = `mailto:${profile.email}?subject=Let's%20talk`)}>Email Mudit</button>
        <button onClick={() => window.open(profile.links.linkedin, '_blank')}>LinkedIn</button>
        <button onClick={() => window.open(profile.links.github, '_blank')}>GitHub</button>
      </div>
      <p className="muted">{profile.email}</p>
    </div>
  )
}

function KanbanView() {
  const colors = ['#fff176', '#f48fb1', '#a5d6a7', '#81d4fa']
  return (
    <div className="case">
      <h3>The Kanban wall</h3>
      <div className="kanban">
        {kanban.map((col) => (
          <div key={col.column}>
            <div className="k">{col.column}</div>
            {col.cards.map((c, i) => (
              <div key={c} className="note" style={{ background: colors[i % colors.length] }}>
                {c}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function AboutView({ onHire }: { onHire: () => void }) {
  return (
    <div className="case">
      <h3>{profile.name}</h3>
      <div className="muted">{profile.title}</div>
      {profile.bio.slice(1).map((b) => (
        <p key={b}>{b}</p>
      ))}
      <ResumeDesk onHire={onHire} />
    </div>
  )
}

const roomTitles: Record<RoomId, string> = {
  about: 'Corner office - About the manager',
  papers: 'Meeting room - Wall of papers',
  skills: 'Server room - Skills',
  experience: 'Elevator - Previous floors',
  now: 'Kanban.txt - Now',
  chat: 'Messenger - MuditBaid',
  guestbook: 'Guestbook.wall',
  contact: 'Mailroom - Contact',
}

export default function App() {
  const reduced = useReducedMotion()
  const [boring, setBoring] = useState(false)
  const [badgeId, setBadgeId] = useStoredState<BadgeId | null>('badge', null)
  const [open, setOpen] = useState<Open | null>(null)
  const [welcome, setWelcome] = useState(true)
  const badge = badges.find((b) => b.id === badgeId) ?? null

  const go = useCallback((id: DestId) => {
    if (id === 'projects') setOpen({ kind: 'explorer', place: { kind: 'root' } })
    else if (id === 'archive') setOpen({ kind: 'explorer', place: { kind: 'archive' } })
    else if (id === 'tour') setOpen({ kind: 'reception' })
    else setOpen({ kind: 'room', id })
  }, [])
  const openCase = useCallback((id: string) => setOpen({ kind: 'explorer', place: { kind: 'case', id } }), [])
  const close = useCallback(() => setOpen(null), [])
  const hire = () => go('contact')
  const startExploring = () => setWelcome(false)

  // Shortcuts: the keys shown on the room signs and in the Start menu.
  useEffect(() => {
    if (open || boring) return
    const onKey = (e: KeyboardEvent) => {
      const el = e.target
      if (e.ctrlKey || e.metaKey || e.altKey || (el instanceof Element && el.closest('input, textarea, [role="menu"]'))) return
      const d = destinations.find((x) => x.key.toLowerCase() === e.key.toLowerCase())
      if (d) go(d.id)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, boring, go])

  if (boring) return <BoringMode onExit={() => setBoring(false)} />

  let title = ''
  let status: string | undefined
  let body: React.ReactNode = null
  if (open?.kind === 'explorer') {
    title = `Explorer - ${placePath(open.place)}`
    body = <Explorer place={open.place} onOpen={(place) => setOpen({ kind: 'explorer', place })} onHire={hire} />
  } else if (open?.kind === 'reception') {
    title = 'Reception - Visitor check-in'
    body = (
      <Reception
        onPick={(id) => {
          setBadgeId(id)
          setOpen({ kind: 'tour', step: 0 })
        }}
      />
    )
  } else if (open?.kind === 'tour' && badge) {
    title = `Tour - ${stopTitle(badge.stops[open.step])}`
    status = `Stop ${open.step + 1} of ${badge.stops.length}`
    body = (
      <Tour
        badge={badge}
        step={open.step}
        onStep={(step) => setOpen({ kind: 'tour', step })}
        onChangeBadge={() => setOpen({ kind: 'reception' })}
        onFinish={() => {
          close()
          startExploring()
        }}
        onHire={hire}
      />
    )
  } else if (open?.kind === 'room') {
    title = roomTitles[open.id]
    body = {
      about: <AboutView onHire={hire} />,
      papers: <PapersView />,
      skills: <SkillsView />,
      experience: <ExperienceView />,
      now: <KanbanView />,
      chat: <Messenger greeting={badge?.greeting ?? null} />,
      guestbook: <Guestbook />,
      contact: <HireAlert />,
    }[open.id]
  }

  const tasks: Task[] = [
    {
      id: 'welcome',
      label: 'welcome.txt',
      active: welcome && !open,
      onClick: () => {
        setOpen(null)
        setWelcome((w) => !w || !!open)
      },
    },
  ]
  if (open && body) tasks.push({ id: 'dialog', label: title, active: true, onClick: close })

  return (
    <>
      <main className="stage">
        <OfficeFloor
          explore={!welcome}
          dimmed={welcome}
          onOpen={go}
          onCase={openCase}
          windowOpen={!!open}
          reducedMotion={reduced}
        />
        {!welcome && (
          <p className="explore-hint">
            ← Swipe to look around · tap any room or desk →
          </p>
        )}
        {welcome && (
          <Welcome
            onProjects={() => go('projects')}
            onResume={() => go('about')}
            onContact={hire}
            onExplore={startExploring}
          />
        )}
      </main>

      {open && body && (
        <Dialog title={title} status={status} onClose={close}>
          {body}
        </Dialog>
      )}

      <Taskbar tasks={tasks} onOpen={go} onBoring={() => setBoring(true)} />
    </>
  )
}
