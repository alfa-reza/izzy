import { Suspense, lazy, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Arrow, ButtonMark } from '../components/Icons'
import { Page } from '../components/Page'
import { beads as catalogBeads, cords as catalogCords, presets, beadCategories, getBeadDef, getCordDef } from '../content/braceletCatalog'

type CordId = string
type BeadId = string
type Bracelet = { version: 1; cord: CordId; beads: BeadId[] }

const storageKey = 'izzy-bracelet-v1'
const emptyBracelet = (): Bracelet => ({ version: 1, cord: 'violet', beads: [] })

// Preserve legacy validation using expanded catalogs - ensures old saves still load
function readSaved(): { design: Bracelet; restored: boolean } {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return { design: emptyBracelet(), restored: false }
    const value: unknown = JSON.parse(raw)
    if (typeof value !== 'object' || value === null) return { design: emptyBracelet(), restored: false }
    const candidate = value as Record<string, unknown>
    const validCord = catalogCords.some((cord) => cord.id === candidate.cord)
    const validBeads =
      Array.isArray(candidate.beads) &&
      candidate.beads.length <= 12 &&
      candidate.beads.every((id: unknown) => catalogBeads.some((bead) => bead.id === id))
    if (candidate.version !== 1 || !validCord || !validBeads) return { design: emptyBracelet(), restored: false }
    return { design: { version: 1, cord: candidate.cord as CordId, beads: candidate.beads as BeadId[] }, restored: true }
  } catch {
    return { design: emptyBracelet(), restored: false }
  }
}

function BeadShape({ id }: { id: BeadId }) {
  const bead = getBeadDef(id)
  if (!bead) return null
  // Map our expanded shape names to CSS classes used for 2D preview (preserve original shapes)
  // Original CSS handles bead-round, bead-button, bead-pin, bead-heart. For new shapes we fall back to those.
  const cssShape =
    bead.shape === 'round' ? 'round' :
    bead.shape === 'button' ? 'button' :
    bead.shape === 'heart' ? 'heart' :
    bead.shape === 'pin' ? 'pin' :
    bead.shape === 'tube' ? 'pin' :
    bead.shape === 'star' ? 'star' :
    bead.shape === 'flower' ? 'flower' :
    bead.shape === 'charm' ? 'charm' : 'round'
  return (
    <span className={`bead-shape bead-${cssShape}`} style={{ '--bead-color': bead.baseColor } as CSSProperties} aria-hidden="true">
      <i /><i /><i /><i />
    </span>
  )
}

function beadLabel(id: BeadId) {
  const def = getBeadDef(id)
  if (!def) return id
  return def.name.endsWith('bead') ? def.name : `${def.name} bead`
}

// Lazy 3D canvas to keep editor responsive while 3D loads
const BraceletCanvas = lazy(() => import('../components/bracelet3d/BraceletCanvas'))

export default function MakePage() {
  const [initial] = useState(readSaved)
  const [design, setDesign] = useState<Bracelet>(initial.design)
  const [previous, setPrevious] = useState<Bracelet | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [saved, setSaved] = useState(initial.restored)
  const [confirming, setConfirming] = useState(false)
  const [message, setMessage] = useState(initial.restored ? 'Your bracelet is here from your last visit. Ooh, still shiny!' : 'A perfectly good string. What should we put on it?')
  const [autoSpin, setAutoSpin] = useState(false)
  const [activeCatalogCategory, setActiveCatalogCategory] = useState<string>('All')
  const cordRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<HTMLDivElement>(null)

  // Respect reduced motion: auto spin off if user prefers less motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) setAutoSpin(false)
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setAutoSpin(false)
    }
    if (mq.addEventListener) mq.addEventListener('change', handler)
    else mq.addListener(handler as any)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler)
      else mq.removeListener(handler as any)
    }
  }, [])

  function change(next: Bracelet, feedback: string) {
    setPrevious({ ...design, beads: [...design.beads] })
    setDesign(next)
    setSaved(false)
    setMessage(feedback)
    setConfirming(false)
  }
  function addBead(id: BeadId) {
    if (design.beads.length >= 12) {
      setMessage('This string is full. Take a bead off to try another, little trotter.')
      return
    }
    const next = [...design.beads, id]
    const def = getBeadDef(id)
    const feedback =
      next.length === 1
        ? "There! Now it's an idea. Every great bracelet starts with one."
        : next.length > 4
          ? 'Oh, look at that. They belong together! Pick a bead. Then another. Ooh, that one definitely belongs there.'
          : `${def?.name ?? id} added to your string. Try turning it around — the little details are good from every angle.`
    change({ ...design, beads: next }, feedback)
    setSelected(next.length - 1)
  }
  function removeAt(index: number) {
    if (index < 0 || index >= design.beads.length) return
    const next = design.beads.filter((_, beadIndex) => beadIndex !== index)
    change({ ...design, beads: next }, 'One bead came off. You can put it back with Undo, no worries.')
    setSelected(null)
  }
  function moveSelected(direction: -1 | 1) {
    if (selected === null) return
    const target = selected + direction
    if (target < 0 || target >= design.beads.length) return
    const next = [...design.beads]
    const tmp = next[selected]
    next[selected] = next[target]
    next[target] = tmp
    change({ ...design, beads: next }, direction < 0 ? 'That bead trotted left.' : 'That bead trotted right.')
    setSelected(target)
  }
  function undo() {
    if (!previous) return
    setDesign(previous)
    setPrevious(null)
    setSelected(null)
    setSaved(false)
    setMessage('The last change is tucked back where it was. Good as new!')
  }
  function save() {
    try {
      const payload = { ...design, savedAt: new Date().toISOString() }
      localStorage.setItem(storageKey, JSON.stringify(payload))
      setSaved(true)
      setMessage("Tucked away in this browser, just in case you come trotting back. It's here when you come back.")
    } catch {
      setSaved(false)
      setMessage("Couldn't keep that one here. But you can still make another — the table is still yours.")
    }
  }
  function reset() {
    setPrevious({ ...design, beads: [...design.beads] })
    setDesign(emptyBracelet())
    setSelected(null)
    setSaved(false)
    setConfirming(false)
    try {
      localStorage.removeItem(storageKey)
      setMessage('A fresh string! Every good idea can have a second try. Pick a bead and see what happens.')
    } catch {
      setMessage("Couldn't clear the saved one here. You can still make another.")
    }
  }

  const cord = getCordDef(design.cord) ?? catalogCords[0]
  const visibleBeads = activeCatalogCategory === 'All' ? catalogBeads : catalogBeads.filter((b) => b.category === activeCatalogCategory)

  return (
    <Page title="Make Something" description="Borrow a corner of my table and make a friendship bracelet of your own." className="make-page">
      <section className="make-intro wrap page-intro hero-enter">
        <div>
          <span className="eyebrow"><span className="eyebrow-number">03 /</span> A LITTLE ROOM AT THE TABLE</span>
          <h1>
            Ooh! Let&apos;s<br />
            <em>make something.</em>
          </h1>
        </div>
        <div className="intro-side">
          <p>
            You can start with a color, a button, or a bead that looks like it has a story. There&apos;s no wrong way to make a little something of your own.
            Borrow a corner of my workbench — everypony is welcome here.
          </p>
          <button
            type="button"
            className="button button-dark"
            onClick={() => {
              viewerRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' })
              cordRef.current?.focus({ preventScroll: true })
            }}
          >
            Start with a string <Arrow />
          </button>
          <span className="scribble" style={{ display: 'block', marginTop: 14, fontSize: '1.35rem' }}>made at my workbench, just for somepony special</span>
        </div>
      </section>

      <section className="bracelet-section">
        <div className="wrap bracelet-layout">
          {/* Left: 3D Viewer + classic 2D preview as secondary miniature */}
          <div className="bracelet-left" ref={viewerRef}>
            {/* 3D Viewer - primary */}
            <div className="bracelet-3d-intro">
              <span className="tiny-label">YOUR LITTLE CREATION — IN 3D</span>
              <p>Pick a bead. Then another. Ooh, that one definitely belongs there. Drag to turn it, scroll to peek closer.</p>
            </div>

            <Suspense fallback={<div className="bracelet-3d-loading" role="status" aria-live="polite">Sprinkling a little sparkle… your bracelet is almost ready.</div>}>
              <BraceletCanvas
                cordId={design.cord}
                beads={design.beads}
                selectedIndex={selected}
                onSelect={(idx) => {
                  setSelected(idx)
                  const def = getBeadDef(design.beads[idx])
                  setMessage(`${def?.name ?? 'That bead'} selected. Move it or take it off below — everypony loves a good arrangement.`)
                }}
                autoSpin={autoSpin}
                onAutoSpinToggle={() => setAutoSpin((v) => !v)}
                onRequestResetView={() => {}}
              />
            </Suspense>

            {/* Classic 2D board kept as secondary miniature + required for smoke tests */}
            <div className="bracelet-board" style={{ marginTop: 18 }}>
              <div className="board-top"><span className="tiny-label">YOUR LITTLE CREATION</span><ButtonMark /></div>
              <div className="bracelet-preview" style={{ '--cord-color': cord.color } as CSSProperties}>
                <div className="bracelet-loop" aria-hidden="true" />
                <div className="bracelet-beads" role="group" aria-label="Your bracelet beads">
                  {design.beads.map((id, index) => (
                    <button
                      type="button"
                      className={`preview-bead ${selected === index ? 'selected' : ''}`}
                      key={`${index}-${id}`}
                      aria-label={`Select ${beadLabel(id)} ${index + 1}`}
                      aria-pressed={selected === index}
                      onClick={() => {
                        setSelected(index)
                        const def = getBeadDef(id)
                        setMessage(`${def?.name ?? beadLabel(id)} selected. Move it or take it off below.`)
                      }}
                    >
                      <BeadShape id={id} />
                    </button>
                  ))}
                </div>
                {design.beads.length === 0 && <span className="preview-empty scribble">start anywhere</span>}
              </div>
              <div className="board-bottom"><span>{cord.name} cord</span><span>{design.beads.length} / 12 beads</span></div>
            </div>

            <p className="bracelet-feedback" aria-live="polite">{message}</p>

            <div className="bracelet-edit">
              <span className="tiny-label">TEND TO YOUR STRING</span>
              <p>Select a bead on the string or in 3D to move it or take it off. Every change is reflected on the little loop up top.</p>
              <div className="edit-actions">
                <button type="button" disabled={selected === null || selected === 0} onClick={() => moveSelected(-1)}>Move left</button>
                <button type="button" disabled={selected === null || selected === design.beads.length - 1} onClick={() => moveSelected(1)}>Move right</button>
                <button type="button" disabled={selected === null} onClick={() => selected !== null && removeAt(selected)}>Remove selected</button>
                <button type="button" disabled={!design.beads.length} onClick={() => removeAt(design.beads.length - 1)}>Remove last</button>
                <button type="button" disabled={!previous} onClick={undo}>Undo</button>
              </div>
            </div>
          </div>

          {/* Right: controls */}
          <div className="bracelet-controls">
            <div ref={cordRef} tabIndex={-1} className="choice-group">
              <span className="eyebrow">01 / CHOOSE A STRING</span>
              <h2>First, a color.</h2>
              <p>Every cord feels a little different. Which one makes you want to keep trotting?</p>
              <div className="cord-options" role="group" aria-label="Choose cord color">
                {catalogCords.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={design.cord === item.id ? 'selected' : ''}
                    aria-label={`${item.name} cord`}
                    aria-pressed={design.cord === item.id}
                    onClick={() => change({ ...design, cord: item.id }, 'That color looks happy there — made for somepony special.')}
                  >
                    <span style={{ background: item.color }} />
                    <small>{item.name}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="choice-group">
              <span className="eyebrow">02 / ADD A LITTLE SOMETHING</span>
              <h2>Now, the good bits.</h2>
              <p>Choose a piece to add it to your string. Each one was saved for a reason.</p>

              {/* Category filter */}
              <div className="bead-category-filter" role="group" aria-label="Filter by bead category">
                {['All', ...beadCategories].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={activeCatalogCategory === cat ? 'selected' : ''}
                    aria-pressed={activeCatalogCategory === cat}
                    onClick={() => setActiveCatalogCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grouped display but flat for tests: we render all visibleBeads in a grid, preserving accessible names */}
              <div className="bead-options" aria-live="polite">
                {visibleBeads.map((bead) => (
                  <button
                    type="button"
                    key={bead.id}
                    onClick={() => addBead(bead.id)}
                    disabled={design.beads.length >= 12}
                    aria-label={`Add ${beadLabel(bead.id)}`}
                  >
                    <BeadShape id={bead.id} />
                    <span>{bead.name}</span>
                    <b aria-hidden="true">+</b>
                  </button>
                ))}
              </div>
              <p className="bead-count-note">{catalogBeads.length} little bits to choose from • {design.beads.length} / 12 on your loop</p>
            </div>

            <div className="choice-group preset-group">
              <span className="eyebrow">NEED A FIRST IDEA?</span>
              <p>Try one of these little suggestions. Every preset is just a starting place — you can change every piece, somepony will love it.</p>
              <div>
                {presets.map((preset) => (
                  <button
                    type="button"
                    key={preset.name}
                    onClick={() => {
                      change({ ...preset.design, beads: [...preset.design.beads] }, `${preset.name} is on the table. Make it your own, little trotter!`)
                      setSelected(null)
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
              <p className="preset-note scribble">or mix every idea until it feels like you</p>
            </div>

            <div className="save-area">
              <button type="button" className="button button-dark" onClick={save}>Keep this one <Arrow /></button>
              <span>{saved ? 'Saved to this browser' : 'Your design stays on this device when you save.'}</span>
              <button type="button" className="plain-button" onClick={() => (design.beads.length > 1 ? setConfirming(true) : reset())}>Start again</button>
            </div>
            {confirming && (
              <div className="clear-confirm" role="group" aria-label="Confirm starting again">
                <p>Take the beads off and start again?</p>
                <button type="button" onClick={reset}>Yes, start again</button>
                <button type="button" onClick={() => setConfirming(false)}>Keep my beads</button>
              </div>
            )}
            <p className="save-note">Tucked away in this browser, just in case you come trotting back. Try turning it around. The little details are good from every angle.</p>
          </div>
        </div>
      </section>

      <section className="make-after wrap">
        <span className="scribble">a little something, just for you</span>
        <p>Okay, your turn! Start with one little bead. Then another. See? That&apos;s already becoming something made at my workbench.</p>
        <Link className="text-link" to="/creations/mistys-charm">See the bracelet I made for Misty <Arrow diagonal /></Link>
      </section>
    </Page>
  )
}
