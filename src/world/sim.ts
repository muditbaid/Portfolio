import { AISLE_Y, CUBICLE_X, DOOR_X, ROW_Y, S, SEAT_Y, agentSpecs, breakRoom, plates, type AgentSpec } from './layout'
import { px, type Ctx } from './paint'

type State = 'type' | 'walk' | 'coffee' | 'blocked'

export type Agent = AgentSpec & {
  x: number
  y: number
  seatX: number
  seatY: number
  state: State
  timer: number
  path: { x: number; y: number }[]
  goal: 'coffee' | 'seat'
  say: string
  sayFor: number
  stamp: number
}

type Ticket = { from: Agent; to: Agent; t: number }

export type World = {
  t: number
  agents: Agent[]
  tickets: Ticket[]
  nextTicket: number
  internAwake: number
  hover: string | null
}

const LINES = ['ship it', 'LGTM', 'who touched my prompt?', 'works on my GPU', 'per my last email', 'circling back', 'lunch?', 'EOD, promise']

export function createWorld(): World {
  return {
    t: 0,
    tickets: [],
    nextTicket: 120,
    internAwake: 0,
    hover: null,
    agents: agentSpecs.map((a) => {
      const seatX = CUBICLE_X[a.cubicle] + 7
      const seatY = SEAT_Y[a.row]
      return { ...a, x: seatX, y: seatY, seatX, seatY, state: 'type', timer: 0, path: [], goal: 'seat', say: '', sayFor: 0, stamp: 0 }
    }),
  }
}

const rand = Math.random

export function step(w: World) {
  w.t++
  const [router, ...rest] = w.agents
  const experts = rest.filter((a) => a.project === 'symbolic-moe')
  const walkers = rest.filter((a) => a.project !== 'symbolic-moe')

  for (const a of w.agents) {
    if (a.sayFor) a.sayFor--
    if (a.stamp) a.stamp--
    if (a.state === 'walk') {
      const p = a.path[0]
      if (!p) {
        a.state = a.goal === 'coffee' ? 'coffee' : 'type'
        a.timer = 220
        continue
      }
      const dx = p.x - a.x
      const dy = p.y - a.y
      if (Math.abs(dx) > 0.4) a.x += Math.sign(dx) * 0.4
      else if (Math.abs(dy) > 0.4) a.y += Math.sign(dy) * 0.4
      else {
        a.x = p.x
        a.y = p.y
        a.path.shift()
      }
    } else if (a.state === 'coffee') {
      if (--a.timer <= 0) {
        a.state = 'walk'
        a.goal = 'seat'
        a.path = [{ x: DOOR_X, y: AISLE_Y }, { x: a.seatX, y: AISLE_Y }, { x: a.seatX, y: a.seatY }]
      }
    } else if (a.state === 'blocked') {
      if (--a.timer <= 0) a.state = 'type'
    }
  }

  // Only the walkers wander; the routing team stays at their desks.
  for (const a of walkers) {
    if (a.state !== 'type') continue
    const onBreak = walkers.filter((z) => z.goal === 'coffee' && z.state !== 'type').length
    if (rand() < 0.0012 && onBreak < 2) {
      a.state = 'walk'
      a.goal = 'coffee'
      a.path = [{ x: a.seatX, y: AISLE_Y }, { x: DOOR_X, y: AISLE_Y }, { x: DOOR_X, y: breakRoom.coffee.y + ((rand() * 4) | 0) }]
    } else if (rand() < 0.0005) {
      a.state = 'blocked'
      a.timer = 260
    }
  }

  if (w.t % 90 === 0) {
    const typing = w.agents.filter((a) => a.state === 'type' && !a.stamp && !a.sayFor)
    if (typing.length) {
      const a = typing[(rand() * typing.length) | 0]
      a.say = LINES[(rand() * LINES.length) | 0]
      a.sayFor = 110
    }
  }

  // ROUTER-7 sends each ticket to its top-2 experts.
  if (--w.nextTicket <= 0) {
    w.nextTicket = 200 + ((rand() * 160) | 0)
    const picks = [...experts].sort(() => rand() - 0.5).slice(0, 2)
    for (const e of picks) w.tickets.push({ from: router, to: e, t: 0 })
  }
  for (const k of w.tickets) {
    k.t += 0.02
    if (k.t >= 1) k.to.stamp = 80
  }
  w.tickets = w.tickets.filter((k) => k.t < 1)
  if (w.internAwake) w.internAwake--
}

function bot(c: Ctx, x: number, y: number, shirt: string, t: number, opts: { walking?: boolean; asleep?: boolean; typing?: boolean; facingDown?: boolean; cup?: boolean }) {
  const X = Math.round(x)
  const Y = Math.round(y)
  px(c, X + 2, Y - 1, 1, 1, t % 40 < 20 ? '#ff5252' : '#fff')
  px(c, X + 1, Y, 3, 3, '#b0bec5')
  const eye = opts.asleep ? '#607d8b' : '#00e5ff'
  px(c, X + 1, Y + 1, 1, 1, eye)
  px(c, X + 3, Y + 1, 1, 1, eye)
  px(c, X, Y + 3, 5, 3, shirt)
  const stride = opts.walking && (t >> 3) % 2 === 1
  px(c, X + 1, Y + 6, 1, 1, stride ? '#555' : '#222')
  px(c, X + 3, Y + 6, 1, 1, stride ? '#222' : '#555')
  if (opts.typing && (t >> 2) % 2) px(c, opts.facingDown ? X + 4 : X, Y + 4, 1, 1, '#b0bec5')
  if (opts.cup) px(c, X + 5, Y + 3, 1, 2, '#fff')
}

/** The pixel layer, drawn at low resolution and scaled up without smoothing. */
export function drawScene(c: Ctx, w: World, background: HTMLCanvasElement) {
  const t = w.t
  c.drawImage(background, 0, 0)

  // Server LEDs.
  ;[6, 14, 22, 30].forEach((rx, i) => {
    for (let k = 0; k < 6; k++) {
      const on = Math.sin(t * 0.07 * (k + 1) + i * 3) > 0.2
      const alarm = Math.sin(t * 0.05 + k + i) > 0.92
      px(c, rx + 1 + (k % 2) * 3, 7 + k * 3, 1, 1, on ? '#00e676' : alarm ? '#ff1744' : '#1b5e20')
    }
  })

  // Monitors glow while their owner is at the desk.
  for (const a of w.agents) {
    const cx = CUBICLE_X[a.cubicle]
    const my = a.row ? ROW_Y[1] + 11 : ROW_Y[0] + 1
    const busy = a.state === 'type' || a.state === 'blocked'
    px(c, cx + 7, my, 5, 3, '#222')
    px(c, cx + 8, my, 3, 2, a.state === 'blocked' ? '#2962ff' : busy ? ((t >> 3) % 3 ? '#4fc3f7' : '#81d4fa') : '#263238')
  }

  // Receptionist bot and the manager.
  bot(c, 123, 64, '#1565c0', t, { typing: true, facingDown: true })
  px(c, 132, 11, 3, 1, '#2b1d0e')
  px(c, 132, 12, 3, 2, '#e0ac69')
  px(c, 131, 14, 5, 3, '#263238')
  px(c, 133, 14, 1, 3, '#c62828')

  // Break room regulars.
  const { intern, traveler } = breakRoom
  bot(c, traveler.x, traveler.y, '#ff7043', t, {})
  px(c, traveler.x + 5, traveler.y + 4, 3, 3, '#6d4c41')
  px(c, intern.x + 2, intern.y - 1, 6, 3, '#b0bec5')
  px(c, intern.x + 8, intern.y - 1, 4, 3, '#fbc02d')

  for (const a of w.agents)
    bot(c, a.x, a.y, a.color, t, {
      walking: a.state === 'walk',
      typing: a.state === 'type',
      facingDown: a.row === 1,
      cup: a.state === 'coffee' || (a.goal === 'seat' && a.state === 'walk'),
    })

  for (const k of w.tickets) {
    const fx = k.from.x + 2
    const fy = k.from.y
    const tx = k.to.x + 2
    const ty = k.to.y
    const x = fx + (tx - fx) * k.t
    const y = fy + (ty - fy) * k.t - Math.sin(k.t * Math.PI) * 12
    px(c, x, y, 2, 2, '#fff')
    px(c, x, y + 1, 2, 1, '#ffd54f')
  }

  if (w.hover) {
    const a = w.agents.find((z) => z.name === w.hover)
    if (a) {
      c.strokeStyle = '#ffeb3b'
      c.lineWidth = 2
      c.strokeRect((Math.round(a.x) - 1) * S, (Math.round(a.y) - 2) * S, 7 * S, 10 * S)
    }
  }
}

const LABEL_FONT = 'Tahoma, Verdana, "Segoe UI", sans-serif'

/** Text layer, drawn at the screen's real resolution so it stays sharp.
 *  `unit` is device pixels per logical floor pixel. */
export function drawLabels(c: Ctx, w: World, unit: number, showPlates: boolean) {
  const t = w.t
  if (showPlates) {
    drawPlates(c, unit)
    drawDeskCards(c, w, unit)
  }

  const size = Math.max(11, Math.round(unit * 2.2))
  const pad = Math.round(size * 0.35)
  c.font = `bold ${size}px ${LABEL_FONT}`
  c.textBaseline = 'middle'

  const bubble = (x: number, y: number, text: string, fill = '#fff') => {
    const tw = c.measureText(text).width
    const bw = tw + pad * 2
    const bh = size + pad * 1.4
    const bx = Math.max(2, Math.min(c.canvas.width - bw - 2, (x + 2.5) * unit - bw / 2))
    const by = (y - 1.5) * unit - bh
    c.fillStyle = '#000'
    c.fillRect(bx - 2, by - 2, bw + 4, bh + 4)
    c.fillStyle = fill
    c.fillRect(bx, by, bw, bh)
    c.fillStyle = '#111'
    c.fillText(text, bx + pad, by + bh / 2 + 1)
  }

  for (const a of w.agents) {
    if (a.state === 'blocked') bubble(a.x, a.y, '?')
    else if (a.stamp) bubble(a.x, a.y, 'FLAG', '#ffcdd2')
    else if (a.state === 'coffee') bubble(a.x, a.y, 'brb')
    else if (a.sayFor) bubble(a.x, a.y, a.say)
  }
  const { intern } = breakRoom
  bubble(intern.x + 4, intern.y, w.internAwake ? 'huh? what year is it' : 'z'.repeat(1 + ((t >> 5) % 3)))
  if ((t >> 6) % 7 === 0) bubble(132, 11, 'status update?')

}

/** Small engraved name plates, one per area of the floor. */
function drawPlates(c: Ctx, unit: number) {
  const size = Math.max(10, Math.round(unit * 1.5))
  const padX = Math.round(size * 0.5)
  const h = Math.round(size * 1.5)
  c.font = `bold ${size}px ${LABEL_FONT}`
  c.textBaseline = 'middle'
  c.textAlign = 'center'
  for (const p of plates) {
    const text = p.text.toUpperCase()
    const tw = c.measureText(text).width + size * 0.08 * text.length
    const bw = tw + padX * 2
    const cx = p.x * unit
    const cy = p.y * unit
    const exit = p.tone === 'exit'
    c.fillStyle = exit ? '#0b5d1e' : 'rgba(22, 22, 34, 0.88)'
    c.fillRect(cx - bw / 2, cy - h / 2, bw, h)
    c.strokeStyle = exit ? '#7cff9a' : 'rgba(255, 255, 255, 0.35)'
    c.lineWidth = Math.max(1, Math.round(unit * 0.15))
    c.strokeRect(cx - bw / 2 + 0.5, cy - h / 2 + 0.5, bw - 1, h - 1)
    c.fillStyle = exit ? '#d9ffe1' : '#e6e6e6'
    c.letterSpacing = `${(size * 0.08).toFixed(1)}px`
    c.fillText(text, cx, cy + 1)
    c.letterSpacing = '0px'
  }
  c.textAlign = 'left'
}

/** A name card on every desk, so the bots read as named employees. */
function drawDeskCards(c: Ctx, w: World, unit: number) {
  const size = Math.max(9, Math.round(unit * 1.1))
  const h = Math.round(size * 1.35)
  c.font = `bold ${size}px ${LABEL_FONT}`
  c.textBaseline = 'middle'
  c.textAlign = 'center'
  for (const a of w.agents) {
    const cx = (CUBICLE_X[a.cubicle] + 9.5) * unit
    const cy = (a.row ? ROW_Y[1] + 14.6 : ROW_Y[0] + 4.4) * unit
    const bw = c.measureText(a.name).width + size * 0.8
    c.fillStyle = '#fffde7'
    c.fillRect(cx - bw / 2, cy - h / 2, bw, h)
    c.fillStyle = a.color
    c.fillRect(cx - bw / 2, cy - h / 2, Math.max(2, Math.round(unit * 0.35)), h)
    c.fillStyle = '#1a1a1a'
    c.fillText(a.name, cx + unit * 0.15, cy + 1)
  }
  c.textAlign = 'left'
}
