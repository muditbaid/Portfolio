# BAID Agentic Industries · Floor EOD

Portfolio of **Mudit Baid**, ML engineer: LLM agents, expert routing and NLP systems.

**Live:** https://muditbaid.github.io/Portfolio/

The site is a Windows 98 desktop whose wallpaper is a live pixel-art office. Every project is an AI agent
working at a desk; rooms are the navigation (projects, résumé, papers, skills, experience, contact).
There's a plain one-page **Boring mode** in the taskbar for anyone in a hurry.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Where things live

| Path | What |
|---|---|
| `src/content/` | All the words: profile, projects (case files), experience, papers, tours, FAQ |
| `src/world/` | The office: floor plan, pixel painting, agent simulation |
| `src/views/` | Welcome window, taskbar, Start menu, dialogs, explorer, messenger, guestbook |
| `infra/` | AWS CDK stack (S3 + CloudFront + GitHub OIDC deploy role) for the future AWS home |
| `legacy/` | The 2024 portfolio |

## Deploys

- **Now:** every push to `main` publishes to GitHub Pages (`.github/workflows/pages.yml`).
- **Later:** AWS via `infra/` and `.github/workflows/deploy.yml`, see `infra/README.md`.

## Contact

[LinkedIn](https://www.linkedin.com/in/mudit--baid/) · [GitHub](https://github.com/muditbaid) · muditbaid0407@gmail.com
