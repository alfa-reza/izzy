import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Arrow, ButtonMark } from '../components/Icons';
import { Page } from '../components/Page';

const sets = [
  {
    id: 'ribbon', label: 'Loose ribbon + button + spare thread', short: 'Ribbon, button & thread',
    noticed: "This ribbon's too short for a bow. But look at that little button. Hmm...",
    tried: 'Loop the ribbon through the button and fasten it with a little spare thread.',
    outcome: 'A bookmark charm! Small enough for a pocket, bright enough not to lose.', result: 'A bookmark charm',
  },
  {
    id: 'frame', label: 'Bent frame + colored scraps', short: 'A frame & colored scraps',
    noticed: "That frame needs a little help. I've got scraps that might fit the corners.",
    tried: 'Straighten the frame, then cover the worn corners with the colored scraps.',
    outcome: 'Much better. Now it can hold a memory again.', result: 'A mended frame',
  },
  {
    id: 'tin', label: 'Old tin + a little pile of found bits', short: 'An old tin & found bits',
    noticed: "It's a tin. It's a little dented. It's also exactly the size of all my loose buttons.",
    tried: 'Tidy the tin and use the found bits to give the lid a little character.',
    outcome: "A treasure keeper! Which is a fancy way of saying I'll finally know where my buttons are.", result: 'A keepsake tin',
  },
];

export default function WorkshopPage() {
  const [selected, setSelected] = useState(0);
  const [assembled, setAssembled] = useState(false);
  const current = sets[selected];

  function choose(index: number) {
    setSelected(index);
    setAssembled(false);
  }

  return (
    <Page title="The Workshop" description="Take a peek at my uni-cycling table and try an idea with a few found things." className="workshop-page">
      <section className="workshop-intro wrap page-intro hero-enter">
        <div><span className="eyebrow"><span className="eyebrow-number">01 /</span> COME ON IN</span><h1>Welcome to the<br /><em>wonderful mess.</em></h1></div>
        <div className="intro-side"><p>I call it uni-cycling! Take something that's been forgotten, find the part worth keeping, and see what else it can be.</p><span className="scribble">mind the ribbon pile!</span></div>
      </section>
      <section className="workshop-table-section">
        <div className="wrap workshop-table-heading"><div><span className="eyebrow">THE MATERIAL TABLE</span><h2>Every piece is a <em>maybe.</em></h2></div><p>I don't always know what I'm making when I start. Usually I just know this bit is too interesting to throw away.</p></div>
        <div className="wrap workshop-app">
          <div className={`workshop-scene scene-${current.id} ${assembled ? 'is-assembled' : ''}`} role="img" aria-label={`${current.short}. ${assembled ? current.result : 'Pieces ready to try.'}`}>
            <div className="scene-paper" />
            <div className="scene-grid" />
            <span className="scene-label">{assembled ? 'AN IDEA TO TRY' : 'A FEW INTERESTING BITS'}</span>
            <div className="scene-object object-a"><i /><i /><i /><i /></div><div className="scene-object object-b"><i /><i /></div><div className="scene-object object-c"><i /><i /><i /><i /></div>
            <div className="scene-result-name">{assembled ? current.result : 'What could these be?'}</div>
            <span className="scene-scribble scribble">{assembled ? 'look at that!' : 'hmm...'}</span>
          </div>
          <div className="workshop-controls">
            <span className="eyebrow">A LITTLE EXPERIMENT</span><h3>Pick a pile.</h3>
            <p>These are ideas for you to try, not things from my shelf. Choose a few pieces and let's see what they could become.</p>
            <fieldset className="material-options"><legend>Choose your materials</legend>
              {sets.map((set, index) => <label className={`material-option ${selected === index ? 'selected' : ''}`} key={set.id}><input type="radio" name="materials" checked={selected === index} onChange={() => choose(index)} /><span className="radio-mark" /><span>{set.label}</span><span className="material-index">0{index + 1}</span></label>)}
            </fieldset>
            <div className="workshop-actions"><button type="button" className="button button-dark" onClick={() => setAssembled(true)} disabled={assembled}>Try this idea <Arrow /></button><button type="button" className="plain-button" onClick={() => setAssembled(false)} disabled={!assembled}>Take it apart</button></div>
            <button type="button" className="next-idea" onClick={() => choose((selected + 1) % sets.length)}>Try another little idea <Arrow /></button>
          </div>
        </div>
        <div className="wrap assembly-notes" aria-live="polite">
          <div><span>01 / I NOTICED</span><p>{current.noticed}</p></div><div><span>02 / I TRIED</span><p>{current.tried}</p></div><div><span>03 / IT COULD BECOME</span><p>{assembled ? current.outcome : 'Try the idea to see where these pieces might go.'}</p></div>
        </div>
      </section>
      <section className="drawer-section wrap section-pad" data-reveal>
        <div className="drawer-title"><span className="eyebrow">A PEEK IN MY DRAWER</span><h2>Things I might<br /><em>need later.</em></h2><p>Every piece is a maybe. Especially the little ones.</p><Link className="text-link" to="/creations">See what I've made <Arrow diagonal /></Link></div>
        <div className="drawer-list"><div><span>01</span><strong>A button without a coat</strong><small>Still very buttony.</small></div><div><span>02</span><strong>A twist of blue thread</strong><small>Just enough, probably.</small></div><div><span>03</span><strong>One not-quite-flat tin</strong><small>Excellent button potential.</small></div><div><span>04</span><strong>A perfectly good ribbon</strong><small>Obviously a keeper.</small></div><ButtonMark className="drawer-button" /></div>
      </section>
    </Page>
  );
}