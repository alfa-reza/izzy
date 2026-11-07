import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArtSlot } from '../components/ArtSlot';
import { Arrow } from '../components/Icons';
import { Page } from '../components/Page';
import { friends } from '../content/friends';

export default function FriendsPage() {
  const [open, setOpen] = useState<string | null>('Sunny');
  return (
    <Page title="My Friends" description="A few notes about the ponies who make the little things feel big." className="friends-page">
      <section className="friends-intro wrap page-intro hero-enter"><div><span className="eyebrow"><span className="eyebrow-number">05 /</span> MY FAVORITE PONIES</span><h1>My favorite part<br />is <em>the sharing.</em></h1></div><div className="intro-side"><p>A project is different when you're making it for somepony. Or making it with them. These are some of the ponies who make all the little things feel big.</p><span className="scribble">open a little note</span></div></section>
      <section className="friends-table"><div className="wrap"><div className="friends-string" aria-hidden="true" /><div className="postcard-grid">{friends.map((friend, index) => <article className={`postcard postcard-${friend.color} ${open === friend.name ? 'is-open' : ''}`} key={friend.name}>
        <div className="postcard-pin" aria-hidden="true" /><div className="postcard-photo"><ArtSlot id={friend.art} compact /></div><div className="postcard-body"><span className="tiny-label">A NOTE ABOUT / 0{index + 1}</span><button type="button" className="postcard-toggle" aria-expanded={open === friend.name} aria-controls={`friend-${friend.name}`} onClick={() => setOpen(open === friend.name ? null : friend.name)}><span>{friend.name}</span><span className="postcard-plus" aria-hidden="true">{open === friend.name ? '-' : '+'}</span></button><p className="postcard-short scribble">{friend.short}</p><div id={`friend-${friend.name}`} hidden={open !== friend.name}><p className="postcard-note">{friend.note}</p><Link className="text-link" to={friend.link}>{friend.linkText} <Arrow diagonal /></Link></div></div>
      </article>)}</div><p className="friends-closing scribble">I've got good friends. I keep reminding myself of that.</p></div></section>
    </Page>
  );
}