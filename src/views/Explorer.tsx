import { floor } from '../content/floor'
import { archive, projects } from '../content/projects'
import { CaseFileView, ExperienceView, PapersView, ResumeDesk, SkillsView } from './Sections'

export type Place =
  | { kind: 'root' }
  | { kind: 'case'; id: string }
  | { kind: 'archive' }
  | { kind: 'papers' }
  | { kind: 'experience' }
  | { kind: 'skills' }
  | { kind: 'resume' }

const folders: { kind: Exclude<Place['kind'], 'root' | 'case'>; label: string; icon: string }[] = [
  { kind: 'resume', label: 'Résumé desk', icon: '🗂️' },
  { kind: 'experience', label: 'Previous employers', icon: '🏢' },
  { kind: 'papers', label: 'Wall of papers', icon: '📜' },
  { kind: 'skills', label: 'Server room', icon: '🖥️' },
  { kind: 'archive', label: 'Floor B (archive)', icon: '🗄️' },
]

export function placePath(place: Place) {
  if (place.kind === 'root') return `C:\\${floor.name}\\`
  if (place.kind === 'case') return `C:\\${floor.name}\\${projects.find((p) => p.id === place.id)?.agent}\\README.txt`
  return `C:\\${floor.name}\\${folders.find((f) => f.kind === place.kind)?.label}\\`
}

type Props = { place: Place; onOpen: (p: Place) => void; onHire: () => void }

export function Explorer({ place, onOpen, onHire }: Props) {
  return (
    <div>
      <div className="row" style={{ marginBottom: 8 }}>
        <button onClick={() => onOpen({ kind: 'root' })} disabled={place.kind === 'root'}>
          Up
        </button>
        <div className="sunken" style={{ flex: 1, padding: '2px 6px' }}>
          {placePath(place)}
        </div>
      </div>
      <div className="sunken" style={{ minHeight: 300 }}>
        {place.kind === 'root' && (
          <>
            <p className="muted" style={{ marginTop: 0 }}>
              <span className="k">{floor.name}:</span> {floor.tagline} Every desk belongs to an agent, and every agent
              works one of my projects. Open a file.
            </p>
            <div className="icon-grid">
              {projects.map((p) => (
                <button key={p.id} className="file-icon" onClick={() => onOpen({ kind: 'case', id: p.id })}>
                  <span className="emoji" style={{ fontSize: 28 }} aria-hidden="true">
                    🤖
                  </span>
                  <span className="file-label">{p.agent}</span>
                  <span className="muted file-label">{p.title}</span>
                </button>
              ))}
              {folders.map((f) => (
                <button key={f.kind} className="file-icon" onClick={() => onOpen({ kind: f.kind })}>
                  <span className="emoji" style={{ fontSize: 28 }} aria-hidden="true">
                    {f.icon}
                  </span>
                  <span className="file-label">{f.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
        {place.kind === 'case' && <CaseFileView file={projects.find((p) => p.id === place.id)!} />}
        {place.kind === 'papers' && <PapersView />}
        {place.kind === 'experience' && <ExperienceView />}
        {place.kind === 'skills' && <SkillsView />}
        {place.kind === 'resume' && <ResumeDesk onHire={onHire} />}
        {place.kind === 'archive' && (
          <div className="case">
            <h3>Floor B: the archive</h3>
            <p className="muted" style={{ marginTop: 0 }}>
              Dusty filing cabinets. One of them hums. ARCHIVIST commutes from here.
            </p>
            <ul>
              {archive.map((a) => (
                <li key={a.title}>
                  {a.url ? (
                    <a href={a.url} target="_blank" rel="noreferrer">
                      {a.title}
                    </a>
                  ) : (
                    a.title
                  )}{' '}
                  <span className="muted">
                    ({a.year}) · {a.note}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
