export type ScrapbookTab = 'bridlewood' | 'maretime' | 'wander';
export type Note = { id: string; tab: ScrapbookTab; title: string; text: string; art: string; annotation: string };

export const scrapbookTabs: { id: ScrapbookTab; label: string; intro: string }[] = [
  { id: 'bridlewood', label: 'From Bridlewood', intro: 'A few pieces of the place I still call home.' },
  { id: 'maretime', label: 'Around Maretime Bay', intro: 'New places, familiar faces, and a lantern with a story.' },
  { id: 'wander', label: 'When Ideas Wander', intro: 'For the days when an idea needs a little room.' },
];

export const notes: Note[] = [
  { id: 'home', tab: 'bridlewood', title: 'A home full of bits', text: "My old place in Bridlewood was full of things I made. The shelves weren't always as full as my head, though.", art: 'noteHome', annotation: 'I saved the interesting bits.' },
  { id: 'bloom', tab: 'bridlewood', title: 'When the plants glow', text: "You should see Bridlewood when the Lumi-Bloom plants glow. Actually... I wish everypony could see it. It's lovely sharing that place with my friends.", art: 'noteBloom', annotation: 'A little bit of Bridlewood.' },
  { id: 'wishiehoof', tab: 'bridlewood', title: 'A Wishiehoof kind of day', text: "There's something nice about Bridlewood traditions. Even the ones that sound a little odd when you explain them out loud.", art: 'noteWishiehoof', annotation: 'Some traditions travel with you.' },
  { id: 'homesick', tab: 'bridlewood', title: 'Missing the trees', text: 'Sometimes I miss Bridlewood so much it feels like the trees are waving from very far away. Making a little room for home helps.', art: 'noteHomesick', annotation: 'Home can feel far away.' },
  { id: 'lantern', tab: 'maretime', title: 'The message I kept', text: 'When I was little, I found a message that said there were friends for me in Maretime Bay. I kept it. Of course I did.', art: 'noteLantern', annotation: 'A very important little light.' },
  { id: 'ring', tab: 'maretime', title: 'The not-quite-right rings', text: "Sometimes the tiniest ring is the hardest thing to find. I found one for Sunny's lantern, though. Worth it.", art: 'noteRing', annotation: 'The right piece makes a difference.' },
  { id: 'roommates', tab: 'maretime', title: 'Making room for me', text: 'I thought living with my friends meant doing everything the way they do. Turns out being me is enough. Whew.', art: 'noteRoommates', annotation: 'A home made together.' },
  { id: 'block', tab: 'wander', title: 'When ideas take their time', text: 'I thought all my ideas had gone missing. Maybe they just needed me to stop chasing them for a bit.', art: 'noteBlock', annotation: 'A walk can help.' },
  { id: 'butterscotch', tab: 'wander', title: 'Se\u00f1or Butterscotch', text: 'On T.U.E.S. Day I felt a little lonely, so I made a companion from bits and pieces. He was a very good listener.', art: 'noteButterscotch', annotation: 'A funny little friend.' },
  { id: 'braid', tab: 'wander', title: 'A new twist', text: 'I learned a new braiding trick from Destiny. Guess who I wanted to try it for first? Everypony, obviously.', art: 'noteBraid', annotation: 'Learned by the sea.' },
];