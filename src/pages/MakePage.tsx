import { useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Arrow, ButtonMark } from '../components/Icons';
import { Page } from '../components/Page';

const cords = [
  { id: 'violet', name: 'Violet', color: '#8753cb' },
  { id: 'blue', name: 'Mane blue', color: '#287bd6' },
  { id: 'pink', name: 'Ribbon pink', color: '#e87cab' },
  { id: 'mint', name: 'Soft mint', color: '#79b9a6' },
  { id: 'gold', name: 'Warm yellow', color: '#d5a344' },
] as const;
const beads = [
  { id: 'button', name: 'Blue button', color: '#4c8cd9', shape: 'button' },
  { id: 'pin', name: 'Pink pin bead', color: '#e888b4', shape: 'pin' },
  { id: 'heart', name: 'Violet heart', color: '#a37ad3', shape: 'heart' },
  { id: 'pearl', name: 'Cream round bead', color: '#f5d99c', shape: 'round' },
  { id: 'mint', name: 'Mint round bead', color: '#a5d8c8', shape: 'round' },
] as const;
type CordId = (typeof cords)[number]['id'];
type BeadId = (typeof beads)[number]['id'];
type Bracelet = { version: 1; cord: CordId; beads: BeadId[] };
const storageKey = 'izzy-bracelet-v1';
const emptyBracelet = (): Bracelet => ({ version: 1, cord: 'violet', beads: [] });
const presets: { name: string; design: Bracelet }[] = [
  { name: 'For a sunny day', design: { version: 1, cord: 'gold', beads: ['pearl', 'button', 'pearl', 'pin', 'pearl'] } },
  { name: 'Bridlewood afternoon', design: { version: 1, cord: 'violet', beads: ['mint', 'heart', 'pearl', 'heart', 'mint'] } },
  { name: 'Little surprise', design: { version: 1, cord: 'blue', beads: ['button', 'pin', 'heart', 'mint', 'button'] } },
];

function readSaved(): { design: Bracelet; restored: boolean } {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { design: emptyBracelet(), restored: false };
    const value: unknown = JSON.parse(raw);
    if (typeof value !== 'object' || value === null) return { design: emptyBracelet(), restored: false };
    const candidate = value as Record<string, unknown>;
    const validCord = cords.some((cord) => cord.id === candidate.cord);
    const validBeads = Array.isArray(candidate.beads) && candidate.beads.length <= 12 && candidate.beads.every((id: unknown) => beads.some((bead) => bead.id === id));
    if (candidate.version !== 1 || !validCord || !validBeads) return { design: emptyBracelet(), restored: false };
    return { design: { version: 1, cord: candidate.cord as CordId, beads: candidate.beads as BeadId[] }, restored: true };
  } catch {
    return { design: emptyBracelet(), restored: false };
  }
}

function BeadShape({ id }: { id: BeadId }) {
  const bead = beads.find((item) => item.id === id)!;
  return <span className={`bead-shape bead-${bead.shape}`} style={{ '--bead-color': bead.color } as CSSProperties} aria-hidden="true"><i /><i /><i /><i /></span>;
}

function beadLabel(id: BeadId) {
  const name = beads.find((bead) => bead.id === id)!.name;
  return name.endsWith('bead') ? name : `${name} bead`;
}

export default function MakePage() {
  const [initial] = useState(readSaved);
  const [design, setDesign] = useState<Bracelet>(initial.design);
  const [previous, setPrevious] = useState<Bracelet | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [saved, setSaved] = useState(initial.restored);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState(initial.restored ? 'Your bracelet is here from your last visit.' : 'A perfectly good string. What should we put on it?');
  const cordRef = useRef<HTMLDivElement>(null);

  function change(next: Bracelet, feedback: string) {
    setPrevious({ ...design, beads: [...design.beads] });
    setDesign(next);
    setSaved(false);
    setMessage(feedback);
    setConfirming(false);
  }
  function addBead(id: BeadId) {
    if (design.beads.length >= 12) { setMessage('This string is full. Take a bead off to try another.'); return; }
    const next = [...design.beads, id];
    change({ ...design, beads: next }, next.length === 1 ? "There! Now it's an idea." : next.length > 4 ? 'Oh, look at that. They belong together!' : `${beads.find((bead) => bead.id === id)?.name} added to your string.`);
    setSelected(next.length - 1);
  }
  function removeAt(index: number) {
    if (index < 0 || index >= design.beads.length) return;
    const next = design.beads.filter((_, beadIndex) => beadIndex !== index);
    change({ ...design, beads: next }, 'One bead came off. You can put it back with Undo.');
    setSelected(null);
  }
  function moveSelected(direction: -1 | 1) {
    if (selected === null) return;
    const target = selected + direction;
    if (target < 0 || target >= design.beads.length) return;
    const next = [...design.beads];
    [next[selected], next[target]] = [next[target], next[selected]];
    change({ ...design, beads: next }, direction < 0 ? 'That bead moved left.' : 'That bead moved right.');
    setSelected(target);
  }
  function undo() {
    if (!previous) return;
    setDesign(previous);
    setPrevious(null);
    setSelected(null);
    setSaved(false);
    setMessage('The last change is tucked back where it was.');
  }
  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(design));
      setSaved(true);
      setMessage("Tucked away in this browser. It's here when you come back.");
    } catch {
      setSaved(false);
      setMessage("Couldn't keep that one here. But you can still make another.");
    }
  }
  function reset() {
    setPrevious({ ...design, beads: [...design.beads] });
    setDesign(emptyBracelet());
    setSelected(null);
    setSaved(false);
    setConfirming(false);
    try { localStorage.removeItem(storageKey); setMessage('A fresh string! Every good idea can have a second try.'); }
    catch { setMessage("Couldn't clear the saved one here. You can still make another."); }
  }

  const cord = cords.find((item) => item.id === design.cord)!;
  return (
    <Page title="Make Something" description="Borrow a corner of my table and make a friendship bracelet of your own." className="make-page">
      <section className="make-intro wrap page-intro hero-enter"><div><span className="eyebrow"><span className="eyebrow-number">03 /</span> A LITTLE ROOM AT THE TABLE</span><h1>Ooh! Let's<br /><em>make something.</em></h1></div><div className="intro-side"><p>You can start with a color, a button, or a bead that looks like it has a story. There's no wrong way to make a little something of your own.</p><button type="button" className="button button-dark" onClick={() => { cordRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' }); cordRef.current?.focus({ preventScroll: true }); }}>Start with a string <Arrow /></button></div></section>
      <section className="bracelet-section">
        <div className="wrap bracelet-layout">
          <div className="bracelet-left">
            <div className="bracelet-board"><div className="board-top"><span className="tiny-label">YOUR LITTLE CREATION</span><ButtonMark /></div><div className="bracelet-preview" style={{ '--cord-color': cord.color } as CSSProperties}>
              <div className="bracelet-loop" aria-hidden="true" />
              <div className="bracelet-beads" role="group" aria-label="Your bracelet beads">{design.beads.map((id, index) => <button type="button" className={`preview-bead ${selected === index ? 'selected' : ''}`} key={`${index}-${id}`} aria-label={`Select ${beadLabel(id)} ${index + 1}`} aria-pressed={selected === index} onClick={() => { setSelected(index); setMessage(`${beads.find((bead) => bead.id === id)?.name} selected. Move it or take it off below.`); }}><BeadShape id={id} /></button>)}</div>
              {design.beads.length === 0 && <span className="preview-empty scribble">start anywhere</span>}
            </div><div className="board-bottom"><span>{cord.name} cord</span><span>{design.beads.length} / 12 beads</span></div></div>
            <p className="bracelet-feedback" aria-live="polite">{message}</p>
            <div className="bracelet-edit"><span className="tiny-label">TEND TO YOUR STRING</span><p>Select a bead on the string to move it or take it off.</p><div className="edit-actions"><button type="button" disabled={selected === null || selected === 0} onClick={() => moveSelected(-1)}>Move left</button><button type="button" disabled={selected === null || selected === design.beads.length - 1} onClick={() => moveSelected(1)}>Move right</button><button type="button" disabled={selected === null} onClick={() => selected !== null && removeAt(selected)}>Remove selected</button><button type="button" disabled={!design.beads.length} onClick={() => removeAt(design.beads.length - 1)}>Remove last</button><button type="button" disabled={!previous} onClick={undo}>Undo</button></div></div>
          </div>
          <div className="bracelet-controls">
            <div ref={cordRef} tabIndex={-1} className="choice-group"><span className="eyebrow">01 / CHOOSE A STRING</span><h2>First, a color.</h2><div className="cord-options" role="group" aria-label="Choose cord color">{cords.map((item) => <button type="button" key={item.id} className={design.cord === item.id ? 'selected' : ''} aria-label={`${item.name} cord`} aria-pressed={design.cord === item.id} onClick={() => change({ ...design, cord: item.id }, 'That color looks happy there.')}><span style={{ background: item.color }} /><small>{item.name}</small></button>)}</div></div>
            <div className="choice-group"><span className="eyebrow">02 / ADD A LITTLE SOMETHING</span><h2>Now, the good bits.</h2><p>Choose a piece to add it to your string.</p><div className="bead-options">{beads.map((bead) => <button type="button" key={bead.id} onClick={() => addBead(bead.id)} disabled={design.beads.length >= 12} aria-label={`Add ${beadLabel(bead.id)}`}><BeadShape id={bead.id} /><span>{bead.name}</span><b aria-hidden="true">+</b></button>)}</div></div>
            <div className="choice-group preset-group"><span className="eyebrow">NEED A FIRST IDEA?</span><p>Try one of these little suggestions. You can change every piece.</p><div>{presets.map((preset) => <button type="button" key={preset.name} onClick={() => { change({ ...preset.design, beads: [...preset.design.beads] }, `${preset.name} is on the table. Make it your own!`); setSelected(null); }}>{preset.name}</button>)}</div></div>
            <div className="save-area"><button type="button" className="button button-dark" onClick={save}>Keep this one <Arrow /></button><span>{saved ? 'Saved to this browser' : 'Your design stays on this device when you save.'}</span><button type="button" className="plain-button" onClick={() => design.beads.length > 1 ? setConfirming(true) : reset()}>Start again</button></div>
            {confirming && <div className="clear-confirm" role="group" aria-label="Confirm starting again"><p>Take the beads off and start again?</p><button type="button" onClick={reset}>Yes, start again</button><button type="button" onClick={() => setConfirming(false)}>Keep my beads</button></div>}
          </div>
        </div>
      </section>
      <section className="make-after wrap"><span className="scribble">a little something, just for you</span><p>Okay, your turn! Start with one little bead. Then another. See? That's already becoming something.</p><Link className="text-link" to="/creations/mistys-charm">See the bracelet I made for Misty <Arrow diagonal /></Link></section>
    </Page>
  );
}