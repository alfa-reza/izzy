import * as THREE from 'three'

/**
 * Procedural canvas textures for the bracelet 3D scene.
 * Everything is generated locally (no external assets) and cached so
 * materials can share texture instances.
 */

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeCanvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  return [canvas, ctx]
}

function toTexture(canvas: HTMLCanvasElement, repeatX = 1, repeatY = 1): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(repeatX, repeatY)
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

/* ------------------------------------------------------------------ */
/* Cord: a twisted three-strand cotton string                          */
/* ------------------------------------------------------------------ */

let cordWeave: THREE.CanvasTexture | null = null
let cordBump: THREE.CanvasTexture | null = null

function drawCord(ctx: CanvasRenderingContext2D, size: number, forBump: boolean) {
  const rand = mulberry32(forBump ? 4242 : 20260607)
  ctx.fillStyle = forBump ? '#6f6f6f' : '#eae3d9'
  ctx.fillRect(0, 0, size, size)

  ctx.save()
  ctx.translate(size / 2, size / 2)
  ctx.rotate(1.15)
  ctx.translate(-size, -size)

  const strand = 34
  let strandIndex = 0
  for (let x = -size; x < size * 3; x += strand) {
    // every strand gets its own subtle lightness, like twisted floss dyes
    const cast = (strandIndex * 37) % 3 === 0 ? 0.12 : (strandIndex * 37) % 3 === 1 ? 0.04 : 0
    strandIndex++

    // one twisted strand: dark edge, bright spine, soft shoulders
    const grad = ctx.createLinearGradient(x, 0, x + strand, 0)
    if (forBump) {
      grad.addColorStop(0, '#262626')
      grad.addColorStop(0.14, '#484848')
      grad.addColorStop(0.32, '#bdbdbd')
      grad.addColorStop(0.5, '#f2f2f2')
      grad.addColorStop(0.68, '#bdbdbd')
      grad.addColorStop(0.86, '#484848')
      grad.addColorStop(1, '#262626')
    } else {
      grad.addColorStop(0, 'rgba(88,76,70,0.96)')
      grad.addColorStop(0.16, 'rgba(158,148,138,0.9)')
      grad.addColorStop(0.36, 'rgba(252,250,244,0.96)')
      grad.addColorStop(0.5, 'rgba(226,220,212,0.92)')
      grad.addColorStop(0.64, 'rgba(250,247,241,0.96)')
      grad.addColorStop(0.84, 'rgba(160,150,140,0.9)')
      grad.addColorStop(1, 'rgba(88,76,70,0.96)')
    }
    ctx.fillStyle = grad
    ctx.fillRect(x, 0, strand, size * 3)

    // two-ply darkening cast on some strands
    if (!forBump && cast > 0) {
      ctx.fillStyle = `rgba(38,30,28,${cast})`
      ctx.fillRect(x, 0, strand, size * 3)
    }

    // the two ply seams inside a strand
    for (let p = 1; p < 3; p++) {
      const px = x + (strand / 3) * p
      ctx.strokeStyle = forBump ? 'rgba(255,255,255,0.45)' : 'rgba(104,93,85,0.55)'
      ctx.lineWidth = 2.2
      ctx.beginPath()
      ctx.moveTo(px, 0)
      ctx.lineTo(px, size * 3)
      ctx.stroke()
    }

    // fibre hairs escaping the strand
    for (let i = 0; i < 110; i++) {
      const fx = x + rand() * strand
      const fy = rand() * size * 3
      const len = 4 + rand() * 10
      ctx.strokeStyle = forBump
        ? 'rgba(255,255,255,0.3)'
        : rand() < 0.5
          ? 'rgba(255,255,255,0.5)'
          : 'rgba(88,77,70,0.4)'
      ctx.lineWidth = 0.55 + rand() * 0.75
      ctx.beginPath()
      ctx.moveTo(fx, fy)
      ctx.lineTo(fx + (rand() - 0.5) * 2, fy + len)
      ctx.stroke()
    }
  }

  // dark twisted gap between strands
  for (let x = -size; x < size * 3; x += strand) {
    ctx.fillStyle = forBump ? '#1c1c1c' : 'rgba(52,43,39,0.8)'
    ctx.fillRect(x - 2, 0, 4, size * 3)
    // frayed light picking out the gap ridge
    ctx.fillStyle = forBump ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.28)'
    ctx.fillRect(x + 2.4, 0, 1.2, size * 3)
  }

  // broad lengthwise tonal drift — dye unevenness like real floss
  for (let i = 0; i < 5; i++) {
    const y = rand() * size * 3 - size
    const drift = ctx.createLinearGradient(0, y, 0, y + 140 + rand() * 160)
    const dark = hexWithAlpha('#3a2f2b', 0.16 + rand() * 0.1)
    drift.addColorStop(0, 'rgba(255,255,255,0)')
    drift.addColorStop(0.5, dark)
    drift.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = drift
    ctx.fillRect(-size, 0, size * 5, size * 3)
  }

  ctx.restore()
}

export function getCordWeaveTextures() {
  if (cordWeave && cordBump) return { map: cordWeave, bump: cordBump }

  const size = 512
  const [canvas, ctx] = makeCanvas(size)
  drawCord(ctx, size, false)
  cordWeave = toTexture(canvas, 11, 1.9)
  cordWeave.colorSpace = THREE.SRGBColorSpace

  const [bCanvas, bCtx] = makeCanvas(size)
  drawCord(bCtx, size, true)
  cordBump = toTexture(bCanvas, 11, 1.9)

  return { map: cordWeave, bump: cordBump }
}

/* ------------------------------------------------------------------ */
/* Subtle roughness noise — breaks up flat CGI specular                */
/* ------------------------------------------------------------------ */

let roughnessNoise: THREE.CanvasTexture | null = null

export function getRoughnessNoise(): THREE.CanvasTexture {
  if (roughnessNoise) return roughnessNoise
  const size = 256
  const [canvas, ctx] = makeCanvas(size)
  const rand = mulberry32(975312468)

  ctx.fillStyle = '#cfcfcf'
  ctx.fillRect(0, 0, size, size)

  // broad soft blotches — satin wobble across the surface
  for (let i = 0; i < 26; i++) {
    const x = rand() * size
    const y = rand() * size
    const r = 18 + rand() * 66
    const light = rand() < 0.5
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
    grad.addColorStop(0, light ? 'rgba(255,255,255,0.5)' : 'rgba(70,70,70,0.42)')
    grad.addColorStop(1, 'rgba(207,207,207,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
  }

  // faint pin-prick orange peel
  for (let i = 0; i < 900; i++) {
    const x = rand() * size
    const y = rand() * size
    const r = 0.4 + rand() * 1.1
    ctx.globalAlpha = 0.08 + rand() * 0.16
    ctx.fillStyle = rand() < 0.5 ? '#ffffff' : '#5f5f5f'
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  roughnessNoise = toTexture(canvas, 2, 2)
  return roughnessNoise
}

/* ------------------------------------------------------------------ */
/* Soft dark disc used to fake a drilled hole where geometry can't go  */
/* ------------------------------------------------------------------ */

let holeFading: THREE.CanvasTexture | null = null

export function getHoleFading(): THREE.CanvasTexture {
  if (holeFading) return holeFading
  const size = 128
  const [canvas, ctx] = makeCanvas(size)
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, '#030202')
  grad.addColorStop(0.38, '#0d0908')
  grad.addColorStop(0.62, '#1d1614')
  grad.addColorStop(0.78, '#372e2a')
  grad.addColorStop(0.88, 'rgba(72,63,59,0.55)')
  grad.addColorStop(1, 'rgba(72,63,59,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  holeFading = toTexture(canvas, 1, 1)
  holeFading.colorSpace = THREE.SRGBColorSpace
  return holeFading
}

/* ------------------------------------------------------------------ */
/* Glazed ceramic speckle (buttons, spacer beads)                      */
/* ------------------------------------------------------------------ */

const speckleCache = new Map<string, THREE.CanvasTexture>()

export function getCeramicSpeckle(baseColor: string): THREE.CanvasTexture {
  const cached = speckleCache.get(baseColor)
  if (cached) return cached

  const size = 256
  const [canvas, ctx] = makeCanvas(size)
  const rand = mulberry32(hashColor(baseColor))

  ctx.fillStyle = baseColor
  ctx.fillRect(0, 0, size, size)

  const base = new THREE.Color(baseColor)
  const darker = base.clone().multiplyScalar(0.72)
  const lighter = base.clone().lerp(new THREE.Color('#ffffff'), 0.4)
  const d = `#${darker.getHexString()}`
  const l = `#${lighter.getHexString()}`

  // Broad soft blotches for depth
  for (let i = 0; i < 7; i++) {
    const x = rand() * size
    const y = rand() * size
    const r = 34 + rand() * 70
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
    grad.addColorStop(0, rand() < 0.5 ? hexWithAlpha(d, 0.34) : hexWithAlpha(l, 0.36))
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
  }

  // Fine kiln speckle
  for (let i = 0; i < 420; i++) {
    const x = rand() * size
    const y = rand() * size
    const r = 0.6 + rand() * 2.2
    ctx.globalAlpha = 0.16 + rand() * 0.3
    ctx.fillStyle = rand() < 0.62 ? d : l
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  // a few darker kiln freckles
  for (let i = 0; i < 26; i++) {
    const x = rand() * size
    const y = rand() * size
    const r = 1.6 + rand() * 2.6
    ctx.globalAlpha = 0.2 + rand() * 0.28
    ctx.fillStyle = d
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  const texture = toTexture(canvas, 1, 1)
  texture.colorSpace = THREE.SRGBColorSpace
  speckleCache.set(baseColor, texture)
  return texture
}

/* ------------------------------------------------------------------ */
/* Brushed metal roughness variation (gold pieces)                     */
/* ------------------------------------------------------------------ */

let brushed: THREE.CanvasTexture | null = null

export function getBrushedMetal(): THREE.CanvasTexture {
  if (brushed) return brushed
  const size = 256
  const [canvas, ctx] = makeCanvas(size)
  const rand = mulberry32(987654)

  // Mid-gray base: multiplied with material roughness
  ctx.fillStyle = '#6f6f6f'
  ctx.fillRect(0, 0, size, size)

  // Horizontal brushing streaks
  for (let i = 0; i < 340; i++) {
    const y = rand() * size
    const x = rand() * size
    const len = 30 + rand() * 130
    const shade = rand() < 0.5 ? 'rgba(255,255,255,0.34)' : 'rgba(0,0,0,0.3)'
    ctx.strokeStyle = shade
    ctx.lineWidth = 0.5 + rand() * 1.4
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + len, y + (rand() - 0.5) * 2.4)
    ctx.stroke()
  }

  brushed = toTexture(canvas, 1, 1)
  return brushed
}

/* ------------------------------------------------------------------ */
/* Fine iridescent swirl for glass/pearl round beads                   */
/* ------------------------------------------------------------------ */

let pearlSwirl: THREE.CanvasTexture | null = null

export function getPearlSwirl(): THREE.CanvasTexture {
  if (pearlSwirl) return pearlSwirl
  const size = 256
  const [canvas, ctx] = makeCanvas(size)
  const rand = mulberry32(13579246)

  ctx.fillStyle = '#fdfcf8'
  ctx.fillRect(0, 0, size, size)

  // nebula-like pastel swirls — the orient you see on real shell pearls
  const hues = ['255,205,226', '200,224,255', '225,250,228', '255,238,186', '232,214,255']
  for (let i = 0; i < 14; i++) {
    const x = rand() * size
    const y = rand() * size
    const r = 20 + rand() * 74
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
    grad.addColorStop(0, `rgba(${hues[i % hues.length]},0.85)`)
    grad.addColorStop(0.55, `rgba(${hues[i % hues.length]},0.32)`)
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
  }

  // faint banding arcs like nacre layers
  for (let i = 0; i < 7; i++) {
    const y = rand() * size
    ctx.strokeStyle = `rgba(160,150,170,${0.08 + rand() * 0.12})`
    ctx.lineWidth = 1 + rand() * 2.4
    ctx.beginPath()
    ctx.ellipse(size / 2, y, size * 0.72, 14 + rand() * 10, 0, 0, Math.PI * 2)
    ctx.stroke()
  }

  pearlSwirl = toTexture(canvas, 1, 1)
  pearlSwirl.colorSpace = THREE.SRGBColorSpace
  return pearlSwirl
}

/* ------------------------------------------------------------------ */

function hashColor(hex: string): number {
  let h = 2166136261
  for (let i = 0; i < hex.length; i++) {
    h ^= hex.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function hexWithAlpha(hex: string, alpha: number): string {
  const color = new THREE.Color(hex)
  return `rgba(${Math.round(color.r * 255)},${Math.round(color.g * 255)},${Math.round(color.b * 255)},${alpha})`
}

/* ------------------------------------------------------------------ */
/* Warm studio backdrop for the scene — mirrors .bracelet-canvas-wrap  */
/* ------------------------------------------------------------------ */

let backdrop: THREE.CanvasTexture | null = null

export function getBackdropTexture(): THREE.CanvasTexture {
  if (backdrop) return backdrop
  const width = 1024
  const height = 640
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // same warm radial wash as the CSS behind the canvas
  const grad = ctx.createRadialGradient(width / 2, height * 0.18, 40, width / 2, height * 0.18, width * 0.78)
  grad.addColorStop(0, '#fffdfc')
  grad.addColorStop(0.38, '#fdeef2')
  grad.addColorStop(0.72, '#f2dce8')
  grad.addColorStop(1, '#e4cbdc')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  backdrop = new THREE.CanvasTexture(canvas)
  backdrop.colorSpace = THREE.SRGBColorSpace
  backdrop.needsUpdate = true
  return backdrop
}
