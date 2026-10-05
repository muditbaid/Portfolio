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

type Props = {
  /** Show the room signs. Off while the welcome window is up, to keep the first view calm. */
  explore: boolean
  dimmed: boolean
  onOpen: (dest: DestId) => void
  onCase: (projectId: string) => void
  reducedMotion: boolean
}

/** The animated office, drawn as the desktop wallpaper, with real buttons laid over rooms and desks. */
export function OfficeFloor({ explore, dimmed, onOpen, onCase, reducedMotion }: Props) {
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
      <canvas ref={canvasRef} aria-hidden="true" />

      {destinations.map((d) => (
        <button
          key={`area-${d.id}`}
          className="hotspot"
          style={pct(d.hotspot)}
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => onOpen(d.id)}
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
            onCase(a.project)
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
        onClick={() => onCase(breakRoom.traveler.project)}
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
            onClick={() => onOpen(d.id)}
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
