import * as THREE from 'three'

/**
 * A tiny position-based-dynamics (verlet) simulation of the friendship
 * bracelet's cord. The rest shape is a soft ellipse lying flat, like a
 * bracelet resting on a display cushion — a gentle "rest spring" keeps the
 * jewellery-shot silhouette while full verlet integration, gravity, a floor
 * plane and fixed-length distance constraints let every bead bounce, swing
 * and settle with real momentum.
 *
 * Beads are rendered at dedicated particle indices, so the simulation drives
 * both the cord tube and the beads — nothing is animated by hand.
 */

export type BraceletPhysicsOptions = {
  radiusX?: number
  radiusZ?: number
  /** number of rope particles — must be well above bead count */
  particles?: number
}

const SUBSTEP = 1 / 60
const MAX_ACCUMULATED = 0.12

export class BraceletPhysics {
  readonly count: number
  private readonly pos: THREE.Vector3[] = []
  private readonly prev: THREE.Vector3[] = []
  private readonly rest: THREE.Vector3[] = []
  private readonly restLen: number[] = []
  private accumulator = 0
  /** local-space floor the cord can bounce against */
  floorY = -1.18

  constructor({ radiusX = 1.58, radiusZ = 1.18, particles = 84 }: BraceletPhysicsOptions = {}) {
    this.count = particles
    for (let i = 0; i < this.count; i++) {
      const t = (i / this.count) * Math.PI * 2
      const rest = new THREE.Vector3(Math.cos(t) * radiusX, 0, Math.sin(t) * radiusZ)
      this.rest.push(rest)
      this.pos.push(rest.clone())
      this.prev.push(rest.clone())
    }
    for (let i = 0; i < this.count; i++) {
      const next = (i + 1) % this.count
      this.restLen.push(this.rest[i].distanceTo(this.rest[next]))
    }
  }

  /** index of the particle a bead rides on */
  particleForBead(beadIndex: number, beadCount: number): number {
    if (beadCount <= 0) return 0
    return Math.round((beadIndex * this.count) / beadCount) % this.count
  }

  /** velocity kick applied to the particles near normalized arc parameter t ∈ [0, 1) */
  impulseAtParam(t: number, impulse: THREE.Vector3) {
    const center = ((t % 1) + 1) % 1
    this.impulseNear(Math.round(center * this.count) % this.count, impulse)
  }

  /** velocity kick centred on a particle index, spreading to neighbours */
  impulseNear(index: number, impulse: THREE.Vector3) {
    const reach = [0, -1, 1, -2, 2]
    const falloff = [1, 0.62, 0.62, 0.3, 0.3]
    for (let k = 0; k < reach.length; k++) {
      const i = (index + reach[k] + this.count) % this.count
      this.prev[i].addScaledVector(impulse, -SUBSTEP * falloff[k])
    }
  }

  /** a soft ambient nudge so the bracelet feels alive without any input */
  breeze(strength = 0.5) {
    const t = Math.random()
    const impulse = new THREE.Vector3(
      (Math.random() - 0.5) * strength,
      Math.random() * strength * 0.9 + strength * 0.25,
      (Math.random() - 0.5) * strength,
    )
    this.impulseAtParam(t, impulse)
  }

  /** nudge everything at once — used when beads are added or removed */
  ripple(strength = 1.1) {
    for (let i = 0; i < this.count; i += 3) {
      const kick = new THREE.Vector3(
        (Math.random() - 0.5) * strength,
        Math.random() * strength * 0.7,
        (Math.random() - 0.5) * strength,
      )
      this.prev[i].addScaledVector(kick, -SUBSTEP)
    }
  }

  step(deltaSeconds: number) {
    this.accumulator = Math.min(this.accumulator + deltaSeconds, MAX_ACCUMULATED)
    while (this.accumulator >= SUBSTEP) {
      this.substep(SUBSTEP)
      this.accumulator -= SUBSTEP
    }
  }

  private substep(dt: number) {
    const damping = 0.985
    const gravity = -7.5
    const restSpringXZ = 0.05
    const restSpringY = 0.085

    // integrate
    for (let i = 0; i < this.count; i++) {
      const p = this.pos[i]
      const prev = this.prev[i]
      const vx = (p.x - prev.x) * damping
      const vy = (p.y - prev.y) * damping
      const vz = (p.z - prev.z) * damping
      prev.copy(p)
      p.x += vx
      p.y += vy + gravity * dt * dt
      p.z += vz
      // soft pull toward the jewellery rest pose (vertically steadier than horizontally,
      // so the ellipse keeps its silhouette but still bounces and swings)
      p.x += (this.rest[i].x - p.x) * restSpringXZ
      p.z += (this.rest[i].z - p.z) * restSpringXZ
      p.y += (this.rest[i].y - p.y) * restSpringY
      // invisible display-table floor
      if (p.y < this.floorY) {
        p.y = this.floorY
        prev.y = p.y
      }
    }

    // inextensible cord, solved by relaxation
    const tmp = new THREE.Vector3()
    for (let iter = 0; iter < 7; iter++) {
      for (let i = 0; i < this.count; i++) {
        const j = (i + 1) % this.count
        const a = this.pos[i]
        const b = this.pos[j]
        tmp.subVectors(b, a)
        const dist = tmp.length()
        if (dist < 1e-6) continue
        const correction = ((dist - this.restLen[i]) / dist) * 0.5
        a.addScaledVector(tmp, correction)
        b.addScaledVector(tmp, -correction)
      }
    }
  }

  /** live particle positions (internal array — do not mutate) */
  points(): readonly THREE.Vector3[] {
    return this.pos
  }

  pointAt(index: number): THREE.Vector3 {
    return this.pos[((index % this.count) + this.count) % this.count]
  }

  /** tangent of the cord at a particle, from its neighbours */
  tangentAt(index: number, target: THREE.Vector3): THREE.Vector3 {
    const prev = this.pointAt(index - 1)
    const next = this.pointAt(index + 1)
    return target.subVectors(next, prev).normalize()
  }
}
