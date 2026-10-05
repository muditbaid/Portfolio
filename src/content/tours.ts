import { floor } from './floor'

export type Stop =
  | { kind: 'case'; id: string }
  | { kind: 'papers' }
  | { kind: 'resume' }
  | { kind: 'experience' }
  | { kind: 'skills' }
  | { kind: 'note'; title: string; body: string[] }

export type BadgeId = 'recruiter' | 'engineer' | 'researcher' | 'curious'

export type Badge = {
  id: BadgeId
  label: string
  icon: string
  access: string
  greeting: string
  stops: Stop[]
}

export const badges: Badge[] = [
  {
    id: 'recruiter',
    label: 'Recruiter',
    icon: '💼',
    access: 'fast lane · impact first · about 60 seconds',
    greeting: 'Saw a recruiter badge come in. Welcome! The résumé is in the top bar whenever you want it.',
    stops: [{ kind: 'case', id: 'symbolic-moe' }, { kind: 'experience' }, { kind: 'resume' }],
  },
  {
    id: 'engineer',
    label: 'Engineer',
    icon: '⌨️',
    access: 'architecture · metrics · source code',
    greeting: 'An engineer! Ask me anything, or go straight to the code links on each case file.',
    stops: [
      { kind: 'case', id: 'symbolic-moe' },
      { kind: 'case', id: 'autocover-lite' },
      { kind: 'case', id: 'ops-copilot' },
      {
        kind: 'note',
        title: 'View source: how this site works',
        body: [
          'React 19 and TypeScript. The office is a hand-painted canvas with a tiny agent simulation; every sign and desk is a real button laid over it. Windows 98 chrome from 98.css.',
          'Next up: the real ROUTER-7 running in your browser, so you can send it a ticket.',
          'Hosted on AWS: S3 and CloudFront, with Lambda and DynamoDB for the guestbook, all deployed with CDK through GitHub OIDC.',
        ],
      },
    ],
  },
  {
    id: 'researcher',
    label: 'Researcher',
    icon: '🧪',
    access: 'papers · methods · datasets',
    greeting: 'Welcome! My papers are on the wall. Happy to talk harmful-speech measurement any time.',
    stops: [{ kind: 'papers' }, { kind: 'case', id: 'symbolic-moe' }, { kind: 'case', id: 'graphrag' }],
  },
  {
    id: 'curious',
    label: 'Just curious',
    icon: '🙂',
    access: 'all easter eggs unlocked',
    greeting: 'hi! you picked the fun badge. good choice.',
    stops: [
      {
        kind: 'note',
        title: 'Welcome to BAID Agentic Industries',
        body: [
          'Every project here is an AI agent employee with a cubicle, a job and a performance review. I am the manager. They do not listen.',
          `After the tour, poke around ${floor.name}: watch ROUTER-7 throw tickets at its experts, catch agents on coffee runs, and wake the intern on the break-room couch.`,
        ],
      },
      { kind: 'case', id: 'red-teaming' },
      {
        kind: 'note',
        title: 'Leave your mark',
        body: ['Pin a sticky note to the lobby guestbook. Some visitors leave job offers. Some leave memes. Both are welcome.'],
      },
    ],
  },
]

export const faq: { q: string; a: string }[] = [
  {
    q: 'What do you do?',
    a: 'I build ML systems that make decisions: routers, classifiers, agents. Lately, getting small LLM experts to cooperate instead of one giant model doing everything.',
  },
  { q: 'Are you open to roles?', a: '' },
  {
    q: 'Coolest project?',
    a: 'ROUTER-7, my thesis. A Naive Bayes router picks which 2 of 4 LoRA experts read each post: 90% accuracy and 40% cheaper than running all of them.',
  },
  { q: 'Why an office?', a: 'I spend my days managing AI agents. Figured I\'d make it literal.' },
  {
    q: 'Your stack?',
    a: 'Python, PyTorch, LangGraph, LoRA/PEFT, vLLM, FastAPI, Docker, AWS. And Windows 98, apparently.',
  },
]
