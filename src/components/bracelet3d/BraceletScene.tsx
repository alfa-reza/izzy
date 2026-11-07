import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, Sparkles } from '@react-three/drei'
import { getBeadDef, getCordDef } from '../../content/braceletCatalog'
import {
  createFlowerShape,
  createHeartShape,
  createStarShape,
  roundBeadProfile,
  capsuleProfile,
  twistedTubeProfile,
  buttonProfile,
} from '../../utils/braceletGeometry'
import { BraceletPhysics } from '../../utils/braceletPhysics'
import {
  getBackdropTexture,
  getBrushedMetal,
  getCeramicSpeckle,
  getCordWeaveTextures,
  getPearlSwirl,
  getRoughnessNoise,
} from './textures'

type Props = {
  cordId: string
  beads: string[]
  selectedIndex: number | null
  onSelect: (index: number) => void
  autoSpin?: boolean
}

const GOLD_IDS = new Set(['gold-spacer', 'little-star', 'star-twinkle', 'tiny-cutie'])
const SILVER_IDS = new Set(['little-moon'])
const GLASS_IDS = new Set(['spark-bead'])
const CORD_RADIUS = 0.04

const easeOutBack = (t: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

/* ------------------------------------------------------------------ */
/* Cord                                                                */
/* ------------------------------------------------------------------ */

function BraceletCord({ color, tubeRef }: { color: string; tubeRef: React.RefObject<THREE.Mesh | null> }) {
  const { map, bump } = useMemo(() => getCordWeaveTextures(), [])
  return (
    <mesh ref={tubeRef} castShadow receiveShadow>
      <meshPhysicalMaterial
        color={color}
        map={map}
        bumpMap={bump}
        bumpScale={0.6}
        roughness={0.99}
        metalness={0}
        sheen={0.18}
        sheenColor="#ffffff"
        sheenRoughness={0.85}
        envMapIntensity={0.12}
      />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/* Materials — toned down from "candy CGI" to honest jewellery          */
/* ------------------------------------------------------------------ */

function GoldMaterial({ color, roughness = 0.34 }: { color: string; roughness?: number }) {
  const brushed = useMemo(() => getBrushedMetal(), [])
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={0.85}
      roughness={roughness}
      roughnessMap={brushed}
      bumpMap={brushed}
      bumpScale={0.12}
      envMapIntensity={1.6}
      reflectivity={1}
      side={THREE.DoubleSide}
    />
  )
}

function RoundMaterial({ color }: { color: string }) {
  const pearl = useMemo(() => getPearlSwirl(), [])
  const noise = useMemo(() => getRoughnessNoise(), [])
  return (
    <meshPhysicalMaterial
      color={color}
      map={pearl}
      roughness={0.36}
      roughnessMap={noise}
      metalness={0}
      clearcoat={0.55}
      clearcoatRoughness={0.22}
      iridescence={0.34}
      iridescenceIOR={1.3}
      iridescenceThicknessRange={[150, 430]}
      specularIntensity={0.9}
      bumpMap={pearl}
      bumpScale={0.035}
      envMapIntensity={0.85}
      side={THREE.DoubleSide}
    />
  )
}

function CeramicMaterial({ color }: { color: string }) {
  const speckle = useMemo(() => getCeramicSpeckle(color), [color])
  const noise = useMemo(() => getRoughnessNoise(), [])
  return (
    <meshPhysicalMaterial
      color="#ffffff"
      map={speckle}
      bumpMap={speckle}
      bumpScale={0.35}
      roughness={0.52}
      roughnessMap={noise}
      metalness={0}
      clearcoat={0.4}
      clearcoatRoughness={0.32}
      specularIntensity={0.85}
      envMapIntensity={0.65}
      side={THREE.DoubleSide}
    />
  )
}

function GlassMaterial({ color, iridescence = 0.4 }: { color: string; iridescence?: number }) {
  const noise = useMemo(() => getRoughnessNoise(), [])
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.24}
      roughnessMap={noise}
      metalness={0}
      clearcoat={0.85}
      clearcoatRoughness={0.16}
      iridescence={iridescence}
      iridescenceIOR={1.3}
      iridescenceThicknessRange={[130, 480]}
      specularIntensity={1}
      envMapIntensity={0.85}
      side={THREE.DoubleSide}
    />
  )
}

function SatinMaterial({ color, emissive, emissiveIntensity = 0 }: { color: string; emissive?: string; emissiveIntensity?: number }) {
  const noise = useMemo(() => getRoughnessNoise(), [])
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.41}
      roughnessMap={noise}
      metalness={0}
      sheen={0.9}
      sheenColor="#ffffff"
      sheenRoughness={0.5}
      clearcoat={0.26}
      clearcoatRoughness={0.38}
      envMapIntensity={0.65}
      emissive={emissive ?? '#000000'}
      emissiveIntensity={emissiveIntensity}
      side={THREE.DoubleSide}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Bead shapes — round, tube, button and pin beads carry real holes    */
/* ------------------------------------------------------------------ */

type ShapeProps = { color: string; accent?: string; scale: number; beadId: string }

function RoundBead({ color, scale, beadId }: ShapeProps) {
  const gold = GOLD_IDS.has(beadId)
  const glass = GLASS_IDS.has(beadId)
  const geometry = useMemo(() => new THREE.LatheGeometry(roundBeadProfile(0.178 * scale, 0.048 * scale), 56), [scale])
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      {gold ? <GoldMaterial color={color} roughness={0.42} /> : glass ? <GlassMaterial color={color} /> : <RoundMaterial color={color} />}
    </mesh>
  )
}

function ButtonBead({ color, scale }: ShapeProps) {
  const dome = 0.03 * scale
  const halfHeight = 0.048 * scale
  const radius = 0.172 * scale
  const geometry = useMemo(
    () => new THREE.LatheGeometry(buttonProfile(radius, 0.046 * scale, halfHeight, dome), 48),
    [radius, halfHeight, dome, scale],
  )
  const holeColor = useMemo(() => `#${new THREE.Color(color).multiplyScalar(0.3).getHexString()}`, [color])
  const dotOffset = 0.088 * scale
  const dotY = halfHeight + dome - 0.001
  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <CeramicMaterial color={color} />
      </mesh>
      {/* four stitched buttonholes around the real cord hole */}
      {[
        [dotOffset, dotOffset],
        [-dotOffset, dotOffset],
        [dotOffset, -dotOffset],
        [-dotOffset, -dotOffset],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, dotY, z]}>
          <sphereGeometry args={[0.016 * scale, 14, 14]} />
          <meshStandardMaterial color={holeColor} roughness={0.75} />
        </mesh>
      ))}
    </group>
  )
}

function TubeBead({ color, scale, beadId }: ShapeProps) {
  const gold = GOLD_IDS.has(beadId)
  const twisted = beadId === 'twisted-spacer'
  const radius = 0.088 * scale
  const halfHeight = 0.155 * scale
  const geometry = useMemo(
    () =>
      twisted
        ? new THREE.LatheGeometry(twistedTubeProfile(radius, 0.046 * scale, halfHeight, 5, 0.015 * scale), 56)
        : new THREE.LatheGeometry(capsuleProfile(radius, 0.047 * scale, halfHeight, 0.02 * scale), 40),
    [twisted, radius, halfHeight, scale],
  )
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      {gold ? <GoldMaterial color={color} roughness={0.28} /> : twisted ? <SatinMaterial color={color} /> : <CeramicMaterial color={color} />}
    </mesh>
  )
}

function PinBead({ color, scale }: ShapeProps) {
  const geometry = useMemo(() => new THREE.LatheGeometry(capsuleProfile(0.112 * scale, 0.046 * scale, 0.105 * scale, 0.055 * scale), 40), [scale])
  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <RoundMaterial color={color} />
      </mesh>
      {/* metallic pin tail */}
      <mesh position={[0, -0.175 * scale, 0]} castShadow>
        <cylinderGeometry args={[0.024 * scale, 0.013 * scale, 0.13 * scale, 12]} />
        <meshStandardMaterial color="#cfcadf" metalness={0.95} roughness={0.3} envMapIntensity={1.1} />
      </mesh>
    </group>
  )
}

function HeartBead({ color, accent, scale, beadId }: ShapeProps) {
  const geometry = useMemo(() => {
    const shape = createHeartShape()
    const hole = new THREE.Path()
    hole.absarc(0, 0.02, 0.085 / 0.38, 0, Math.PI * 2, true)
    shape.holes.push(hole)
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.17 * scale,
      bevelEnabled: true,
      bevelThickness: 0.05 * scale,
      bevelSize: 0.045 * scale,
      bevelSegments: 4,
      curveSegments: 26,
    })
    geo.center()
    return geo
  }, [scale])
  const glowing = beadId === 'glow-heart'
  return (
    <group scale={0.38 * scale}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <SatinMaterial
          color={color}
          emissive={glowing ? color : accent}
          emissiveIntensity={glowing ? 0.2 : accent ? 0.1 : 0}
        />
      </mesh>
    </group>
  )
}

function AmberGlassMaterial({ color }: { color: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.14}
      metalness={0}
      clearcoat={0.6}
      clearcoatRoughness={0.12}
      transmission={0.75}
      thickness={0.55}
      ior={1.45}
      attenuationColor="#ff9e2c"
      attenuationDistance={0.55}
      specularIntensity={0.8}
      envMapIntensity={0.9}
      side={THREE.DoubleSide}
    />
  )
}

function StarBead({ color, scale, beadId }: ShapeProps) {
  const geometry = useMemo(() => {
    const shape = createStarShape(5, 0.21 * scale, 0.1 * scale)
    const hole = new THREE.Path()
    hole.absarc(0, 0, 0.075, 0, Math.PI * 2, true)
    shape.holes.push(hole)
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.135 * scale,
      bevelEnabled: true,
      bevelThickness: 0.04 * scale,
      bevelSize: 0.036 * scale,
      bevelSegments: 5,
      curveSegments: 10,
    })
    geo.center()
    return geo
  }, [scale])
  const amber = beadId === 'little-star' || beadId === 'star-twinkle'
  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        {amber ? <AmberGlassMaterial color={color} /> : <GlassMaterial color={color} iridescence={0.5} />}
      </mesh>
    </group>
  )
}

function FlowerBead({ color, accent, scale }: ShapeProps) {
  // one honest scalloped flower, extruded — drilled through the face
  const geometry = useMemo(() => {
    const shape = createFlowerShape(5, 0.142 * scale, 0.34)
    const hole = new THREE.Path()
    hole.absarc(0, 0, 0.055, 0, Math.PI * 2, true)
    shape.holes.push(hole)
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.115 * scale,
      bevelEnabled: true,
      bevelThickness: 0.048 * scale,
      bevelSize: 0.042 * scale,
      bevelSegments: 4,
      curveSegments: 24,
    })
    geo.center()
    return geo
  }, [scale])
  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <SatinMaterial color={color} />
      </mesh>
      {/* raised golden center, domed like the real one */}
      <mesh position={[0, 0, 0.062 * scale]} castShadow>
        <sphereGeometry args={[0.062 * scale, 22, 11, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <GoldMaterial color={accent ?? '#e9bd57'} roughness={0.38} />
      </mesh>
    </group>
  )
}

function CharmBead({ color, accent, scale, beadId }: ShapeProps) {
  const gold = GOLD_IDS.has(beadId)
  const silver = SILVER_IDS.has(beadId)
  const metal = gold || silver
  const metalColor = gold ? '#e0aa4a' : '#d5d5ec'
  const coinGeometry = useMemo(() => {
    const pts: THREE.Vector2[] = [
      new THREE.Vector2(0.068 * scale, 0.055 * scale),
      new THREE.Vector2(0.145 * scale, 0.055 * scale),
      new THREE.Vector2(0.16 * scale, 0.036 * scale),
      new THREE.Vector2(0.16 * scale, -0.036 * scale),
      new THREE.Vector2(0.145 * scale, -0.055 * scale),
      new THREE.Vector2(0.068 * scale, -0.055 * scale),
      new THREE.Vector2(0.064 * scale, 0),
      new THREE.Vector2(0.068 * scale, 0.055 * scale),
    ]
    const geo = new THREE.LatheGeometry(pts, 48)
    geo.rotateX(Math.PI / 2)
    return geo
  }, [scale])
  return (
    <group>
      {/* enameled badge, drilled front to back — the way letter beads are */}
      <mesh geometry={coinGeometry} castShadow receiveShadow>
        {metal ? <GoldMaterial color={metalColor} roughness={0.3} /> : <SatinMaterial color={color} />}
      </mesh>
      {/* domed enamel inlay on the outward face */}
      <mesh position={[0, 0, 0.052 * scale]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <sphereGeometry args={[0.105 * scale, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        {metal ? (
          <meshPhysicalMaterial color={color} roughness={0.22} clearcoat={0.8} clearcoatRoughness={0.15} envMapIntensity={0.9} />
        ) : (
          <meshPhysicalMaterial color={accent ?? '#fff3d2'} roughness={0.2} clearcoat={0.8} clearcoatRoughness={0.12} emissive={accent ?? '#ffd788'} emissiveIntensity={0.16} envMapIntensity={0.85} />
        )}
      </mesh>
      {/* little bronze jump ring on top of the badge */}
      <mesh position={[0, 0.155 * scale, 0]}>
        <torusGeometry args={[0.036 * scale, 0.0105 * scale, 10, 22]} />
        <meshStandardMaterial color="#b99a7e" metalness={0.9} roughness={0.38} envMapIntensity={1.05} />
      </mesh>
    </group>
  )
}

function BeadShape({ def, shapeProps }: { def: NonNullable<ReturnType<typeof getBeadDef>>; shapeProps: ShapeProps }) {
  switch (def.shape) {
    case 'round':
      return <RoundBead {...shapeProps} />
    case 'button':
      return <ButtonBead {...shapeProps} />
    case 'tube':
      return <TubeBead {...shapeProps} />
    case 'pin':
      return <PinBead {...shapeProps} />
    case 'heart':
      return <HeartBead {...shapeProps} />
    case 'star':
      return <StarBead {...shapeProps} />
    case 'flower':
      return <FlowerBead {...shapeProps} />
    case 'charm':
      return <CharmBead {...shapeProps} />
    default:
      return <RoundBead {...shapeProps} />
  }
}

const TUBE_LIKE = new Set(['button', 'tube', 'pin'])

/* ------------------------------------------------------------------ */
/* Bead instance — transform driven by the physics rig                 */
/* ------------------------------------------------------------------ */

type BeadInstanceProps = {
  beadId: string
  def: NonNullable<ReturnType<typeof getBeadDef>>
  selected: boolean
  index: number
  onSelect: (index: number) => void
  onFlink: (index: number) => void
  registerRef: (index: number, group: THREE.Group | null) => void
}

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function BeadInstance({ beadId, def, selected, index, onSelect, onFlink, registerRef }: BeadInstanceProps) {
  const innerRef = useRef<THREE.Group>(null)
  // pop-in spring: starts negative for a gentle stagger on first mount
  const pop = useRef(reducedMotion() ? 1 : -index * 0.09 - 0.25)
  const scaleNow = useRef(0.01)

  useFrame((_, delta) => {
    const inner = innerRef.current
    if (!inner) return
    if (pop.current < 1) pop.current = Math.min(1, pop.current + delta * 1.7)
    const t = Math.max(0, pop.current)
    const popScale = t >= 1 ? 1 : Math.max(0.01, easeOutBack(t))
    const target = (selected ? 1.12 : 1) * popScale
    scaleNow.current = THREE.MathUtils.damp(scaleNow.current, target, 9, delta)
    inner.scale.setScalar(scaleNow.current)
  })

  return (
    <group
      ref={(node) => registerRef(index, node)}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(index)
        onFlink(index)
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <group ref={innerRef} scale={0.01}>
        <BeadShape def={def} shapeProps={{ color: def.baseColor, accent: def.accentColor, scale: def.scale, beadId }} />
      </group>
      {/* invisible, generous hit target so small charms are easy to click */}
      <mesh visible={false}>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

const RADIUS_X = 1.58
const RADIUS_Z = 1.18

export default function BraceletScene({ cordId, beads, selectedIndex, onSelect, autoSpin }: Props) {
  const cord = getCordDef(cordId)
  const backdrop = useMemo(() => getBackdropTexture(), [])
  const groupRef = useRef<THREE.Group>(null)
  const tubeRef = useRef<THREE.Mesh>(null)
  const haloRef = useRef<THREE.Mesh>(null)
  const beadRefs = useRef<(THREE.Group | null)[]>([])
  const knotRefs = useRef<(THREE.Mesh | null)[]>([])
  const breezeTimer = useRef(3.5)
  const previousBeads = useRef<string[]>(beads)

  const simRef = useRef<BraceletPhysics | null>(null)
  if (!simRef.current) {
    simRef.current = new BraceletPhysics({ radiusX: RADIUS_X, radiusZ: RADIUS_Z, particles: 84 })
  }
  const sim = simRef.current

  // an honest little macramé knot sits on the cord between every two beads
  const knotGeometry = useMemo(() => new THREE.SphereGeometry(0.05, 18, 14), [])
  const knotMaterial = useMemo(() => {
    const { bump } = getCordWeaveTextures()
    return new THREE.MeshPhysicalMaterial({
      color: cord ? new THREE.Color(cord.color).multiplyScalar(0.58) : new THREE.Color('#5d4c63'),
      roughness: 0.96,
      metalness: 0,
      sheen: 0.5,
      sheenColor: '#ffffff',
      sheenRoughness: 0.6,
      bumpMap: bump,
      bumpScale: 0.7,
      envMapIntensity: 0.22,
    })
  }, [cord])

  // impulse when the bead list changes (bead plunked on / slid off)
  useEffect(() => {
    const prev = previousBeads.current
    if (beads.length > prev.length) {
      sim.ripple(1.15)
      const added = beads.length - 1
      const outward = new THREE.Vector3(
        Math.cos((added / Math.max(1, beads.length)) * Math.PI * 2),
        0.9,
        Math.sin((added / Math.max(1, beads.length)) * Math.PI * 2),
      ).normalize()
      sim.impulseAtParam(added / Math.max(1, beads.length), outward.multiplyScalar(2.6))
    } else if (beads.length < prev.length) {
      sim.ripple(0.8)
    }
    previousBeads.current = beads
  }, [beads, sim])

  const registerRef = (index: number, group: THREE.Group | null) => {
    beadRefs.current[index] = group
  }

  const flink = (index: number) => {
    const total = Math.max(1, beads.length)
    const t = index / total
    const impulse = new THREE.Vector3(Math.cos(t * Math.PI * 2), 1.15, Math.sin(t * Math.PI * 2))
      .normalize()
      .multiplyScalar(3.1)
    impulse.x += (Math.random() - 0.5) * 1.6
    impulse.z += (Math.random() - 0.5) * 1.6
    sim.impulseAtParam(t, impulse)
  }

  // scratch objects (allocated once)
  const fx = useMemo(
    () => ({
      tangent: new THREE.Vector3(),
      radial: new THREE.Vector3(),
      xAxis: new THREE.Vector3(),
      yAxis: new THREE.Vector3(),
      zAxis: new THREE.Vector3(),
      basis: new THREE.Matrix4(),
      offset: new THREE.Vector3(),
      ref: new THREE.Vector3(0, 1, 0),
      alt: new THREE.Vector3(1, 0, 0),
    }),
    [],
  )

  useFrame((state, delta) => {
    sim.step(Math.min(delta, 0.05))

    // gentle ambient breeze so the jewellery feels alive on the table
    breezeTimer.current -= delta
    if (breezeTimer.current <= 0) {
      sim.breeze(0.55)
      breezeTimer.current = 5 + Math.random() * 4.5
    }

    // rebuild the cord along the simulated rope
    const tube = tubeRef.current
    if (tube) {
      const curve = new THREE.CatmullRomCurve3([...sim.points()], true, 'centripetal')
      const geometry = new THREE.TubeGeometry(curve, 150, CORD_RADIUS, 14, true)
      const old = tube.geometry
      tube.geometry = geometry
      old.dispose()
    }

    // macramé knots tucked between every neighbouring pair of beads
    const knotCount = beads.length
    for (let i = 0; i < knotCount; i++) {
      const knot = knotRefs.current[i]
      if (!knot) continue
      const a = sim.particleForBead(i, beads.length)
      const b = i + 1 >= beads.length ? sim.count : sim.particleForBead(i + 1, beads.length)
      const mid = (a + b) / 2
      const index0 = Math.floor(mid) % sim.count
      const index1 = (index0 + 1) % sim.count
      const frac = mid - Math.floor(mid)
      const p0 = sim.pointAt(index0)
      const p1 = sim.pointAt(index1)
      knot.position.lerpVectors(p0, p1, frac)
      fx.tangent.subVectors(p1, p0)
      if (fx.tangent.lengthSq() > 1e-8) {
        fx.tangent.normalize()
        fx.yAxis.copy(fx.tangent)
        fx.xAxis.crossVectors(Math.abs(fx.yAxis.y) < 0.92 ? fx.ref : fx.alt, fx.yAxis).normalize()
        fx.zAxis.crossVectors(fx.xAxis, fx.yAxis).normalize()
        fx.basis.makeBasis(fx.xAxis, fx.yAxis, fx.zAxis)
        knot.quaternion.setFromRotationMatrix(fx.basis)
      }
    }

    for (let i = 0; i < beads.length; i++) {
      const beadGroup = beadRefs.current[i]
      if (!beadGroup) continue
      const particle = sim.particleForBead(i, beads.length)
      const p = sim.pointAt(particle)
      beadGroup.position.copy(p)

      const def = getBeadDef(beads[i])
      sim.tangentAt(particle, fx.tangent)

      fx.radial.set(p.x, 0, p.z)
      if (fx.radial.lengthSq() < 1e-6) fx.radial.set(1, 0, 0)
      fx.radial.normalize()

      if (def && TUBE_LIKE.has(def.shape)) {
        // bead axis follows the cord, hole rides the string
        fx.yAxis.copy(fx.tangent)
        fx.xAxis.crossVectors(Math.abs(fx.yAxis.y) < 0.92 ? fx.ref : fx.alt, fx.yAxis).normalize()
        fx.zAxis.crossVectors(fx.xAxis, fx.yAxis).normalize()
        fx.offset.set(0, 0, 0)
      } else {
        // charms face outward; the hole axis stays true to the cord
        fx.zAxis.copy(fx.radial)
        fx.xAxis.copy(fx.tangent).addScaledVector(fx.zAxis, -fx.tangent.dot(fx.zAxis)).normalize()
        fx.yAxis.crossVectors(fx.zAxis, fx.xAxis).normalize()
        // keep charms upright no matter which way the cord runs
        if (fx.yAxis.y < 0) {
          fx.xAxis.negate()
          fx.yAxis.negate()
        }
        // float the charm just off the cord so rope never clips its face
        fx.offset.copy(fx.radial).multiplyScalar(0.028)
      }
      fx.basis.makeBasis(fx.xAxis, fx.yAxis, fx.zAxis)
      beadGroup.quaternion.setFromRotationMatrix(fx.basis)
      beadGroup.position.add(fx.offset)
    }

    // selection halo rides the selected bead
    const halo = haloRef.current
    if (halo) {
      if (selectedIndex !== null && selectedIndex < beads.length) {
        const particle = sim.particleForBead(selectedIndex, beads.length)
        const p = sim.pointAt(particle)
        halo.visible = true
        halo.position.copy(p)
        fx.radial.set(p.x, 0, p.z)
        if (fx.radial.lengthSq() < 1e-6) fx.radial.set(1, 0, 0)
        fx.radial.normalize()
        fx.zAxis.copy(fx.radial)
        fx.yAxis.set(0, 1, 0)
        fx.xAxis.crossVectors(fx.yAxis, fx.zAxis).normalize()
        fx.yAxis.crossVectors(fx.zAxis, fx.xAxis).normalize()
        fx.basis.makeBasis(fx.xAxis, fx.yAxis, fx.zAxis)
        halo.quaternion.setFromRotationMatrix(fx.basis)
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 3.1) * 0.07
        halo.scale.setScalar(pulse)
      } else {
        halo.visible = false
      }
    }

    // slow showroom turntable
    if (autoSpin && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4
    }
  })

  return (
    <>
      {/* opaque warm backdrop so translucent beads have something to refract */}
      <primitive attach="background" object={backdrop} />

      {/* warm studio lighting with a soft top softbox */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[3.6, 6, 2.6]}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-3.2}
        shadow-camera-right={3.2}
        shadow-camera-top={3.2}
        shadow-camera-bottom={-3.2}
        shadow-camera-near={0.5}
        shadow-camera-far={16}
        shadow-bias={-0.00022}
      />
      <directionalLight position={[-4.5, 2.4, -2.6]} intensity={0.5} color="#ffd9e6" />
      <directionalLight position={[0.5, 3.2, -5]} intensity={0.62} color="#cfe4ff" />

      {/* image-based lighting built on the spot — no network HDRIs needed */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#352833']} />
        <Lightformer form="rect" intensity={4.3} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[7, 7, 1]} color="#fff3e0" />
        <Lightformer form="rect" intensity={2.5} position={[-5, 1.6, 1.2]} rotation-y={Math.PI / 2.35} scale={[5, 2.6, 1]} color="#ffd6e7" />
        <Lightformer form="rect" intensity={2.5} position={[5, 1.2, 1.4]} rotation-y={-Math.PI / 2.35} scale={[5, 2.6, 1]} color="#d3e9ff" />
        <Lightformer form="circle" intensity={2.0} position={[0, 2.6, -5]} scale={2.6} color="#ffe6bd" />
        <Lightformer form="rect" intensity={1.6} position={[0, 1.4, 6]} rotation-y={Math.PI} scale={[8, 5, 1]} color="#fff6ee" />
      </Environment>

      {/* drifting gold dust motes */}
      <Sparkles count={40} scale={[3.6, 2.1, 3.6]} position={[0, 0.25, 0]} size={2.1} speed={0.32} opacity={0.55} color="#ffd98f" />

      {/* soft contact shadow under the bracelet */}
      <ContactShadows position={[0, -1.3, 0]} opacity={0.46} scale={9.5} blur={2.7} far={2.6} resolution={512} color="#452b47" />

      <group ref={groupRef} position={[0, 0.12, 0]}>
        {cord ? <BraceletCord color={cord.color} tubeRef={tubeRef} /> : null}

        {beads.map((id, index) => {
          const def = getBeadDef(id)
          if (!def) return null
          return (
            <BeadInstance
              key={`${index}-${id}`}
              beadId={id}
              def={def}
              index={index}
              selected={selectedIndex === index}
              onSelect={onSelect}
              onFlink={flink}
              registerRef={registerRef}
            />
          )
        })}

        {/* little macramé knots between every pair of neighbouring beads */}
        {cord
          ? beads.map((_, i) => (
              <mesh
                key={`knot-${i}`}
                ref={(node) => {
                  knotRefs.current[i] = node
                }}
                geometry={knotGeometry}
                material={knotMaterial}
                scale={[1.02, 1.5, 1.02]}
                castShadow
              />
            ))
          : null}

        {/* pulsing halo around the selected bead */}
        <mesh ref={haloRef} visible={false}>
          <torusGeometry args={[0.3, 0.02, 12, 44]} />
          <meshBasicMaterial color="#a76ce0" transparent opacity={0.9} depthWrite={false} />
        </mesh>
      </group>
    </>
  )
}
