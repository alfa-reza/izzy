import { Link } from 'react-router-dom';
import { Arrow, ButtonMark } from '../components/Icons';
import { Page } from '../components/Page';

export default function NotFoundPage() {
  return <Page title="A Lost Note" description="This note slipped out of my scrapbook. Come look around instead." className="notfound-page"><section className="notfound wrap"><ButtonMark /><span className="eyebrow">A LITTLE LOST NOTE</span><h1>Hmm. This note isn't<br /><em>where I left it.</em></h1><p>Want to look around the workshop instead?</p><div><Link className="button button-dark" to="/workshop">See the workshop <Arrow /></Link><Link className="text-link" to="/">Back home <Arrow /></Link><Link className="text-link" to="/creations">See my creations <Arrow /></Link></div></section></Page>;
}