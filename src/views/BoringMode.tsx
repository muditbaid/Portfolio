import { education, experience, papers, skills } from '../content/career'
import { profile } from '../content/profile'
import { projects } from '../content/projects'

/** Recruiter-safe one-pager: same content, no agents. */
export function BoringMode({ onExit }: { onExit: () => void }) {
  return (
    <main className="boring">
      <div className="boring-inner">
        <h1>{profile.name}</h1>
        <div className="meta">
          {profile.role} · {profile.pitch} · {profile.location}
        </div>
        <p>
          <a href={`mailto:${profile.email}`}>{profile.email}</a> · <a href={profile.links.linkedin}>LinkedIn</a> ·{' '}
          <a href={profile.links.github}>GitHub</a>
          {profile.resumeUrl && (
            <>
              {' '}
              · <a href={profile.resumeUrl}>Résumé (PDF)</a>
            </>
          )}
        </p>
        {profile.bio.map((b) => (
          <p key={b}>{b}</p>
        ))}

        <h2>Selected work</h2>
        {projects.map((p) => (
          <section key={p.id}>
            <h3>
              {p.title} <span className="meta">· {p.tagline}</span>
            </h3>
            <ul>
              {p.results.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <div className="meta">
              {p.stack.join(', ')}
              {p.links.map((l) => (
                <span key={l.url}>
                  {' '}
                  · <a href={l.url}>{l.label}</a>
                </span>
              ))}
            </div>
          </section>
        ))}

        <h2>Experience</h2>
        {experience.map((j) => (
          <section key={j.org}>
            <h3>
              {j.role}, {j.org} <span className="meta">· {j.dates}</span>
            </h3>
            <ul>
              {j.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </section>
        ))}

        <h2>Publications</h2>
        <ul>
          {papers.map((p) => (
            <li key={p.url}>
              <a href={p.url}>{p.title}</a>. {p.authors}. <span className="meta">{p.venue}, {p.date}.</span>
            </li>
          ))}
        </ul>

        <h2>Education</h2>
        <ul>
          {education.map((e) => (
            <li key={e.school}>
              {e.degree}, {e.school} <span className="meta">· {e.dates} · {e.note}</span>
            </li>
          ))}
        </ul>

        <h2>Skills</h2>
        {skills.map((g) => (
          <p key={g.group} style={{ margin: '4px 0' }}>
            <strong>{g.group}:</strong> {g.items.join(', ')}
          </p>
        ))}
      </div>
      <button className="boring-toggle" onClick={onExit}>
        Back to the office
      </button>
    </main>
  )
}
