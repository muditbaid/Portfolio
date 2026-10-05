/** Floor plan in logical pixels. The canvas and the DOM hotspots both read
 *  from here, so what you see and what you click always line up. */
export const W = 160
export const H = 90
export const S = 4 // canvas pixels per logical pixel

export type Rect = { x: number; y: number; w: number; h: number }

export type DestId =
  | 'projects'
  | 'about'
  | 'papers'
  | 'skills'
  | 'experience'
  | 'now'
  | 'chat'
  | 'guestbook'
  | 'contact'
  | 'tour'
  | 'archive'

export type Destination = {
  id: DestId
  key: string
  label: string
  place: string
  hint: string
  hotspot: Rect
  /** Where the hanging room sign sits. With `end`, x is its right edge. */
  sign: { x: number; y: number; end?: boolean }
}

export const CUBICLE_X = [4, 23, 50, 69, 88]
export const CUBICLE_W = 19
export const ROW_Y = [34, 61] // top wall of each cubicle row
export const SEAT_Y = [40, 64]
export const AISLE_Y = 53
export const DOOR_X = 46 // gap between cubicles that leads to the break room

export const rooms = {
  server: { x: 2, y: 2, w: 36, h: 26 },
  break: { x: 40, y: 2, w: 34, h: 26 },
  meeting: { x: 76, y: 2, w: 32, h: 26 },
  office: { x: 110, y: 2, w: 48, h: 36 },
}

export const destinations: Destination[] = [
  {
    id: 'projects',
    key: '1',
    label: 'Projects',
    place: 'Cubicles',
    hint: 'Ten agents, seven projects. Click a desk.',
    hotspot: { x: 4, y: 30, w: 103, h: 4 },
    sign: { x: 4, y: 30 },
  },
  {
    id: 'about',
    key: '2',
    label: 'About + résumé',
    place: 'Corner office',
    hint: 'The manager. Résumé is on the desk.',
    hotspot: rooms.office,
    sign: { x: 113, y: 31 },
  },
  {
    id: 'papers',
    key: '3',
    label: 'Papers',
    place: 'Meeting room',
    hint: 'Publications, framed.',
    hotspot: rooms.meeting,
    sign: { x: 78, y: 24 },
  },
  {
    id: 'skills',
    key: '4',
    label: 'Skills',
    place: 'Server room',
    hint: 'The stack, racked and blinking.',
    hotspot: rooms.server,
    sign: { x: 22, y: 24 },
  },
  {
    id: 'experience',
    key: '5',
    label: 'Experience',
    place: 'Elevator',
    hint: 'Every previous employer is a floor below.',
    hotspot: { x: 144, y: 66, w: 14, h: 22 },
    sign: { x: 157.5, y: 70, end: true },
  },
  {
    id: 'now',
    key: '6',
    label: 'Now',
    place: 'Kanban wall',
    hint: 'What I am working on this month.',
    hotspot: { x: 112, y: 44, w: 30, h: 18 },
    sign: { x: 112, y: 40 },
  },
  {
    id: 'chat',
    key: '7',
    label: 'Chat with me',
    place: 'Water cooler',
    hint: 'Quick answers. No small talk required.',
    hotspot: rooms.break,
    sign: { x: 57, y: 25 },
  },
  {
    id: 'guestbook',
    key: '8',
    label: 'Guestbook',
    place: 'Corkboard',
    hint: 'Leave a sticky note.',
    hotspot: { x: 41, y: 3, w: 13, h: 9 },
    sign: { x: 41, y: 13 },
  },
  {
    id: 'contact',
    key: '9',
    label: 'Contact / hire',
    place: 'Mailroom',
    hint: 'Email, LinkedIn, GitHub.',
    hotspot: { x: 145, y: 42, w: 13, h: 18 },
    sign: { x: 135, y: 40 },
  },
  {
    id: 'tour',
    key: '0',
    label: 'Guided tour',
    place: 'Reception',
    hint: 'Get a visitor badge and a 60-second tour.',
    hotspot: { x: 110, y: 63, w: 30, h: 16 },
    sign: { x: 112, y: 80 },
  },
  {
    id: 'archive',
    key: 'B',
    label: 'Archive',
    place: 'Stairs to Floor B',
    hint: 'Older projects, in filing cabinets.',
    hotspot: { x: 1, y: 79, w: 24, h: 11 },
    sign: { x: 26, y: 80.5 },
  },
]

export type AgentSpec = {
  name: string
  role: string
  /** Case file this agent opens. */
  project: string
  color: string
  row: number
  cubicle: number
}

export const agentSpecs: AgentSpec[] = [
  { name: 'ROUTER-7', role: 'Expert router', project: 'symbolic-moe', color: '#e53935', row: 0, cubicle: 0 },
  { name: 'HATE-LORA', role: 'LoRA expert on ROUTER-7\'s team', project: 'symbolic-moe', color: '#8e24aa', row: 0, cubicle: 1 },
  { name: 'OFFENSE-LORA', role: 'LoRA expert on ROUTER-7\'s team', project: 'symbolic-moe', color: '#8e24aa', row: 0, cubicle: 2 },
  { name: 'BULLY-LORA', role: 'LoRA expert on ROUTER-7\'s team', project: 'symbolic-moe', color: '#8e24aa', row: 0, cubicle: 3 },
  { name: 'THREAT-LORA', role: 'LoRA expert on ROUTER-7\'s team', project: 'symbolic-moe', color: '#8e24aa', row: 0, cubicle: 4 },
  { name: 'COVERBOT', role: 'Writes unit tests', project: 'autocover-lite', color: '#43a047', row: 1, cubicle: 0 },
  { name: 'TRIAGE-9', role: 'Triages tickets', project: 'ops-copilot', color: '#1e88e5', row: 1, cubicle: 1 },
  { name: 'GREENGROWTH', role: 'Does taxes, with receipts', project: 'greengrowth', color: '#00897b', row: 1, cubicle: 2 },
  { name: 'REDTEAM', role: 'Attacks LLMs on purpose', project: 'red-teaming', color: '#c62828', row: 1, cubicle: 3 },
  { name: 'LIBRARIAN', role: 'Knows where every paper is', project: 'graphrag', color: '#6d4c41', row: 1, cubicle: 4 },
]

/** Out-of-office staff who live in the break room. */
export const breakRoom = {
  intern: { x: 60, y: 19, hotspot: { x: 58, y: 18, w: 15, h: 8 } },
  traveler: { x: 52, y: 18, project: 'tripease', hotspot: { x: 51, y: 16, w: 7, h: 10 } },
  coffee: { x: DOOR_X, y: 13 },
}

export const cubicleRect = (row: number, cubicle: number): Rect => ({
  x: CUBICLE_X[cubicle],
  y: ROW_Y[row],
  w: CUBICLE_W,
  h: 18,
})

export type Plate = { text: string; x: number; y: number; tone?: 'exit' }

/** Name plates for every area, centered on (x, y). Not clickable; the signs
 *  in `destinations` are the navigation. */
export const plates: Plate[] = [
  { text: 'Server room', x: 20, y: 28.5 },
  { text: 'Break room', x: 47, y: 28.5 },
  { text: 'Meeting room', x: 92, y: 28.5 },
  { text: 'Corner office', x: 124, y: 38.5 },
  { text: 'AI agents · click a desk', x: 46, y: 57 },
  { text: 'Kanban', x: 127, y: 63.5 },
  { text: 'Mail', x: 151.5, y: 61 },
  { text: 'Reception', x: 125, y: 78.5 },
  { text: 'Elevator', x: 151, y: 86.5 },
  { text: 'Exit ↓ Floor B', x: 36, y: 86.5, tone: 'exit' },
]
