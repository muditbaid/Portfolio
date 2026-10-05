import { floor } from '../content/floor'
import { profile } from '../content/profile'

type Props = {
  onProjects: () => void
  onResume: () => void
  onContact: () => void
  onExplore: () => void
}

/** The first thing anyone sees: who, what, and an invitation to look around. */
export function Welcome({ onProjects, onResume, onContact, onExplore }: Props) {
  return (
    <section className="window welcome" aria-labelledby="welcome-name">
      <div className="title-bar">
        <div className="title-bar-text">welcome.txt - Notepad</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" onClick={onExplore} />
        </div>
      </div>
      <div className="welcome-body">
        <div className="welcome-kicker">
          BAID Agentic Industries · {floor.name}
        </div>
        <h1 id="welcome-name">{profile.name}</h1>
        <p className="lede">
          {profile.role[0].toUpperCase() + profile.role.slice(1)}. I build {profile.pitch}.
        </p>
        <p className="aside">Every project here is an AI agent with a desk. I'm the manager. They don't listen.</p>

        <button className="explore-button default" onClick={onExplore} autoFocus>
          <span className="emoji" aria-hidden="true">
            🚶
          </span>
          Explore the office
          <span className="explore-sub">click rooms, wake the intern</span>
        </button>

        <div className="welcome-actions">
          <button onClick={onProjects}>See my work</button>
          <button onClick={onResume}>Résumé</button>
          <button onClick={onContact}>Get in touch</button>
        </div>
      </div>
      {profile.openTo && (
        <div className="status-bar">
          <p className="status-bar-field">Open to {profile.openTo}</p>
          <p className="status-bar-field">{profile.location}</p>
        </div>
      )}
    </section>
  )
}
