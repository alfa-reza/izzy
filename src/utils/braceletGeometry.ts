import * as THREE from 'three'

/**
 * Creates an oval bracelet curve in the XZ plane (horizontal).
 * Centered at origin, lying flat like a display piece.
 */
export function createBraceletCurve(radiusX = 1.58, radiusZ = 1.18, segments = 88): THREE.CatmullRomCurve3 {
  const points: THREE.Vector3[] = []
  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 2
    const x = Math.cos(t) * radiusX
    const z = Math.sin(t) * radiusZ
    points.push(new THREE.Vector3(x, 0, z))
  }
  return new THREE.CatmullRomCurve3(points, true)
}

export function createHeartShape(): THREE.Shape {
  const shape = new THREE.Shape()
  // Normalized heart shape roughly width 1, height 1
  shape.moveTo(0, 0.45)
  shape.bezierCurveTo(0.35, 0.85, 0.8, 0.35, 0, -0.55)
  shape.bezierCurveTo(-0.8, 0.35, -0.35, 0.85, 0, 0.45)
  return shape
}

export function createStarShape(points = 5, outer = 0.45, inner = 0.22): THREE.Shape {
  const shape = new THREE.Shape()
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner
    const angle = (Math.PI / points) * i - Math.PI / 2
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  return shape
}

export function createPetalShape(): THREE.Shape {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.bezierCurveTo(0.22, 0.35, 0.55, 0.28, 0.42, 0)
  shape.bezierCurveTo(0.55, -0.28, 0.22, -0.35, 0, 0)
  shape.bezierCurveTo(-0.22, -0.35, -0.55, -0.28, -0.42, 0)
  shape.bezierCurveTo(-0.55, 0.28, -0.22, 0.35, 0, 0)
  return shape
}

/* ------------------------------------------------------------------ */
/* Lathe profiles: solid beads with a real drilled hole through them   */
/* ------------------------------------------------------------------ */

const V2 = (x: number, y: number) => new THREE.Vector2(x, y)

/** Sphere-like round bead drilled through the Y axis. */
export function roundBeadProfile(radius: number, hole: number, arcSteps = 26): THREE.Vector2[] {
  const theta0 = Math.asin(Math.min(1, hole / radius))
  const capY = radius * Math.cos(theta0)
  const pts: THREE.Vector2[] = []
  for (let i = 0; i <= arcSteps; i++) {
    const theta = theta0 + ((Math.PI - 2 * theta0) * i) / arcSteps
    pts.push(V2(radius * Math.sin(theta), radius * Math.cos(theta)))
  }
  // inner wall of the drill hole, from the bottom opening back up to the top
  pts.push(V2(hole, -capY))
  pts.push(V2(hole * 0.96, 0))
  pts.push(V2(hole, capY))
  return pts
}

/** Rounded-capsule tube (spacers, pins) drilled through the Y axis. */
export function capsuleProfile(outerRadius: number, hole: number, halfHeight: number, fillet = 0.028, steps = 7): THREE.Vector2[] {
  const pts: THREE.Vector2[] = []
  // top annulus face
  pts.push(V2(hole, halfHeight))
  pts.push(V2(outerRadius - fillet, halfHeight))
  // top-right fillet arc
  for (let i = 1; i <= steps; i++) {
    const t = (i / steps) * (Math.PI / 2)
    pts.push(V2(outerRadius - fillet + fillet * Math.sin(t), halfHeight - fillet + fillet * Math.cos(t)))
  }
  // straight side
  pts.push(V2(outerRadius, -halfHeight + fillet))
  // bottom-right fillet arc
  for (let i = 1; i <= steps; i++) {
    const t = (i / steps) * (Math.PI / 2)
    pts.push(V2(outerRadius - fillet + fillet * Math.cos(t), -halfHeight + fillet - fillet * Math.sin(t)))
  }
  // bottom annulus face
  pts.push(V2(hole, -halfHeight))
  // inner wall back up
  pts.push(V2(hole * 0.94, 0))
  pts.push(V2(hole, halfHeight))
  return pts
}

/** Twisted cord spacer: capsule whose flank undulates in real geometry. */
export function twistedTubeProfile(outerRadius: number, hole: number, halfHeight: number, ridges = 5, amplitude = 0.016, steps = 72): THREE.Vector2[] {
  const pts: THREE.Vector2[] = []
  const rAt = (y: number) => outerRadius + amplitude * Math.cos((Math.PI * ridges * y) / (2 * halfHeight))
  pts.push(V2(hole, halfHeight))
  pts.push(V2(rAt(halfHeight), halfHeight))
  for (let i = 1; i <= steps; i++) {
    const y = halfHeight - (2 * halfHeight * i) / steps
    pts.push(V2(rAt(y), y))
  }
  pts.push(V2(hole, -halfHeight))
  pts.push(V2(hole * 0.94, 0))
  pts.push(V2(hole, halfHeight))
  return pts
}

/** Gently domed pebble button drilled through the Y axis. */
export function buttonProfile(radius: number, hole: number, halfHeight: number, dome = 0.032, steps = 12): THREE.Vector2[] {
  const pts: THREE.Vector2[] = []
  const crown = radius * 0.62
  const top = halfHeight + dome
  pts.push(V2(hole, top))
  pts.push(V2(crown, top))
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const angle = t * (Math.PI / 2)
    const x = crown + (radius - crown) * Math.sin(angle)
    const y = top * Math.pow(Math.cos(angle), 1.15)
    pts.push(V2(x, y))
  }
  // rim at 0 must connect both halves; mirror the dome downward
  for (let i = steps; i >= 1; i--) {
    const t = i / steps
    const angle = t * (Math.PI / 2)
    const x = crown + (radius - crown) * Math.sin(angle)
    const y = -top * Math.pow(Math.cos(angle), 1.15)
    pts.push(V2(x, y))
  }
  pts.push(V2(crown, -top))
  pts.push(V2(hole, -top))
  pts.push(V2(hole * 0.94, 0))
  pts.push(V2(hole, top))
  return pts
}

/** Thin rounded coin (charms) drilled along its own axis (Y). */
export function coinProfile(radius: number, hole: number, halfHeight: number, fillet = 0.024, steps = 7): THREE.Vector2[] {
  const pts: THREE.Vector2[] = []
  pts.push(V2(hole, halfHeight))
  pts.push(V2(radius - fillet, halfHeight))
  for (let i = 1; i <= steps; i++) {
    const t = (i / steps) * (Math.PI / 2)
    pts.push(V2(radius - fillet + fillet * Math.sin(t), halfHeight - fillet + fillet * Math.cos(t)))
  }
  pts.push(V2(radius, -halfHeight + fillet))
  for (let i = 1; i <= steps; i++) {
    const t = (i / steps) * (Math.PI / 2)
    pts.push(V2(radius - fillet + fillet * Math.cos(t), -halfHeight + fillet - fillet * Math.sin(t)))
  }
  pts.push(V2(hole, -halfHeight))
  pts.push(V2(hole * 0.92, 0))
  pts.push(V2(hole, halfHeight))
  return pts
}

/** flower outline: plump petals with pinched valleys, not a wavy coin */
export function createFlowerShape(lobes = 5, radius = 0.145, wave = 0.3, steps = 160): THREE.Shape {
  const shape = new THREE.Shape()
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2
    const c = Math.cos(lobes * theta)
    // sharpen tips, flatten shoulders: reads as petals instead of scallops
    const petal = Math.sign(c) * Math.pow(Math.abs(c), 1.55)
    const r = radius * (1 + wave * petal)
    const x = Math.cos(theta) * r
    const y = Math.sin(theta) * r
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  return shape
}
