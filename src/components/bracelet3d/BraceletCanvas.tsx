import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import BraceletScene from './BraceletScene'

type CameraPreset = 'front' | 'angled' | 'top'

const presetPositions: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  front: { pos: [0, 1.15, 4.1], target: [0, -0.05, 0] },
  angled: { pos: [2.55, 2.0, 2.75], target: [0, -0.05, 0] },
  top: { pos: [0, 4.3, 0.25], target: [0, -0.05, 0] },
}

type Props = {
  cordId: string
  beads: string[]
  selectedIndex: number | null
  onSelect: (index: number) => void
  autoSpin: boolean
  onAutoSpinToggle: () => void
  onRequestResetView: () => void
}

function FallbackMessage() {
  return (
    <div className="bracelet-fallback" role="status">
      <p><strong>Your workbench is a little shy today.</strong> The 3D viewer couldn&apos;t start, but your beads are still here. Try the little string below — it&apos;s still happy to play.</p>
    </div>
  )
}

function SceneWrapper({
  cordId,
  beads,
  selectedIndex,
  onSelect,
  autoSpin,
  cameraPreset,
  resetKey,
}: Props & { cameraPreset: CameraPreset; resetKey: number }) {
  const controlsRef = useRef<any>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  // animate to preset
  useEffect(() => {
    const preset = presetPositions[cameraPreset]
    const controls = controlsRef.current
    const cam = cameraRef.current
    if (!controls || !cam) return
    const target = new THREE.Vector3(...preset.target)
    const pos = new THREE.Vector3(...preset.pos)
    // immediate with lerp animation via simple timeout loop? Use gsap-like lerp for smoothness
    // Since we don't want extra deps, we'll do a quick lerp via requestAnimationFrame
    const startPos = cam.position.clone()
    const startTarget = controls.target.clone()
    let t = 0
    let raf = 0
    const animate = () => {
      t += 0.07
      if (t >= 1) {
        cam.position.copy(pos)
        controls.target.copy(target)
        controls.update()
        return
      }
      cam.position.lerpVectors(startPos, pos, easeInOut(t))
      controls.target.lerpVectors(startTarget, target, easeInOut(t))
      controls.update()
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [cameraPreset, resetKey])

  // Reset handler is handled via preset switch to angled? But we expose explicit reset: go to angled default
  // The parent calls setCameraPreset('angled') and increments resetKey - we already handle.

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={presetPositions.angled.pos} fov={40} />
      <BraceletScene cordId={cordId} beads={beads} selectedIndex={selectedIndex} onSelect={onSelect} autoSpin={autoSpin} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={2.2}
        maxDistance={7.5}
        minPolarAngle={0.001}
        maxPolarAngle={Math.PI - 0.001}
        target={new THREE.Vector3(0, 0, 0)}
      />
    </>
  )
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch() {
    // noop
  }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

export default function BraceletCanvas(props: Props) {
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('angled')
  const [resetKey, setResetKey] = useState(0)
  const [hasWebGL, setHasWebGL] = useState(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
      if (!gl) setHasWebGL(false)
    } catch {
      setHasWebGL(false)
    }
  }, [])

  if (!hasWebGL) {
    return <FallbackMessage />
  }

  const handleResetView = () => {
    setCameraPreset('angled')
    setResetKey((k) => k + 1)
    props.onRequestResetView()
  }

  return (
    <div className="bracelet-3d-frame" aria-label="Friendship bracelet 3D viewer">
      <div className="bracelet-canvas-wrap">
        <ErrorBoundary fallback={<FallbackMessage />}>
          <Canvas
            shadows="soft"
            dpr={[1, 1.8]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            onCreated={({ gl }) => {
              gl.setClearColor('#000000', 0)
              gl.toneMappingExposure = 1.0
            }}
            style={{ width: '100%', height: '100%' }}
            camera={{ position: presetPositions.angled.pos, fov: 40 }}
            aria-label="3D friendship bracelet viewer. Drag to turn it around, scroll to zoom."
          >
            <Suspense fallback={null}>
              <SceneWrapper {...props} cameraPreset={cameraPreset} resetKey={resetKey} />
            </Suspense>
          </Canvas>
        </ErrorBoundary>

        {/* canvas overlay helpers */}
        <span className="canvas-hint scribble" aria-hidden="true">drag to turn it • scroll to zoom</span>
      </div>

      <div className="view-controls" role="group" aria-label="View controls">
        <div className="view-presets">
          <span className="tiny-label">PEEK FROM</span>
          <div>
            <button type="button" className={cameraPreset === 'front' ? 'selected' : ''} aria-pressed={cameraPreset === 'front'} onClick={() => setCameraPreset('front')}>Front</button>
            <button type="button" className={cameraPreset === 'angled' ? 'selected' : ''} aria-pressed={cameraPreset === 'angled'} onClick={() => setCameraPreset('angled')}>Angled</button>
            <button type="button" className={cameraPreset === 'top' ? 'selected' : ''} aria-pressed={cameraPreset === 'top'} onClick={() => setCameraPreset('top')}>Top</button>
          </div>
        </div>
        <div className="view-actions">
          <button type="button" className="view-button" onClick={handleResetView} aria-label="Reset view to default framing">Reset view</button>
          <button
            type="button"
            className={`view-button ${props.autoSpin ? 'selected' : ''}`}
            aria-pressed={props.autoSpin}
            aria-label={props.autoSpin ? 'Turn off auto spin' : 'Turn on auto spin'}
            onClick={props.onAutoSpinToggle}
          >
            Auto spin {props.autoSpin ? 'on' : 'off'}
          </button>
        </div>
        <p className="view-note">Try turning it around. The little details are good from every angle.</p>
      </div>
    </div>
  )
}
