export type ProjectFilter = 'Found & Fixed' | 'Made for Friends' | 'Made Together' | 'Little Surprises';
export type Project = {
  slug: string;
  title: string;
  type: string;
  capsule: string;
  subtitle: string;
  lead: string;
  found: string;
  tried: string;
  became: string;
  credit: string;
  material: string;
  art: string;
  filters: ProjectFilter[];
  color: string;
};

// Screen-story references are intentionally kept out of the visitor experience.
export const projects: Project[] = [
  {
    slug: 'izzy-does-it', title: 'Izzy Does It', type: 'A mobile workshop',
    capsule: 'A very old cart was sitting around. I had supplies to carry. You can probably guess what happened next.',
    subtitle: 'One old cart. Quite a lot of possibilities.',
    lead: 'I love making things. I do! But the minute I tried making the same thing over and over, all my best ideas seemed to hide. So I went looking for a little breathing room. And found a cart!',
    found: "An old cart with a lot of room for possibilities. It wasn't exactly sparkling when I first spotted it.",
    tried: 'I gave every curious little piece somewhere to live. Tape, buttons, glitter, my crafting glasses... All the things that vanish right when you need them.',
    became: 'A workshop that can come along with me. I called it Izzy Does It. It just sort of fits, don\'t you think?',
    credit: 'Made by me, with a few important nudges from friends.', material: 'An old cart, tape, buttons & a place for everything',
    art: 'izzyCart', filters: ['Found & Fixed', 'Little Surprises'], color: 'lilac',
  },
  {
    slug: 'sunnys-lantern', title: 'A Light Worth Fixing', type: 'A restoration for Sunny',
    capsule: 'This one mattered before I ever touched it. I just wanted Sunny to have it shining again.',
    subtitle: 'A little light with a lot of love in it.',
    lead: "Sunny's lantern wasn't just an old lantern. Her dad made it for her. I wanted to make sure a little more of that light could stay with her.",
    found: 'A lantern with a story already inside it. And a few pieces that needed some love.',
    tried: 'I looked for just the right ring to finish it. You would not believe how many not-quite-right bits are out there.',
    became: 'Something Sunny could hold onto again. That was the important part.',
    credit: 'Repaired for Sunny. The original lantern came from her dad.', material: 'A treasured lantern & one very particular ring',
    art: 'sunnysLantern', filters: ['Found & Fixed', 'Made for Friends'], color: 'peach',
  },
  {
    slug: 'friendship-bracelets', title: 'Little Bracelets, Big Feelings', type: 'Friendship bracelets',
    capsule: "A few tiny pieces can hold a lot of feelings. Especially when they're for a friend.",
    subtitle: 'A little something to keep close.',
    lead: "Sometimes I know exactly who I'm making something for. Sometimes I start with three little beads and figure it out halfway through.",
    found: 'Buttons, beads, string, tiny colors that look even better next to each other.',
    tried: "I put a little of everypony's sparkle into the things I make for my friends. Not the literal kind. Well... usually.",
    became: 'Something small enough to wear, and special enough to keep.',
    credit: 'Made with friends in mind; some have a very particular friend in mind.', material: 'String, beads, buttons & a little thought',
    art: 'friendshipBracelets', filters: ['Made for Friends', 'Little Surprises'], color: 'blue',
  },
  {
    slug: 'bridlewood-disguises', title: 'Fit Right In', type: 'Improvised disguises',
    capsule: 'We needed to look like we belonged. I had an idea, some supplies, and absolutely no time to be boring.',
    subtitle: 'A little help looking the part.',
    lead: 'My friends needed to look like unicorns. I had a home full of supplies and an idea that was almost too good not to try.',
    found: 'A few things that did not look remotely like the right thing yet.',
    tried: 'I made horns and disguises. The kind you can actually craft, not the magic-spell kind.',
    became: 'A very unusual group of unicorns. Everypony did their best. Mostly.',
    credit: 'Made to help my friends get through Bridlewood.', material: 'Odds and ends from my Bridlewood home',
    art: 'bridlewoodDisguises', filters: ['Made for Friends', 'Little Surprises'], color: 'mint',
  },
  {
    slug: 'macaroni-crown', title: 'A Very Unusual Crown', type: 'A found-object surprise',
    capsule: 'Not every crown starts with jewels. Some start with something you were about to eat.',
    subtitle: 'A rather different kind of jewel.',
    lead: 'Need a crown in a hurry? You might have to look at the macaroni a whole new way.',
    found: 'Macaroni, a few other bits, and a very good reason to improvise.',
    tried: 'I put together a quick crown-shaped substitute from what was around.',
    became: 'A surprising little replica. I still think the macaroni was an excellent choice.',
    credit: 'An improvised crown, made in a hurry.', material: 'Macaroni & whatever was close by',
    art: 'macaroniCrown', filters: ['Little Surprises'], color: 'yellow',
  },
  {
    slug: 'mare-stream', title: 'The Mare Stream', type: 'Made together with Zipp',
    capsule: 'Zipp and I gave an old tram a rather enormous second chance. Yes, it flies.',
    subtitle: 'An old tram, a new view.',
    lead: 'An old tram and a sky full of possibilities. Zipp and I thought: why not see what happens if we give it a new job?',
    found: "A tram that wasn't taking ponies anywhere anymore.",
    tried: 'Zipp and I worked on a rather ambitious idea. The first question was whether it would fly.',
    became: 'The Mare Stream! A way to travel together. I still think it was an excellent name.',
    credit: 'Made together with Zipp.', material: 'An old tram, teamwork & a very big idea',
    art: 'mareStream', filters: ['Found & Fixed', 'Made Together'], color: 'blue',
  },
  {
    slug: 'mistys-charm', title: 'A Bracelet for Misty', type: 'A gift for a friend',
    capsule: 'Some things are easier to say with a little charm and a whole lot of care.',
    subtitle: 'A little reminder that she belongs.',
    lead: "Misty was worried about fitting in. I made her a little bracelet with her new friends' cutie marks, because sometimes you need something you can actually hold onto.",
    found: "The right little charms. The important part wasn't their size.",
    tried: 'I made room for each friend on one bracelet.',
    became: 'A reminder that she belongs with us. I hope she keeps it close.',
    credit: 'Made for Misty.', material: "A bracelet & her new friends' cutie marks",
    art: 'mistysBracelet', filters: ['Made for Friends'], color: 'pink',
  },
  {
    slug: 'flower-corsages', title: 'A Whole Lot of Flowers', type: 'Flowers for a celebration',
    capsule: "I got a little carried away with the corsages. They're so springy!",
    subtitle: 'A little bunch, and then another.',
    lead: 'I had a few corsages in mind. A few became seven. Seven became... oh, you know how it goes.',
    found: 'Flowers, colors, and a celebration worth making something for.',
    tried: 'I gathered the flowers into little corsages for the occasion.',
    became: 'A whole lot of flowers to share. A celebration should feel comfortable for the pony it is for, too.',
    credit: 'Made for a celebration with friends.', material: 'Flowers & a springy little idea',
    art: 'flowerCorsages', filters: ['Made for Friends', 'Little Surprises'], color: 'mint',
  },
  {
    slug: 'seaside-braids', title: 'A New Twist', type: 'A new skill, shared',
    capsule: 'I met somepony who could make the prettiest braids. Naturally, I had to learn how.',
    subtitle: 'A good idea is even better shared.',
    lead: "Destiny showed me how to make the most beautiful braids. I couldn't wait to try them for my friends.",
    found: 'A new friend by the sea, and a technique I had not tried before.',
    tried: 'Destiny taught me to braid. I practiced the new twist and thought about my friends.',
    became: 'A way to share something I learned with the ponies I care about.',
    credit: 'A technique learned from Destiny and shared with friends.', material: 'A new braid & a little practice',
    art: 'seasideBraids', filters: ['Made for Friends', 'Little Surprises'], color: 'lilac',
  },
];

export const filters = ['All', 'Found & Fixed', 'Made for Friends', 'Made Together', 'Little Surprises'] as const;