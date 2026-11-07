import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { getBeadDef, getCordDef } from '../../content/braceletCatalog'
import { createBraceletCurve, createHeartShape, createStarShape } from '../../utils/braceletGeometry'

type Props = {
  cordId: string
  beads: string[]
  selectedIndex: number | null
  onSelect: (index: number) => void
  autoSpin?: boolean
}

function BraceletCord({ curve, color }: { curve: THREE.CatmullRomCurve3; color: string }) {
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 96, 0.065, 16, true), [curve])
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.55} metalness={0.05} />
    </mesh>
  )
}

function BeadSelectionRing({ position }: { position: THREE.Vector3 }) {
  return (
    <mesh position={position.clone().add(new THREE.Vector3(0, 0.22, 0))} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.22, 0.26, 32]} />
      <meshBasicMaterial color="#4c3370" transparent opacity={0.9} side={THREE.DoubleSide} />
    </mesh>
  )
}

function RoundBead({ color, accent, scale, selected }: { color: string; accent?: string; scale: number; selected?: boolean }) {
  return (
    <group scale={selected ? 1.12 : 1}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.19 * scale, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.28} metalness={0.08} />
      </mesh>
      {accent ? (
        <mesh position={[0.06, 0.06, 0.06]}>
          <sphereGeometry args={[0.06 * scale, 16, 16]} />
          <meshStandardMaterial color={accent} roughness={0.2} metalness={0.1} emissive={accent} emissiveIntensity={0.15} />
        </mesh>
      ) : null}
    </group>
  )
}

function ButtonBead({ color, scale, selected }: { color: string; scale: number; selected?: boolean }) {
  return (
    <group scale={selected ? 1.12 : 1}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.18 * scale, 0.18 * scale, 0.095 * scale, 28]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.06} />
      </mesh>
      {/* 4 holes hint */}
      <group position={[0, 0.05, 0]}>
        <mesh position={[0.06, 0, 0.02]}><sphereGeometry args={[0.022, 10, 10]} /><meshStandardMaterial color="#2d3a5a" /></mesh>
        <mesh position={[-0.06, 0, 0.02]}><sphereGeometry args={[0.022, 10, 10]} /><meshStandardMaterial color="#2d3a5a" /></mesh>
        <mesh position={[0.06, 0, -0.02]}><sphereGeometry args={[0.022, 10, 10]} /><meshStandardMaterial color="#2d3a5a" /></mesh>
        <mesh position={[-0.06, 0, -0.02]}><sphereGeometry args={[0.022, 10, 10]} /><meshStandardMaterial color="#2d3a5a" /></mesh>
      </group>
    </group>
  )
}

function TubeBead({ color, scale, selected }: { color: string; scale: number; selected?: boolean }) {
  return (
    <group scale={selected ? 1.12 : 1}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.09 * scale, 0.09 * scale, 0.34 * scale, 18]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.08} />
      </mesh>
    </group>
  )
}

function PinBead({ color, scale, selected }: { color: string; scale: number; selected?: boolean }) {
  // pin is like tube but slightly tapered + pin tail hint
  return (
    <group scale={selected ? 1.12 : 1}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.11 * scale, 0.11 * scale, 0.22 * scale, 16]} />
        <meshStandardMaterial color={color} roughness={0.33} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.16 * scale, 0]}>
        <cylinderGeometry args={[0.025 * scale, 0.015 * scale, 0.12 * scale, 10]} />
        <meshStandardMaterial color="#7a6a68" roughness={0.6} />
      </mesh>
    </group>
  )
}

function HeartBead({ color, accent, scale, selected }: { color: string; accent?: string; scale: number; selected?: boolean }) {
  const heartShape = useMemo(() => createHeartShape(), [])
  const extrudeSettings = useMemo(() => ({ depth: 0.12 * scale, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 3 }), [scale])
  const geometry = useMemo(() => new THREE.ExtrudeGeometry(heartShape, extrudeSettings), [heartShape, extrudeSettings])
  // center geometry
  useMemo(() => {
    geometry.center()
  }, [geometry])
  return (
    <group scale={selected ? 1.16 : 1}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.04} />
      </mesh>
      {accent && scale > 1 ? (
        <mesh position={[0, 0, 0.09]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.3} roughness={0.4} />
        </mesh>
      ) : null}
    </group>
  )
}

function StarBead({ color, scale, selected }: { color: string; scale: number; selected?: boolean }) {
  const starShape = useMemo(() => createStarShape(5, 0.33 * scale, 0.16 * scale), [scale])
  const extrudeSettings = useMemo(() => ({ depth: 0.11 * scale, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.015, bevelSegments: 2 }), [scale])
  const geometry = useMemo(() => new THREE.ExtrudeGeometry(starShape, extrudeSettings), [starShape, extrudeSettings])
  useMemo(() => geometry.center(), [geometry])
  return (
    <group scale={selected ? 1.14 : 1}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} />
      </mesh>
    </group>
  )
}

function FlowerBead({ color, accent, scale, selected }: { color: string; accent?: string; scale: number; selected?: boolean }) {
  // compose flower from 5 petal spheres around center
  const petalColor = color
  const centerColor = accent ?? '#f0d07a'
  return (
    <group scale={selected ? 1.14 : 1}>
      {[0, 72, 144, 216, 288].map((deg) => {
        const rad = (deg * Math.PI) / 180
        const x = Math.cos(rad) * 0.11
        const y = Math.sin(rad) * 0.11
        return (
          <mesh key={deg} position={[x * scale, y * scale, 0]} castShadow>
            <sphereGeometry args={[0.095 * scale, 14, 14]} />
            <meshStandardMaterial color={petalColor} roughness={0.42} />
          </mesh>
        )
      })}
      <mesh castShadow>
        <sphereGeometry args={[0.09 * scale, 16, 16]} />
        <meshStandardMaterial color={centerColor} roughness={0.3} emissive={centerColor} emissiveIntensity={0.12} />
      </mesh>
    </group>
  )
}

function CharmBead({ color, accent, scale, selected }: { color: string; accent?: string; scale: number; selected?: boolean }) {
  return (
    <group scale={selected ? 1.15 : 1}>
      {/* flat disc base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.2 * scale, 0.2 * scale, 0.07 * scale, 24]} />
        <meshStandardMaterial color={color} roughness={0.32} metalness={0.12} />
      </mesh>
      {/* tiny sparkle */}
      <mesh position={[0, 0.07 * scale, 0]}>
        <sphereGeometry args={[0.04 * scale, 12, 12]} />
        <meshStandardMaterial color={accent ?? '#fffde8'} emissive={accent ?? '#fff8aa'} emissiveIntensity={0.6} />
      </mesh>
      {/* little loop at top */}
      <mesh position={[0, 0.18 * scale, 0]}>
        <torusGeometry args={[0.05 * scale, 0.014 * scale, 10, 16]} />
        <meshStandardMaterial color="#b59b8a" roughness={0.5} />
      </mesh>
    </group>
  )
}

function getBeadComponent(shape: string) {
  switch (shape) {
    case 'round':
      return RoundBead
    case 'button':
      return ButtonBead
    case 'tube':
      return TubeBead
    case 'pin':
      return PinBead
    case 'heart':
      return HeartBead
    case 'star':
      return StarBead
    case 'flower':
      return FlowerBead
    case 'charm':
      return CharmBead
    default:
      return RoundBead
  }
}

type BeadInstanceProps = {
  def: NonNullable<ReturnType<typeof getBeadDef>>
  position: THREE.Vector3
  tangent: THREE.Vector3
  radial: THREE.Vector3
  selected: boolean
  onClick: () => void
}

function BeadInstance({ def, position, tangent, radial, selected, onClick }: BeadInstanceProps) {
  const ref = useRef<THREE.Group>(null)
  const Component = getBeadComponent(def.shape)

  // orientation: we want beads to face outward radially, with tube/button axis aligning to tangent where appropriate
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion()
    // Build basis: tangent is one axis, radial outward is another, up is cross
    // For shapes that are "tube-like" (button, tube, pin), align their Y axis with tangent
    // For "face" shapes (heart, star, flower, charm), align front facing radial
    const isTubeLike = def.shape === 'button' || def.shape === 'tube' || def.shape === 'pin'
    if (isTubeLike) {
      // Align object Y to tangent
      const up = new THREE.Vector3(0, 1, 0)
      const target = tangent.clone().normalize()
      q.setFromUnitVectors(up, target)
    } else if (def.shape === 'round') {
      // no orientation needed, leave identity
      q.identity()
    } else {
      // Face outward: object's Z should face radial
      // Build rotation that looks outward
      // We want group to look at position + radial, with up ~ tangent
      const look = new THREE.Matrix4()
      const eye = position.clone()
      const center = position.clone().add(radial)
      const up = tangent.clone()
      look.lookAt(eye, center, up)
      // convert to quaternion and invert? lookAt creates world matrix with eye at origin looking at center
      // For proper orientation we can extract quaternion from look matrix
      // But lookAt matrix is view-like: we need to extract basis
      // Simpler: use quaternion that rotates (0,0,1) to radial
      const forward = new THREE.Vector3(0, 0, 1)
      const dir = radial.clone().normalize()
      q.setFromUnitVectors(forward, dir)
      // Tilt with tangent: apply additional twist to align up with tangent? For face shapes this rough is okay
      // Attempt to incorporate tangent as up: we can do a second rotation
      // We'll keep simple: just face radially
    }
    return q
  }, [def.shape, position, tangent, radial])

  return (
    <group position={position} quaternion={quaternion} ref={ref} onClick={(e) => { e.stopPropagation(); onClick() }} onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = 'auto' }}>
      <Component color={def.baseColor} accent={def.accentColor} scale={def.scale} selected={selected} />
      {selected ? (
        <mesh position={[0, def.shape === 'round' ? 0 : 0, 0]}>
          <sphereGeometry args={[0.26, 16, 16]} />
          <meshBasicMaterial color="#7b4fa8" transparent opacity={0.0} depthWrite={false} />
        </mesh>
      ) : null}
    </group>
  )
}

export default function BraceletScene({ cordId, beads, selectedIndex, onSelect, autoSpin }: Props) {
  const cord = getCordDef(cordId)
  const groupRef = useRef<THREE.Group>(null)

  const curve = useMemo(() => createBraceletCurve(1.58, 1.18, 96), [])

  // auto spin via rotating the whole bracelet group slowly around Y
  useFrame((_, delta) => {
    if (autoSpin && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35
    }
  })

  const beadTransforms = useMemo(() => {
    const total = beads.length
    if (total === 0) return []
    const arr: { position: THREE.Vector3; tangent: THREE.Vector3; radial: THREE.Vector3; id: string; index: number }[] = []
    for (let i = 0; i < total; i++) {
      const t = i / total // evenly spaced
      const point = curve.getPointAt(t)
      const tangent = curve.getTangentAt(t).normalize()
      const radial = new THREE.Vector3(point.x, 0, point.z).normalize()
      // If at center (unlikely degenerate), default radial outward
      if (radial.lengthSq() < 0.0001) radial.set(1, 0, 0)
      arr.push({ position: point.clone(), tangent, radial, id: beads[i], index: i })
    }
    return arr
  }, [beads, curve])

  return (
    <>
      {/* soft product lighting */}
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 3]} intensity={1.15} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-2.5, 3, -2.5]} intensity={0.55} />
      <pointLight position={[0, 2, 0]} intensity={0.6} decay={2} distance={6} color="#fff6ff" />
      {/* table plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.38, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial transparent opacity={0.12} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.39, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#fff7f0" roughness={0.85} />
      </mesh>

      <group ref={groupRef}>
        {cord ? <BraceletCord curve={curve} color={cord.color} /> : null}

        {beadTransforms.map(({ position, tangent, radial, id, index }) => {
          const def = getBeadDef(id)
          if (!def) return null
          const selected = selectedIndex === index
          return (
            <BeadInstance
              key={`${id}-${index}`}
              def={def}
              position={position}
              tangent={tangent}
              radial={radial}
              selected={selected}
              onClick={() => onSelect(index)}
            />
          )
        })}

        {/* selection ring on top of selected bead */}
        {selectedIndex !== null && beadTransforms[selectedIndex] ? (
          <BeadSelectionRing position={beadTransforms[selectedIndex].position} />
        ) : null}
      </group>

      {/* subtle contact shadow for grounded feel */}
      <ContactShadows position={[0, -0.37, 0]} opacity={0.22} scale={5} blur={2.2} far={2.5} />
    </>
  )
}
