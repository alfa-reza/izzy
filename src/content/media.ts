import { siteBase } from '../siteBase';

export type ArtSlotRecord = {
  id: string;
  src: string | null;
  alt: string;
  label: string;
  aspectRatio: 'portrait' | 'landscape' | 'square' | 'wide';
  usage: string;
};

// Add a local public/ path here, for example: homeIzzy: 'assets/characters/izzy.webp'.
// The rest of the site reads all artwork exclusively from this manifest.
const sources: Partial<Record<string, string>> = {};

function slot(id: string, label: string, alt: string, aspectRatio: ArtSlotRecord['aspectRatio'], usage: string): ArtSlotRecord {
  return { id, src: sources[id] ?? null, label, alt, aspectRatio, usage };
}

const projectSubjects = [
  ['izzyCart', 'Izzy Does It cart', 'Izzy Does It crafting cart', 'izzy-does-it'],
  ['sunnysLantern', "Sunny's lantern", "Sunny's restored lantern", 'sunnys-lantern'],
  ['friendshipBracelets', 'Friendship bracelets', 'Friendship bracelets made by Izzy', 'friendship-bracelets'],
  ['bridlewoodDisguises', 'Bridlewood disguises', 'The unicorn disguises Izzy made for her friends', 'bridlewood-disguises'],
  ['macaroniCrown', 'Macaroni crown', 'The improvised macaroni crown', 'macaroni-crown'],
  ['mareStream', 'The Mare Stream', 'The Mare Stream made by Izzy and Zipp', 'mare-stream'],
  ['mistysBracelet', "Misty's bracelet", 'The charm bracelet Izzy made for Misty', 'mistys-charm'],
  ['flowerCorsages', 'Flower corsages', 'The flower corsages Izzy made', 'flower-corsages'],
  ['seasideBraids', 'Seaside braids', 'A braid inspired by the technique Destiny shared', 'seaside-braids'],
] as const;

const projectArt = Object.fromEntries(projectSubjects.flatMap(([id, label, alt, slug]) => [
  [id, slot(id, label, alt, 'landscape', `/creations and /creations/${slug}`)],
  [`${id}Process`, slot(`${id}Process`, `${label}: in progress`, `${alt}, in progress`, 'landscape', `/creations/${slug}`)],
  [`${id}Detail`, slot(`${id}Detail`, `${label}: a little detail`, `A detail of ${alt}`, 'square', `/creations/${slug}`)],
]));

const noteSubjects = [
  ['noteLantern', 'The message', 'The lantern message', 'maretime'],
  ['noteHome', 'A Bridlewood room', 'A room in Bridlewood', 'bridlewood'],
  ['noteBloom', 'Lumi-Bloom', 'Lumi-Bloom plants in Bridlewood', 'bridlewood'],
  ['noteWishiehoof', 'Wishiehoof', 'A Bridlewood Wishiehoof memory', 'bridlewood'],
  ['noteRing', 'Just the right ring', 'A ring for the lantern', 'maretime'],
  ['noteRoommates', 'Making room', 'A shared room at the Brighthouse', 'maretime'],
  ['noteHomesick', 'A little piece of home', 'A reminder of Bridlewood', 'bridlewood'],
  ['noteBlock', 'Ideas taking their time', 'A collection of craft supplies', 'wander'],
  ['noteButterscotch', 'Se\u00f1or Butterscotch', 'Se\u00f1or Butterscotch, made from found things', 'wander'],
  ['noteBraid', 'A new braid', 'A braided gift', 'wander'],
] as const;

const noteArt = Object.fromEntries(noteSubjects.map(([id, label, alt, tab]) => [
  id, slot(id, label, alt, 'landscape', `/scrapbook?page=${tab}`),
]));

const friendSubjects = [
  ['friendSunny', 'Sunny', 'Sunny, a friend of Izzy'],
  ['friendPipp', 'Pipp', 'Pipp, a friend of Izzy'],
  ['friendZipp', 'Zipp', 'Zipp, a friend of Izzy'],
  ['friendHitch', 'Hitch', 'Hitch, a friend of Izzy'],
  ['friendMisty', 'Misty', 'Misty, a friend of Izzy'],
] as const;

const friendArt = Object.fromEntries(friendSubjects.map(([id, label, alt]) => [
  id, slot(id, label, alt, 'square', '/friends'),
]));

export const artwork: Record<string, ArtSlotRecord> = {
  homeIzzy: slot('homeIzzy', 'Portrait of Izzy', 'Izzy Moonbow in her creative space', 'portrait', '/'),
  aboutIzzy: slot('aboutIzzy', 'Izzy, close up', 'Izzy Moonbow', 'portrait', '/about'),
  bridlewoodScene: slot('bridlewoodScene', 'Bridlewood', 'A scene from Bridlewood', 'wide', '/about'),
  maretimeScene: slot('maretimeScene', 'Maretime Bay', 'A scene from Maretime Bay', 'wide', '/about'),
  ...projectArt,
  ...noteArt,
  ...friendArt,
};

export function mediaUrl(src: string) {
  return `${siteBase}${src.replace(/^\/+/, '')}`;
}