import { Link, useParams } from 'react-router-dom';
import { ArtSlot } from '../components/ArtSlot';
import { Arrow, ButtonMark } from '../components/Icons';
import { Page } from '../components/Page';
import { projects } from '../content/projects';
import NotFoundPage from './NotFoundPage';

export default function CreationDetailPage() {
  const { slug } = useParams();
  const index = projects.findIndex((item) => item.slug === slug);
  if (index < 0) return <NotFoundPage />;
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const previous = projects[(index - 1 + projects.length) % projects.length];
  return (
    <Page title={project.title} description={project.capsule} className={`detail-page detail-${project.color} detail-layout-${index % 3}`}>
      <div className="wrap detail-breadcrumb"><Link to="/creations">Creations</Link><span aria-hidden="true">/</span><span>{project.title}</span></div>
      <section className="detail-hero wrap hero-enter">
        <div className="detail-heading"><span className="eyebrow"><span className="eyebrow-number">{String(index + 1).padStart(2, '0')} /</span> {project.type}</span><h1>{project.title}</h1><p className="detail-subtitle scribble">{project.subtitle}</p><p className="detail-lead">{project.lead}</p><div className="detail-credit"><ButtonMark /><span>{project.credit}</span></div></div>
        <div className="detail-hero-art"><span className="detail-tape" aria-hidden="true" /><ArtSlot id={project.art} priority /><span className="detail-image-caption">A LITTLE SPACE FOR THIS STORY</span></div>
      </section>
      <section className="detail-story section-pad">
        <div className="wrap detail-story-intro" data-reveal><div><span className="eyebrow">THE LITTLE STORY</span><h2>From first bit<br /><em>to finished thing.</em></h2></div><p>Every good idea has a middle. This one began with {project.material.toLowerCase()}.</p></div>
        <div className="wrap story-layout">
          <div className="story-steps" data-reveal>
            <article><span className="story-number">01</span><div><h3>What I found</h3><p>{project.found}</p></div></article>
            <article><span className="story-number">02</span><div><h3>{project.slug === 'mare-stream' ? 'What we tried' : 'What I tried'}</h3><p>{project.tried}</p></div></article>
            <article><span className="story-number">03</span><div><h3>What it became</h3><p>{project.became}</p></div></article>
          </div>
          <div className="story-art" data-reveal><ArtSlot id={`${project.art}Process`} compact /><div className="story-art-small"><ArtSlot id={`${project.art}Detail`} compact /></div><span className="scribble">the interesting bits</span></div>
        </div>
      </section>
      <section className="detail-navigation wrap"><Link to={`/creations/${previous.slug}`}><span>PREVIOUS CREATION</span><strong>{previous.title}</strong><Arrow /></Link><Link to="/creations" className="detail-all">All creations</Link><Link to={`/creations/${next.slug}`}><span>NEXT CREATION</span><strong>{next.title}</strong><Arrow /></Link></section>
    </Page>
  );
}