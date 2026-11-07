import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Arrow, ButtonMark, TinyStar } from './Icons';

const navigation = [
  { to: '/', label: 'Home' },
  { to: '/workshop', label: 'Workshop' },
  { to: '/creations', label: 'Creations' },
  { to: '/make', label: 'Make', accessible: 'Make Something' },
  { to: '/scrapbook', label: 'Scrapbook' },
  { to: '/friends', label: 'Friends', accessible: 'My Friends' },
  { to: '/about', label: 'About', accessible: 'A Little About Me' },
];

export function SiteShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef<string | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    if (previousPath.current !== pathname) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (previousPath.current !== null) mainRef.current?.focus({ preventScroll: true });
      previousPath.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        headerRef.current?.querySelector<HTMLButtonElement>('.menu-toggle')?.focus();
      }
    };
    const onOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
    };
  }, [menuOpen]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to the good stuff</a>
      <header className="site-header" ref={headerRef}>
        <div className="header-inner">
          <Link to="/" className="wordmark" aria-label="Izzy Moonbow, home">
            <span>izzy<span className="wordmark-dot">.</span> moonbow<span className="wordmark-dot">.</span></span>
            <small>A LITTLE WORLD OF WONDER</small>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} aria-label={item.accessible ?? item.label}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-mark" aria-hidden="true"><ButtonMark /><span>MADE WITH<br />A LITTLE WONDER</span></div>
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>
            <span>{menuOpen ? 'Close' : 'Menu'}</span><span className={`menu-lines ${menuOpen ? 'is-open' : ''}`} aria-hidden="true"><i /><i /></span>
          </button>
        </div>
        {menuOpen && (
          <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
            {navigation.map((item, index) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} aria-label={item.accessible ?? item.label} onClick={() => setMenuOpen(false)}>
                <span className="mobile-nav-number">0{index + 1}</span>{item.accessible ?? item.label}<Arrow />
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main id="main-content" tabIndex={-1} ref={mainRef}><Outlet /></main>
      <footer className="site-footer">
        <div className="footer-top wrap">
          <div><span className="eyebrow light">A LITTLE NOTE BEFORE YOU GO</span><p>Keep the interesting<br />little pieces. <em>You never know.</em></p></div>
          <div className="footer-stitch" aria-hidden="true"><TinyStar /><span /><ButtonMark /></div>
          <Link className="footer-link" to="/workshop">Back to the workshop <Arrow /></Link>
        </div>
        <div className="footer-bottom wrap">
          <Link className="footer-wordmark" to="/">izzy moonbow.</Link>
          <p>My Little Pony and its characters are owned by Hasbro. Unofficial tribute website.</p>
          <span>MADE WITH A LITTLE WONDER</span>
        </div>
      </footer>
    </>
  );
}