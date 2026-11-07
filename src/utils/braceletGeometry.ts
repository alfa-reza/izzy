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
