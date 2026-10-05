import { CUBICLE_W, CUBICLE_X, H, ROW_Y, S, W, rooms } from './layout'

export type Ctx = CanvasRenderingContext2D

export function px(c: Ctx, x: number, y: number, w: number, h: number, color: string) {
  c.fillStyle = color
  c.fillRect(x * S, y * S, w * S, h * S)
}

const WALL = '#2b2b3a'
const PARTITION = '#7d7d8c'
const DESK = '#c49a6c'

/** A walled room with a door gap in its bottom wall. */
function room(c: Ctx, r: { x: number; y: number; w: number; h: number }, fill: string, door: [number, number]) {
  px(c, r.x, r.y, r.w, r.h, fill)
  px(c, r.x - 1, r.y - 1, r.w + 2, 1, WALL)
  px(c, r.x - 1, r.y + r.h, r.w + 2, 1, WALL)
  px(c, r.x - 1, r.y - 1, 1, r.h + 2, WALL)
  px(c, r.x + r.w, r.y - 1, 1, r.h + 2, WALL)
  px(c, door[0], r.y + r.h, door[1] - door[0], 1, fill)
}

/** Everything that never moves, painted once into an offscreen canvas. */
export function paintFloor(c: Ctx) {
  for (let i = 0; i < W; i += 4) for (let j = 0; j < H; j += 4) px(c, i, j, 4, 4, ((i + j) / 4) % 2 ? '#d6c7a1' : '#cdbd94')

  // Server room: racks (LEDs are animated separately).
  room(c, rooms.server, '#3a3f55', [16, 24])
  for (const rx of [6, 14, 22, 30]) px(c, rx, 5, 6, 18, '#15151d')

  // Break room: corkboard, coffee machine, water cooler, couch.
  room(c, rooms.break, '#a8794e', [43, 51])
  px(c, 41, 3, 13, 9, '#8d5a2b')
  px(c, 42, 4, 11, 7, '#b5895a')
  for (const [sx, sy, col] of [[43, 5, '#fff176'], [47, 5, '#f48fb1'], [50, 6, '#a5d6a7'], [44, 8, '#81d4fa'], [48, 8, '#fff176']] as const)
    px(c, sx, sy, 3, 2, col)
  px(c, 56, 4, 6, 8, '#37474f')
  px(c, 57, 5, 4, 2, '#90a4ae')
  px(c, 58, 9, 2, 1, '#212121')
  px(c, 65, 3, 4, 4, '#4fc3f7')
  px(c, 64, 7, 6, 6, '#eceff1')
  px(c, 66, 9, 2, 1, '#1565c0')
  px(c, 58, 19, 15, 5, '#5e35b1')
  px(c, 58, 18, 15, 2, '#7e57c2')

  // Meeting room: whiteboard, framed papers, table.
  room(c, rooms.meeting, '#7d8b99', [88, 96])
  px(c, 80, 4, 20, 7, '#fafafa')
  px(c, 82, 6, 8, 1, '#1e88e5')
  px(c, 82, 8, 12, 1, '#e53935')
  px(c, 92, 6, 6, 1, '#43a047')
  for (const fx of [101, 104]) {
    px(c, fx, 4, 3, 4, '#c9a227')
    px(c, fx + 1, 5, 1, 2, '#fff')
  }
  px(c, 84, 14, 16, 7, '#8d6e63')

  // Corner office: framed paper, desk, plant.
  room(c, rooms.office, '#5d4a7a', [120, 128])
  px(c, 114, 4, 6, 7, '#c9a227')
  px(c, 115, 5, 4, 5, '#fff')
  px(c, 116, 6, 2, 1, '#1565c0')
  px(c, 124, 20, 22, 4, '#8d6e63')
  px(c, 128, 19, 4, 2, '#222')
  px(c, 129, 19, 2, 1, '#4fc3f7')
  px(c, 138, 20, 4, 1, '#ffd54f')
  px(c, 151, 28, 3, 3, '#43a047')
  px(c, 154, 27, 3, 3, '#388e3c')
  px(c, 151, 31, 5, 4, '#a1887f')

  // Cubicles.
  for (const cx of CUBICLE_X) {
    const [a, b] = ROW_Y
    px(c, cx, a, CUBICLE_W, 1, PARTITION)
    px(c, cx, a, 1, 18, PARTITION)
    px(c, cx + CUBICLE_W - 1, a, 1, 18, PARTITION)
    px(c, cx + 3, a + 3, 13, 3, DESK)
    px(c, cx, b + 18, CUBICLE_W, 1, PARTITION)
    px(c, cx, b, 1, 19, PARTITION)
    px(c, cx + CUBICLE_W - 1, b, 1, 19, PARTITION)
    px(c, cx + 3, b + 11, 13, 3, DESK)
  }

  // Kanban wall.
  px(c, 112, 44, 30, 18, '#a77b4f')
  for (const [sx, sy, col] of [[114, 47, '#fff176'], [121, 47, '#f48fb1'], [128, 47, '#a5d6a7'], [135, 47, '#fff176'], [114, 54, '#a5d6a7'], [121, 54, '#fff176'], [135, 54, '#f48fb1']] as const)
    px(c, sx, sy, 5, 5, col)

  // Mailroom pigeonholes.
  px(c, 146, 44, 11, 15, '#6d4c41')
  for (let r = 0; r < 3; r++) for (let k = 0; k < 2; k++) {
    px(c, 147 + k * 5, 45 + r * 5, 4, 4, '#3e2723')
    if ((r + k) % 2 === 0) px(c, 148 + k * 5, 47 + r * 5, 2, 2, '#fafafa')
  }

  // Reception desk, welcome mat.
  px(c, 113, 71, 24, 5, '#8d6e63')
  px(c, 113, 71, 24, 1, '#a1887f')
  px(c, 130, 70, 3, 1, '#eceff1')
  px(c, 118, 82, 14, 4, '#b71c1c')

  // Elevator.
  px(c, 144, 66, 14, 22, '#9e9e9e')
  px(c, 150, 67, 2, 21, '#616161')

  paintStairs(c)
}

/** A stairwell going down to Floor B: steps narrow and darken with depth. */
function paintStairs(c: Ctx) {
  const x = 2
  const y = 80
  const w = 22
  const h = 10
  // Well frame and the dark void below.
  px(c, x - 1, y - 1, w + 2, h + 1, WALL)
  px(c, x, y, w, h, '#120d0b')

  const treads = ['#d7b48a', '#c19a6b', '#a47c52', '#86623e', '#6a4c2f', '#4e3722']
  const risers = ['#8d6e4f', '#765a3e', '#5f4630', '#4a3624', '#38281a', '#271b11']
  for (let k = 0; k < treads.length; k++) {
    const inset = k * 1.25
    const ty = y + 0.5 + k * 1.5
    const tw = w - 1 - inset * 2
    px(c, x + 0.5 + inset, ty, tw, 0.75, treads[k])
    px(c, x + 0.5 + inset, ty + 0.75, tw, 0.85, risers[k])
    // Step nosing highlight.
    px(c, x + 0.5 + inset, ty, tw, 0.25, '#e8cba4')
  }

  // Handrails following the steps down, with posts.
  for (let i = 0; i <= 13; i++) {
    const dx = i * 0.55
    const dy = i * 0.66
    px(c, x + 0.25 + dx, y + 0.25 + dy, 0.5, 0.5, '#cfd8dc')
    px(c, x + w - 0.75 - dx, y + 0.25 + dy, 0.5, 0.5, '#cfd8dc')
  }
  for (const k of [0, 3]) {
    px(c, x + 0.25 + k * 2.2, y + 0.5 + k * 2.7, 0.5, 1.5, '#90a4ae')
    px(c, x + w - 0.75 - k * 2.2, y + 0.5 + k * 2.7, 0.5, 1.5, '#90a4ae')
  }

  // Safety stripe on the top edge.
  for (let i = 0; i < w; i += 2) px(c, x + i, y - 1, 1, 0.75, '#fbc02d')
}
