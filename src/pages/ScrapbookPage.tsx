import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArtSlot } from '../components/ArtSlot';
import { Arrow } from '../components/Icons';
import { Page } from '../components/Page';
import { artwork, mediaUrl } from '../content/media';
import { notes, scrapbookTabs, type ScrapbookTab } from '../content/notes';

function Lightbox({ artId, onClose }: { artId: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const art = artwork[artId];
  useEffect(() => {
    const prior = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const focusable = ref.current?.querySelectorAll<HTMLElement>('button, a[href]');
        if (!focusable?.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener('keydown', onKey); prior?.focus(); };
  }, [onClose]);
  if (!art?.src) return null;
  return <div className="lightbox-backdrop" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}><div ref={ref} role="dialog" aria-modal="true" aria-label={`A closer look at ${art.label}`} className="lightbox"><button type="button" onClick={onClose}>Close picture <span aria-hidden="true">&times;</span></button><img src={mediaUrl(art.src)} alt={art.alt} /><p>{art.label}</p></div></div>;
}

export default function ScrapbookPage() {
  const [params, setParams] = useSearchParams();
  const requested = params.get('page');
  const tab: ScrapbookTab = scrapbookTabs.some((item) => item.id === requested) ? requested as ScrapbookTab : 'bridlewood';
  const [index, setIndex] = useState(0);
  const [imageReady, setImageReady] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pageNotes = notes.filter((note) => note.tab === tab);
  const currentIndex = Math.min(index, pageNotes.length - 1);
  const current = pageNotes[currentIndex];
  const currentTab = scrapbookTabs.find((item) => item.id === tab)!;
  function chooseTab(id: ScrapbookTab) { setIndex(0); setParams({ page: id }); }
  function tabKey(event: KeyboardEvent<HTMLButtonElement>, tabIndex: number) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? scrapbookTabs.length - 1 : (tabIndex + (event.key === 'ArrowRight' ? 1 : -1) + scrapbookTabs.length) % scrapbookTabs.length;
    chooseTab(scrapbookTabs[next].id);
    tabRefs.current[next]?.focus();
  }
  return (
    <Page title="My Scrapbook" description="A few little memories from Bridlewood, Maretime Bay, and the places my ideas wander." className="scrapbook-page">
      <section className="scrap-intro wrap page-intro hero-enter"><div><span className="eyebrow"><span className="eyebrow-number">04 /</span> THE SCRAPBOOK</span><h1>I kept the<br /><em>little things.</em></h1></div><div className="intro-side"><p>They're the ones I don't want to forget. A few places, a few friends, and the odd bit of paper that found its way home with me.</p><span className="scribble">go on, turn a page</span></div></section>
      <section className="scrapbook-desk"><div className="wrap scrapbook-wrap">
        <div className="scrap-tabs" role="tablist" aria-label="Scrapbook sections">{scrapbookTabs.map((item, tabIndex) => <button ref={(element) => { tabRefs.current[tabIndex] = element; }} key={item.id} id={`tab-${item.id}`} role="tab" type="button" aria-selected={tab === item.id} aria-controls="scrapbook-panel" tabIndex={tab === item.id ? 0 : -1} onClick={() => chooseTab(item.id)} onKeyDown={(event) => tabKey(event, tabIndex)}><span>0{tabIndex + 1}</span>{item.label}</button>)}</div>
        <div className="scrapbook-open" id="scrapbook-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
          <div className="scrap-index"><span className="tiny-label">A LITTLE INDEX</span><h2>{currentTab.label}</h2><p>{currentTab.intro}</p><div className="scrap-index-list">{pageNotes.map((note, noteIndex) => <button type="button" key={note.id} className={currentIndex === noteIndex ? 'active' : ''} aria-current={currentIndex === noteIndex ? 'true' : undefined} onClick={() => setIndex(noteIndex)}><span>0{noteIndex + 1}</span>{note.title}<Arrow /></button>)}</div><div className="index-thread" aria-hidden="true" /></div>
          <div className="scrap-spread" key={current.id}><div className="scrap-photo"><span className="scrap-tape" aria-hidden="true" /><ArtSlot id={current.art} onAvailabilityChange={setImageReady} /><span className="scrap-photo-note scribble">{current.annotation}</span></div><div className="scrap-writing"><span className="tiny-label">A NOTE TO REMEMBER / 0{currentIndex + 1}</span><h3>{current.title}</h3><p>{current.text}</p>{imageReady && <button type="button" className="text-link" onClick={() => setLightbox(true)}>Take a closer look <Arrow diagonal /></button>}<div className="scrap-pagination"><button type="button" disabled={currentIndex === 0} onClick={() => setIndex(currentIndex - 1)}><span aria-hidden="true">&larr;</span> Previous note</button><span>0{currentIndex + 1} / 0{pageNotes.length}</span><button type="button" disabled={currentIndex === pageNotes.length - 1} onClick={() => setIndex(currentIndex + 1)}>Next note <Arrow /></button></div></div></div>
        </div>
      </div></section>
      {lightbox && imageReady && <Lightbox artId={current.art} onClose={() => setLightbox(false)} />}
    </Page>
  );
}