import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArtSlot } from '../components/ArtSlot';
import { Arrow, TinyStar } from '../components/Icons';
import { Page } from '../components/Page';
import { filters, projects, type ProjectFilter } from '../content/projects';

export default function CreationsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const visible = filter === 'All' ? projects : projects.filter((project) => project.filters.includes(filter as ProjectFilter));
  return (
    <Page title="My Creations" description="Things I've made, mended, and shared with my friends." className="creations-page">
      <section className="creations-intro wrap page-intro hero-enter">
        <div><span className="eyebrow"><span className="eyebrow-number">02 /</span> THE CREATIONS</span><h1>Things I've made.<br /><em>And things I've fixed!</em></h1></div>
        <div className="intro-side"><p>I never know which part I'll remember most: the first idea, the mess in the middle, or the look on a friend's face at the end.</p><span className="scribble">a little bit of everything <TinyStar /></span></div>
      </section>
      <section className="gallery-section wrap">
        <div className="gallery-toolbar"><div><span className="tiny-label">LOOK THROUGH THE DRAWERS</span><p>Not everything started out looking like a project.</p></div><div className="filter-controls" role="group" aria-label="Filter creations">{filters.map((option) => <button type="button" key={option} aria-pressed={filter === option} onClick={() => setFilter(option)}>{option}</button>)}</div></div>
        <p className="gallery-count" aria-live="polite">Showing {visible.length} {visible.length === 1 ? 'little creation' : 'little creations'}</p>
        {visible.length === 0 ? <p className="empty-message">Huh. Nothing in this drawer. Let's peek in another.</p> : <div className="gallery-grid">{visible.map((project, index) => (
          <Link to={`/creations/${project.slug}`} className={`gallery-item gallery-${project.color} gallery-position-${index % 6}`} key={project.slug}>
            <div className="gallery-art-wrap"><ArtSlot id={project.art} compact /><span className="gallery-art-index">{String(projects.indexOf(project) + 1).padStart(2, '0')}</span><span className="gallery-view">TAKE A CLOSER LOOK <Arrow diagonal /></span></div>
            <div className="gallery-item-copy"><div><span className="tiny-label">{project.type}</span><h2>{project.title}</h2><p>{project.capsule}</p></div><span className="round-arrow"><Arrow diagonal /></span></div>
          </Link>
        ))}</div>}
      </section>
      <section className="gallery-bottom-note wrap" data-reveal><span className="scribble">the best bit?</span><p>There's always room at the table for another little idea.</p><Link className="button button-dark" to="/make">Make a bracelet <Arrow /></Link></section>
    </Page>
  );
}