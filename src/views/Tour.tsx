import { projects } from '../content/projects'
import type { Badge, Stop } from '../content/tours'
import { CaseFileView, ExperienceView, PapersView, ResumeDesk, SkillsView } from './Sections'

export function stopTitle(stop: Stop) {
  switch (stop.kind) {
    case 'case':
      return projects.find((p) => p.id === stop.id)?.agent ?? stop.id
    case 'papers':
      return 'Wall of papers'
    case 'experience':
      return 'Previous employers'
    case 'skills':
      return 'Server room'
    case 'resume':
      return 'Résumé desk'
    case 'note':
      return stop.title
  }
}

function StopView({ stop, onHire }: { stop: Stop; onHire: () => void }) {
  switch (stop.kind) {
    case 'case': {
      const file = projects.find((p) => p.id === stop.id)
      return file ? <CaseFileView file={file} /> : null
    }
    case 'papers':
      return <PapersView />
    case 'experience':
      return <ExperienceView />
    case 'skills':
      return <SkillsView />
    case 'resume':
      return <ResumeDesk onHire={onHire} />
    case 'note':
      return (
        <div className="case">
          <h3>{stop.title}</h3>
          {stop.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      )
  }
}

type Props = {
  badge: Badge
  step: number
  onStep: (n: number) => void
  onChangeBadge: () => void
  onFinish: () => void
  onHire: () => void
}

export function Tour({ badge, step, onStep, onChangeBadge, onFinish, onHire }: Props) {
  const last = step === badge.stops.length - 1
  return (
    <div>
      <div className="notice row" style={{ marginBottom: 8 }}>
        <span className="emoji" style={{ fontSize: 22 }} aria-hidden="true">
          {badge.icon}
        </span>
        <div>
          <div className="display" style={{ fontSize: 20 }}>
            VISITOR BADGE: {badge.label.toUpperCase()}
          </div>
          <div className="muted">access: {badge.access}</div>
        </div>
      </div>
      <div className="progress" aria-label={`Stop ${step + 1} of ${badge.stops.length}`} style={{ marginBottom: 8 }}>
        {badge.stops.map((_, i) => (
          <span key={i} className={i <= step ? 'on' : ''} />
        ))}
      </div>
      <div className="sunken" style={{ minHeight: 260 }}>
        <StopView stop={badge.stops[step]} onHire={onHire} />
      </div>
      <div className="row spread" style={{ marginTop: 8 }}>
        <button onClick={() => (step ? onStep(step - 1) : onChangeBadge())}>{step ? 'Back' : 'Change badge'}</button>
        <button onClick={onFinish}>Skip tour</button>
        <button onClick={() => (last ? onFinish() : onStep(step + 1))}>{last ? 'Explore freely' : 'Next stop'}</button>
      </div>
    </div>
  )
}
