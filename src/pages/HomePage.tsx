import { Link } from 'react-router-dom';
import { ArtSlot } from '../components/ArtSlot';
import { Arrow, ButtonMark, TinyStar } from '../components/Icons';
import { Page } from '../components/Page';

export default function HomePage() {
  return (
    <Page title="A Little World of Wonder" description="Come on in to Izzy Moonbow's little creative corner.">
      <section className="home-hero">
        <div className="hero-edge-stitch" aria-hidden="true" />
        <div className="home-hero-inner wrap">
          <div className="hero-copy hero-enter">
            <div className="hero-kicker"><span className="kicker-line" /> BRIDLEWOOD ROOTS <span aria-hidden="true">&middot;</span> MARETIME BAY IDEAS</div>
            <p className="hero-signature">a little world by <strong>izzy moonbow.</strong></p>
            <h1>Oh! Hi there.<br /><span>I'm Izzy.</span><TinyStar className="heading-star" /></h1>
            <p className="hero-lead">Come on in! I make things from other things, fix what I can, and keep all the interesting little bits. You never know which one's going to be important.</p>
            <div className="hero-actions">
              <Link className="button button-dark" to="/workshop">See what I'm making <Arrow /></Link>
              <Link className="text-link" to="/creations">Look through my creations <Arrow diagonal /></Link>
            </div>
            <p className="hero-note">Yes, I saved that ribbon.<br />It was a very good ribbon. <span aria-hidden="true">&rarr;</span></p>
          </div>
          <div className="hero-art-composition hero-enter">
            <div className="hero-paper-back" aria-hidden="true" />
            <div className="hero-art-frame"><span className="frame-tape" aria-hidden="true" /><ArtSlot id="homeIzzy" priority /></div>
            <div className="hero-thread" aria-hidden="true"><svg viewBox="0 0 220 160" fill="none"><path d="M3 98C56 128 89 145 127 122c27-17 21-51 0-49-18 2-15 28 5 30 24 3 51-24 83-98" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" /></svg></div>
            <ButtonMark className="hero-button-mark" />
            <span className="hero-art-caption">a little space<br />for a big hello</span>
          </div>
        </div>
        <div className="hero-bottom-line wrap"><span>WELCOME TO MY LITTLE CORNER</span><span>SCROLL FOR THE GOOD BITS <span aria-hidden="true">&darr;</span></span></div>
      </section>

      <section className="home-workshop section-pad wrap" data-reveal>
        <div className="home-workbench-art" aria-hidden="true">
          <div className="bench-paper"><span>THE<br />MAYBE<br />PILE.</span><i /></div>
          <div className="bench-ribbon" />
          <div className="bench-spool"><i /><i /><i /></div>
          <div className="bench-button"><i /><i /><i /><i /></div>
          <div className="bench-tag">save me!</div>
          <svg className="bench-thread" viewBox="0 0 460 260" fill="none"><path d="M6 201C76 180 66 58 166 75s18 136 121 117 85-112 164-84" stroke="currentColor" strokeWidth="2" strokeDasharray="5 6" /></svg>
        </div>
        <div className="home-workshop-copy">
          <span className="eyebrow"><span className="eyebrow-number">01 /</span> THE WORKSHOP</span>
          <h2>It starts with<br /><em>a little something.</em></h2>
          <p>Did you know an old button can be the beginning of a whole new idea? I call it uni-cycling. Come see what happens when the interesting bits get another chance.</p>
          <Link className="button button-outline" to="/workshop">Step into the workshop <Arrow /></Link>
          <span className="scribble home-scribble">every piece is a maybe</span>
        </div>
      </section>

      <section className="home-featured section-pad" data-reveal>
        <div className="wrap">
          <div className="section-heading-row">
            <div><span className="eyebrow"><span className="eyebrow-number">02 /</span> A FEW FAVORITES</span><h2>Made, mended,<br /><em>and remembered.</em></h2></div>
            <div><p>Some things are made for a reason. Some find their reason halfway through.</p><Link className="text-link" to="/creations">See all my creations <Arrow diagonal /></Link></div>
          </div>
          <div className="featured-grid">
            <Link className="featured-project featured-cart" to="/creations/izzy-does-it">
              <div className="feature-art feature-art-lilac"><ArtSlot id="izzyCart" compact /><span className="feature-number">01</span></div>
              <div className="feature-caption"><div><span className="tiny-label">A MOBILE WORKSHOP</span><h3>Izzy Does It</h3><p>One old cart. Quite a lot of possibilities.</p></div><span className="round-arrow"><Arrow diagonal /></span></div>
            </Link>
            <Link className="featured-project featured-lantern" to="/creations/sunnys-lantern">
              <div className="feature-art feature-art-peach"><ArtSlot id="sunnysLantern" compact /><span className="feature-number">02</span></div>
              <div className="feature-caption"><div><span className="tiny-label">A LITTLE RESTORATION</span><h3>A Light Worth Fixing</h3><p>A little light with a lot of love in it.</p></div><span className="round-arrow"><Arrow diagonal /></span></div>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-make wrap" data-reveal>
        <div className="make-band-copy"><span className="eyebrow light">A LITTLE ROOM AT THE TABLE</span><h2>Ooh! Your turn.</h2><p>Pick a color, add a bead, and see what starts to happen.</p><Link className="button button-paper" to="/make">Make a friendship bracelet <Arrow /></Link></div>
        <div className="make-band-craft" aria-hidden="true"><div className="band-cord" /><i className="band-bead b1" /><i className="band-bead b2" /><i className="band-bead b3" /><i className="band-bead b4" /><i className="band-bead b5" /><span className="scribble">one for you!</span></div>
      </section>

      <section className="home-personal wrap section-pad" data-reveal>
        <span className="scribble personal-note">a little note from me</span>
        <div><span className="eyebrow"><span className="eyebrow-number">03 /</span> THE THINGS I KEEP CLOSE</span><h2>My favorite things usually have <em>somepony special</em> at the other end.</h2></div>
        <div className="personal-links"><Link to="/friends">Meet my friends <Arrow diagonal /></Link><Link to="/scrapbook">Open the scrapbook <Arrow diagonal /></Link></div>
      </section>
    </Page>
  );
}