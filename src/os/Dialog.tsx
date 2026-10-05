import { useEffect, useRef, type ReactNode } from 'react'

type Props = {
  title: string
  status?: ReactNode
  onClose: () => void
  children: ReactNode
}

/** A Win98 window that pops over the office. Esc or the X closes it, and
 *  focus goes back to whatever opened it. */
export function Dialog({ title, status, onClose, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    ref.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      opener?.focus?.()
    }
  }, [onClose])

  return (
    <div className="dialog-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="window dialog" role="dialog" aria-modal="true" aria-label={title} ref={ref} tabIndex={-1}>
        <div className="title-bar">
          <div className="title-bar-text">{title}</div>
          <div className="title-bar-controls">
            <button aria-label="Close" onClick={onClose} />
          </div>
        </div>
        <div className="window-body pad dialog-body">{children}</div>
        {status && (
          <div className="status-bar">
            <p className="status-bar-field">{status}</p>
          </div>
        )}
      </div>
    </div>
  )
}
