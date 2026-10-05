import { education, experience, papers, skills } from '../content/career'
import { profile } from '../content/profile'
import type { CaseFile } from '../content/projects'

const kindLabel: Record<CaseFile['kind'], string> = {
  thesis: 'MS thesis',
  project: 'Project',
  prototype: 'Prototype',
  research: 'Research',
}

export function CaseFileView({ file }: { file: CaseFile }) {
  return (
    <article className="case">
      <div className="muted">
        Employee file: <span className="k">{file.agent}</span> · {kindLabel[file.kind]}
      </div>
      <h3>{file.title}</h3>
      <div style={{ marginBottom: 6 }}>{file.tagline}</div>

      <div className="k">Problem</div>
      <p style={{ margin: '2px 0 8px' }}>{file.problem}</p>

      <div className="k">What I built</div>
      <ul>
        {file.built.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      <div className="k">Results</div>
      <div className="metrics">
        {file.results.map((r) => (
          <div className="metric" key={r}>
            {r}
          </div>
        ))}
      </div>

      <div className="chips" style={{ marginBottom: 8 }}>
        {file.stack.map((s) => (
          <span className="chip" key={s}>
            {s}
          </span>
        ))}
      </div>

      {file.links.length > 0 && (
        <div className="row" style={{ marginBottom: 8 }}>
          {file.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
              {l.label} ↗
            </a>
          ))}
        </div>
      )}

      <div className="notice">
        <span className="k">Performance review:</span> “{file.review}”
      </div>
    </article>
  )
}

export function PapersView() {
  return (
    <div className="case">
      <h3>Wall of papers</h3>
      {papers.map((p) => (
        <div key={p.url} className="notice" style={{ marginBottom: 8 }}>
          <div className="k">{p.title}</div>
          <div>
            {p.venue}, {p.date}
          </div>
          <div className="muted">{p.authors}</div>
          <a href={p.url} target="_blank" rel="noreferrer">
            Read the paper ↗
          </a>
        </div>
      ))}
    </div>
  )
}

export function ExperienceView() {
  return (
    <div className="case">
      <h3>Previous employers</h3>
      <p className="muted" style={{ marginTop: 0 }}>
        Before managing agents, the manager was employed by humans.
      </p>
      {experience.map((j) => (
        <div key={j.org} style={{ marginBottom: 8 }}>
          <div className="row spread">
            <span>
              <span className="k">{j.org}</span> · {j.role}
            </span>
            <span className="muted">{j.dates}</span>
          </div>
          <ul>
            {j.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function SkillsView() {
  return (
    <div className="case">
      <h3>Server room</h3>
      {skills.map((g) => (
        <div key={g.group} style={{ marginBottom: 8 }}>
          <div className="k">{g.group}</div>
          <div className="chips">
            {g.items.map((s) => (
              <span className="chip" key={s}>
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ResumeDesk({ onHire }: { onHire: () => void }) {
  return (
    <div className="case">
      <h3>The résumé desk</h3>
      <p style={{ marginTop: 0 }}>{profile.bio[0]}</p>
      {profile.openTo && (
        <div className="notice" style={{ marginBottom: 8 }}>
          <span className="k">Open to:</span> {profile.openTo} · {profile.location}
        </div>
      )}
      <div className="k">Education</div>
      <ul>
        {education.map((e) => (
          <li key={e.school}>
            {e.degree}, {e.school} ({e.dates}) · {e.note}
          </li>
        ))}
      </ul>
      <div className="row">
        {profile.resumeUrl ? (
          <button onClick={() => window.open(profile.resumeUrl!, '_blank')}>Open resume.pdf</button>
        ) : (
          <button onClick={() => (location.href = `mailto:${profile.email}?subject=Resume%20request`)}>
            Email me for the PDF
          </button>
        )}
        <button onClick={onHire}>Hire the manager</button>
      </div>
    </div>
  )
}
