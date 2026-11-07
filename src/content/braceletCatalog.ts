export type BeadShape = 'round' | 'button' | 'heart' | 'pin' | 'star' | 'flower' | 'tube' | 'charm'
export type BeadCategory = 'Round beads' | 'Button beads' | 'Heart beads' | 'Star & flower beads' | 'Tube & spacer beads' | 'Charm-like accents'

export type CordDef = {
  id: string
  name: string
  color: string
}

export type BeadDef = {
  id: string
  name: string
  category: BeadCategory
  shape: BeadShape
  baseColor: string
  accentColor?: string
  scale: number
  thickness?: number
  description?: string
}

export type BraceletDesign = {
  version: 1
  cord: string
  beads: string[]
}

export const cords: CordDef[] = [
  { id: 'violet', name: 'Violet', color: '#8753cb' },
  { id: 'blue', name: 'Mane blue', color: '#287bd6' },
  { id: 'pink', name: 'Ribbon pink', color: '#e87cab' },
  { id: 'mint', name: 'Soft mint', color: '#79b9a6' },
  { id: 'gold', name: 'Warm yellow', color: '#d5a344' },
  // expanded cord choices - still in-world feel
  { id: 'lilac', name: 'Soft lilac', color: '#c4a0e0' },
  { id: 'cream', name: 'Warm cream', color: '#f5ecd8' },
  { id: 'terracotta', name: 'Terracotta blush', color: '#d98a6b' },
  { id: 'dusk', name: 'Evening dusk', color: '#504775' },
  { id: 'meadow', name: 'Meadow mint', color: '#8bbe8f' },
]

export const beads: BeadDef[] = [
  // --- original 5 for smoke-test compatibility ---
  { id: 'button', name: 'Blue button', category: 'Button beads', shape: 'button', baseColor: '#4c8cd9', scale: 1 },
  { id: 'pin', name: 'Pink pin bead', category: 'Tube & spacer beads', shape: 'pin', baseColor: '#e888b4', scale: 0.95 },
  { id: 'heart', name: 'Violet heart', category: 'Heart beads', shape: 'heart', baseColor: '#a37ad3', scale: 1 },
  { id: 'pearl', name: 'Cream round bead', category: 'Round beads', shape: 'round', baseColor: '#f5d99c', scale: 1 },
  { id: 'mint', name: 'Mint round bead', category: 'Round beads', shape: 'round', baseColor: '#a5d8c8', scale: 1 },

  // --- Round beads expanded ---
  { id: 'ribbon-pink-round', name: 'Ribbon pink round', category: 'Round beads', shape: 'round', baseColor: '#f1a6c2', scale: 1 },
  { id: 'violet-round', name: 'Violet round', category: 'Round beads', shape: 'round', baseColor: '#a684d7', scale: 1 },
  { id: 'mane-blue-round', name: 'Mane blue round', category: 'Round beads', shape: 'round', baseColor: '#5b9be0', scale: 1 },
  { id: 'soft-gold-round', name: 'Soft gold round', category: 'Round beads', shape: 'round', baseColor: '#f0d07a', scale: 1 },

  // --- Button beads expanded ---
  { id: 'pink-button', name: 'Pink button', category: 'Button beads', shape: 'button', baseColor: '#e99ab8', scale: 1 },
  { id: 'mint-button', name: 'Mint button', category: 'Button beads', shape: 'button', baseColor: '#7ec8b0', scale: 1 },
  { id: 'cream-button', name: 'Cream button', category: 'Button beads', shape: 'button', baseColor: '#f2dcaf', scale: 1 },

  // --- Hearts ---
  { id: 'pink-heart', name: 'Pink heart', category: 'Heart beads', shape: 'heart', baseColor: '#e88aae', scale: 1 },
  { id: 'mint-heart', name: 'Mint heart', category: 'Heart beads', shape: 'heart', baseColor: '#88c9b8', scale: 1 },
  { id: 'glow-heart', name: 'Glow heart', category: 'Heart beads', shape: 'heart', baseColor: '#ffd6e8', accentColor: '#fff4fb', scale: 1.05 },

  // --- Stars / flowers playful beads ---
  { id: 'little-star', name: 'Little star', category: 'Star & flower beads', shape: 'star', baseColor: '#f9d76b', scale: 1 },
  { id: 'daisy-bead', name: 'Daisy bead', category: 'Star & flower beads', shape: 'flower', baseColor: '#fffbe0', accentColor: '#f0d07a', scale: 1 },
  { id: 'petal-bead', name: 'Petal bead', category: 'Star & flower beads', shape: 'flower', baseColor: '#f3a8c8', scale: 1 },
  { id: 'spark-bead', name: 'Spark bead', category: 'Star & flower beads', shape: 'star', baseColor: '#c8b6ff', scale: 1 },
  { id: 'flower-five', name: 'Petal bloom bead', category: 'Star & flower beads', shape: 'flower', baseColor: '#ffb6d9', scale: 1 },
  { id: 'star-twinkle', name: 'Twinkle star', category: 'Star & flower beads', shape: 'star', baseColor: '#ffe082', scale: 1 },

  // --- Tube / spacer ---
  { id: 'gold-spacer', name: 'Gold spacer', category: 'Tube & spacer beads', shape: 'tube', baseColor: '#d5a344', scale: 0.9 },
  { id: 'cream-spacer', name: 'Cream spacer', category: 'Tube & spacer beads', shape: 'tube', baseColor: '#f5ecd8', scale: 0.9 },
  { id: 'twisted-spacer', name: 'Twisted spacer', category: 'Tube & spacer beads', shape: 'tube', baseColor: '#b8a9d8', scale: 0.9 },
  { id: 'short-ribbon-tube', name: 'Short ribbon tube', category: 'Tube & spacer beads', shape: 'tube', baseColor: '#e8a0b5', scale: 0.9 },

  // --- Charm-like accent pieces ---
  { id: 'tiny-cutie', name: 'Tiny cutie sparkle', category: 'Charm-like accents', shape: 'charm', baseColor: '#ffd700', accentColor: '#fff6a6', scale: 1.05 },
  { id: 'butterfly-charm', name: 'Butterfly charm', category: 'Charm-like accents', shape: 'charm', baseColor: '#a0d8ff', scale: 1 },
  { id: 'ribbon-charm', name: 'Ribbon charm', category: 'Charm-like accents', shape: 'charm', baseColor: '#e87cab', scale: 1 },
  { id: 'little-moon', name: 'Little moon charm', category: 'Charm-like accents', shape: 'charm', baseColor: '#d0d0ff', scale: 1 },
  { id: 'lucky-button', name: 'Lucky button charm', category: 'Charm-like accents', shape: 'charm', baseColor: '#7ec8b0', accentColor: '#fff6a6', scale: 1 },
  { id: 'bridlewood-leaf', name: 'Bridlewood leaf charm', category: 'Charm-like accents', shape: 'charm', baseColor: '#7bbf8a', scale: 1 },
]

export const presets: { name: string; design: BraceletDesign }[] = [
  { name: 'For a sunny day', design: { version: 1, cord: 'gold', beads: ['pearl', 'button', 'pearl', 'pin', 'pearl'] } },
  { name: 'Bridlewood afternoon', design: { version: 1, cord: 'violet', beads: ['mint', 'heart', 'pearl', 'heart', 'mint'] } },
  { name: 'Little surprise', design: { version: 1, cord: 'blue', beads: ['button', 'pin', 'heart', 'mint', 'button'] } },
  { name: 'Sleepover sparkle', design: { version: 1, cord: 'pink', beads: ['little-star', 'violet-round', 'pink-heart', 'spark-bead', 'daisy-bead', 'glow-heart'] } },
  { name: 'Made for a new friend', design: { version: 1, cord: 'meadow', beads: ['butterfly-charm', 'cream-spacer', 'mane-blue-round', 'bridlewood-leaf', 'twisted-spacer', 'little-moon'] } },
]

// helper to find definition
export function getCordDef(id: string): CordDef | undefined {
  return cords.find((c) => c.id === id)
}
export function getBeadDef(id: string): BeadDef | undefined {
  return beads.find((b) => b.id === id)
}
export function beadLabel(id: string): string {
  const def = getBeadDef(id)
  if (!def) return id
  return def.name.endsWith('bead') ? def.name : `${def.name} bead`
}

export const beadCategories: BeadCategory[] = [
  'Round beads',
  'Button beads',
  'Heart beads',
  'Star & flower beads',
  'Tube & spacer beads',
  'Charm-like accents',
]
