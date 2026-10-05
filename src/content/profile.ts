export const profile = {
  name: 'Mudit Baid',
  role: 'ML engineer',
  pitch: 'LLM agents, expert routing and NLP systems',
  title: 'Manager of agents (they don\'t listen)',
  location: 'Seattle, WA',
  email: 'muditbaid0407@gmail.com',
  links: {
    github: 'https://github.com/muditbaid',
    linkedin: 'https://www.linkedin.com/in/mudit--baid/',
  },
  // Drop a PDF at public/resume.pdf and set this to '/resume.pdf'.
  resumeUrl: null as string | null,
  // Shown on the résumé desk and in Messenger. Set to null to hide.
  openTo: 'ML / LLM engineering roles' as string | null,
  bio: [
    'I build ML systems that make decisions: routers, classifiers and agents. Lately that means getting small LLM experts to cooperate instead of one giant model doing everything.',
    'MS in Artificial Intelligence at the University of Georgia. Before that: Samsung Prism, a YC startup, insurance claims at Winjit, and agentic security tooling at CyberPosture.',
  ],
}

export type Profile = typeof profile
