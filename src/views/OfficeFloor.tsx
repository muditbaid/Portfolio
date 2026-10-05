import { useEffect, useRef, useState } from 'react'
import { projects } from '../content/projects'
import { useStoredState } from '../hooks/useStoredState'
import { H, S, W, agentSpecs, breakRoom, cubicleRect, destinations, type DestId, type Rect } from '../world/layout'
import { paintFloor } from '../world/paint'
import { createWorld, drawLabels, drawScene, step, type World } from '../world/sim'

const pct = (r: Rect) => ({
  left: `${(r.x / W) * 100}%`,
  top: `${(r.y / H) * 100}%`,
  width: `${(r.w / W) * 100}%`,
  height: `${(r.h / H) * 100}%`,
})

type Tip = { text: string; sub: string; x: number; y: number } | null

/** Camera transform over the floor: translate (logical px) then scale. */
type Camera = { tx: number; ty: number; k: number }

const GLIDE_MS = 480
const CUBICLES: Rect = { x: 4, y: 34, w: 103, h: 45 }
const zoomRect = (d: DestId, hotspot: Rect) => (d === 'projects' ? CUBICLES : hotspot)

type Props = {
  /** Show the room signs. Off while the welcome window is up, to keep the first view calm. */
  explore: boolean
  dimmed: boolean
  onOpen: (dest: DestId) => void
  onCase: (projectId: string) => void
  /** A window is open over the office; when it closes, the camera zooms back out. */
  windowOpen: boolean
  reducedMotion: boolean
}

/** The animated office, drawn as the desktop wallpaper, with real buttons laid over rooms and desks. */
export function OfficeFloor({ explore, dimmed, onOpen, onCase, windowOpen, reducedMotion }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<World | null>(null)
  const [tip, setTip] = useState<Tip>(null)
  const [agentsExplained, setAgentsExplained] = useStoredState('tip.agents', false)

  useEffect(() => {
    const canvas = canvasRef.current!
    const c = canvas.getContext('2d')!

    // Pixel art is drawn small and scaled up crisply; text is drawn at full
    // screen resolution on top, so it never gets smeared by the upscale.
    const offscreen = () => {
      const el = document.createElement('canvas')
      el.width = W * S
      el.height = H * S
      return el
    }
    const bg = offscreen()
    paintFloor(bg.getContext('2d')!)
    const scene = offscreen()
    const sc = scene.getContext('2d')!

    // Size the bitmap from the frame, never from the canvas itself: a canvas's
    // own size can depend on its bitmap, which would feed back on itself.
    const frameEl = wrapRef.current!
    const fit = () => {
      const dpr = window.devicePixelRatio || 1
      const box = frameEl.getBoundingClientRect()
      const w = Math.max(1, Math.round(box.width * dpr))
      const h = Math.max(1, Math.round(box.height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
    }
    fit()
    const resize = new ResizeObserver(fit)
    resize.observe(frameEl)
    window.addEventListener('resize', fit)

    const world = createWorld()
    worldRef.current = world
    const render = () => {
      drawScene(sc, world, bg)
      c.imageSmoothingEnabled = false
      c.drawImage(scene, 0, 0, canvas.width, canvas.height)
      // Plates get too small to read on narrow screens; the signs and Start menu cover those.
      drawLabels(c, world, canvas.width / W, frameEl.clientWidth >= 560)
    }

    let raf = 0
    let interval = 0
    if (reducedMotion) {
      render()
      interval = window.setInterval(render, 1000)
    } else {
      const frame = () => {
        step(world)
        render()
        raf = requestAnimationFrame(frame)
      }
      raf = requestAnimationFrame(frame)
    }
    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(interval)
      resize.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [reducedMotion])

  const [camera, setCamera] = useState<Camera | null>(null)
  const glide = useRef(0)

  // Zoom back out once the window that a zoom opened is closed.
  const wasOpen = useRef(windowOpen)
  useEffect(() => {
    if (wasOpen.current && !windowOpen) setCamera(null)
    wasOpen.current = windowOpen
  }, [windowOpen])
  useEffect(() => () => window.clearTimeout(glide.current), [])

  /** Glide the camera onto `rect`, then run `then` (usually: open its window). */
  const zoomTo = (rect: Rect, then: () => void) => {
    if (reducedMotion || glide.current) {
      if (!glide.current) then()
      return
    }
    const frame = wrapRef.current!
    const stage = frame.parentElement!
    // What's on screen, in floor units: all of it on wide screens, a slice when the phone view pans.
    const shownW = Math.min(W, (stage.clientWidth / frame.clientWidth) * W)
    const centerX = ((stage.scrollLeft + Math.min(stage.clientWidth, frame.clientWidth) / 2) / frame.clientWidth) * W
    const k = Math.max(1, Math.min(shownW < W ? 1.8 : 2.4, (0.75 * shownW) / rect.w, (0.75 * H) / rect.h))
    const cx = rect.x + rect.w / 2
    const cy = rect.y + rect.h / 2
    const clamp = (v: number, lo: number) => Math.max(lo, Math.min(0, v))
    setCamera({ tx: clamp(centerX - k * cx, W - k * W), ty: clamp(H / 2 - k * cy, H - k * H), k })
    setTip(null)
    glide.current = window.setTimeout(() => {
      glide.current = 0
      then()
    }, GLIDE_MS)
  }

  const showTip = (e: React.MouseEvent, text: string, sub: string) => {
    const box = wrapRef.current!.getBoundingClientRect()
    setTip({ text, sub, x: e.clientX - box.left, y: e.clientY - box.top })
  }
  const hideTip = () => {
    setTip(null)
    if (worldRef.current) worldRef.current.hover = null
  }
  const project = (id: string) => projects.find((p) => p.id === id)!

  return (
    <div className={`wallpaper${dimmed ? ' dimmed' : ''}`} ref={wrapRef} onMouseLeave={hideTip}>
      <div
        className={`camera${camera ? ' zoomed' : ''}`}
        style={
          camera
            ? { transform: `translate(${(camera.tx / W) * 100}%, ${(camera.ty / H) * 100}%) scale(${camera.k})` }
            : undefined
        }
      >
        <canvas ref={canvasRef} aria-hidden="true" />

        {destinations.map((d) => (
          <button
            key={`area-${d.id}`}
            className="hotspot"
            style={pct(d.hotspot)}
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => zoomTo(zoomRect(d.id, d.hotspot), () => onOpen(d.id))}
            onMouseMove={(e) => showTip(e, `${d.place} → ${d.label}`, d.hint)}
          />
        ))}

        {agentSpecs.map((a) => (
          <button
            key={a.name}
            className="hotspot"
            style={pct(cubicleRect(a.row, a.cubicle))}
            tabIndex={explore ? 0 : -1}
            aria-label={`${a.name}, ${a.role}. Open the ${project(a.project).title} case file.`}
            onClick={() => {
              setAgentsExplained(true)
              zoomTo(cubicleRect(a.row, a.cubicle), () => onCase(a.project))
            }}
            onFocus={() => worldRef.current && (worldRef.current.hover = a.name)}
            onBlur={() => worldRef.current && (worldRef.current.hover = null)}
            onMouseMove={(e) => {
              if (worldRef.current) worldRef.current.hover = a.name
              showTip(e, `${a.name} · ${a.role}`, project(a.project).title)
            }}
          />
        ))}

        <button
          className="hotspot"
          style={pct(breakRoom.traveler.hotspot)}
          tabIndex={explore ? 0 : -1}
          aria-label="TRAVEL-AGENT, out of office. Open the Tripease case file."
          onClick={() => zoomTo(breakRoom.traveler.hotspot, () => onCase(breakRoom.traveler.project))}
          onMouseMove={(e) => showTip(e, 'TRAVEL-AGENT · out of office', 'Has planned 200 trips. Taken zero.')}
        />
        <button
          className="hotspot"
          style={pct(breakRoom.intern.hotspot)}
          tabIndex={explore ? 0 : -1}
          aria-label="The intern, asleep on the couch. Wake them up."
          onClick={() => worldRef.current && (worldRef.current.internAwake = 200)}
          onMouseMove={(e) => showTip(e, 'THE INTERN · asleep since onboarding', 'Click to wake. At your own risk.')}
        />

        {explore &&
          destinations.map((d, i) => (
            <button
              key={`sign-${d.id}`}
              className="sign"
              style={{
                ...(d.sign.end ? { right: `${((W - d.sign.x) / W) * 100}%` } : { left: `${(d.sign.x / W) * 100}%` }),
                top: `${(d.sign.y / H) * 100}%`,
                animationDelay: `${i * 40}ms`,
              }}
              onClick={() => zoomTo(zoomRect(d.id, d.hotspot), () => onOpen(d.id))}
              onMouseMove={(e) => showTip(e, `${d.place} → ${d.label}`, d.hint)}
              aria-label={`${d.label}: ${d.place}. Shortcut ${d.key}.`}
            >
              <kbd>{d.key}</kbd>
              <span className="sign-label">{d.label}</span>
            </button>
          ))}

        {explore && !agentsExplained && (
          <div className="balloon" role="status" style={{ left: `${(8 / W) * 100}%`, top: `${(49 / H) * 100}%` }}>
            <button className="balloon-close" aria-label="Dismiss" onClick={() => setAgentsExplained(true)} />
            <strong>
              <span className="emoji" aria-hidden="true">
                🤖
              </span>{' '}
              These are my AI agents
            </strong>
            <p>Each desk is an agent running one of my projects. Click a desk to open its case file.</p>
            <button onClick={() => setAgentsExplained(true)}>Got it</button>
          </div>
        )}
      </div>

      {tip && (
        <div
          className="floor-tip"
          style={{ left: Math.max(4, Math.min(tip.x + 14, (wrapRef.current?.clientWidth ?? 0) - 250)), top: tip.y + 18 }}
          role="tooltip"
        >
          <strong>{tip.text}</strong>
          <span className="muted">{tip.sub}</span>
        </div>
      )}
    </div>
  )
}
